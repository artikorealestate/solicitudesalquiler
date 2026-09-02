/// Sube los documentos del interesado desde su navegador directamente a
/// Google Drive.
///
/// Por que no pasan por nuestro servidor: las funciones de Vercel rechazan
/// las peticiones de mas de 4,5 MB, y una nomina escaneada o una foto de
/// pasaporte se pasan sin esfuerzo. El servidor solo abre la sesion de subida
/// y despues registra el resultado.
///
/// Los archivos se suben TAL CUAL, sin recomprimir ni redimensionar. Artiko
/// necesita poder coger el documento de Drive y usarlo directamente —mandarlo
/// a una aseguradora, adjuntarlo a un contrato— y un archivo degradado puede
/// llegar ilegible o ser rechazado.

export type UploadProgress = {
  /// Porcentaje del total, contando todos los archivos.
  percent: number;
  filesDone: number;
  totalFiles: number;
};

export type UploadOutcome = {
  uploaded: number;
  failed: Array<{ fileName: string; reason: string }>;
};

/// Cuantos archivos se suben a la vez.
///
/// Tres es el punto dulce: aprovecha el ancho de banda de subida sin que
/// ninguno se quede sin avanzar. De uno en uno se desperdicia la conexion; a
/// la vez todos, en movil, se atascan entre ellos.
const CONCURRENCY = 3;

/// Sube los bytes con XMLHttpRequest en lugar de fetch.
///
/// No es nostalgia: fetch todavia no informa del progreso de subida en la
/// mayoria de navegadores, y sin eso no hay forma de decirle a la persona
/// cuanto le queda.
function putWithProgress(
  url: string,
  file: File,
  onBytes: (bytes: number) => void,
): Promise<{ id: string }> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url, true);
    request.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onBytes(event.loaded);
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          resolve(JSON.parse(request.responseText) as { id: string });
        } catch {
          reject(new Error("respuesta-ilegible"));
        }
      } else {
        reject(new Error(`drive-${request.status}`));
      }
    };

    request.onerror = () => reject(new Error("conexion"));
    request.onabort = () => reject(new Error("cancelado"));

    request.send(file);
  });
}

async function uploadOne(
  file: File,
  applicationId: string,
  ticket: string,
  onBytes: (bytes: number) => void,
): Promise<void> {
  const sessionResponse = await fetch("/api/upload/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationId,
      ticket,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    }),
  });

  if (!sessionResponse.ok) {
    const body = (await sessionResponse.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error ?? `sesion-${sessionResponse.status}`);
  }

  const { uploadUrl } = (await sessionResponse.json()) as { uploadUrl: string };

  const uploaded = await putWithProgress(uploadUrl, file, onBytes);

  const completeResponse = await fetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationId,
      ticket,
      driveFileId: uploaded.id,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    }),
  });

  if (!completeResponse.ok) {
    throw new Error(`registro-${completeResponse.status}`);
  }
}

/// Sube los archivos en paralelo, de tres en tres.
///
/// Un fallo no detiene los demas: se informa al final de cuales no han
/// subido, sin perder los que si.
export async function uploadDocuments(
  files: File[],
  applicationId: string,
  ticket: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadOutcome> {
  const failed: UploadOutcome["failed"] = [];
  let uploaded = 0;
  let filesDone = 0;

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0) || 1;
  const bytesPerFile = new Array<number>(files.length).fill(0);

  function report() {
    const done = bytesPerFile.reduce((sum, bytes) => sum + bytes, 0);
    onProgress?.({
      percent: Math.min(99, Math.round((done / totalBytes) * 100)),
      filesDone,
      totalFiles: files.length,
    });
  }

  // Cola compartida: cada hilo coge el siguiente archivo libre en cuanto
  // termina el suyo, en lugar de repartirlos por adelantado. Asi un archivo
  // grande no deja a los demas esperando.
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= files.length) return;

      const file = files[index];

      try {
        await uploadOne(file, applicationId, ticket, (bytes) => {
          bytesPerFile[index] = bytes;
          report();
        });
        bytesPerFile[index] = file.size;
        uploaded += 1;
      } catch (error) {
        // El archivo que falla deja de contar para el progreso, para que la
        // barra no se quede clavada esperandolo.
        bytesPerFile[index] = file.size;
        failed.push({
          fileName: file.name,
          reason: error instanceof Error ? error.message : "desconocido",
        });
      } finally {
        filesDone += 1;
        report();
      }
    }
  }

  report();
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker),
  );

  // Red de seguridad: el servidor mira la carpeta de Drive y da de alta lo
  // que este subido pero sin registrar.
  //
  // Un archivo puede llegar a Drive sin que el navegador consiga leer la
  // respuesta de Google. Sin esta comprobacion, el documento existe pero el
  // panel dice "sin documentacion", que es peor que un fallo limpio: Artiko
  // creeria que falta algo que en realidad tiene.
  try {
    const response = await fetch("/api/upload/reconcile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, ticket }),
    });

    if (response.ok) {
      const { recovered } = (await response.json()) as { recovered: number };

      // Lo recuperado deja de contar como fallido.
      for (let i = 0; i < recovered && failed.length > 0; i += 1) {
        failed.pop();
        uploaded += 1;
      }
    }
  } catch {
    // Si tambien falla la comprobacion, nos quedamos con lo que sabiamos.
  }

  onProgress?.({
    percent: 100,
    filesDone: files.length,
    totalFiles: files.length,
  });

  return { uploaded, failed };
}
