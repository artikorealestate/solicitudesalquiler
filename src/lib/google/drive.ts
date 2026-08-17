import { getAccessToken } from "./auth";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3";
const FOLDER_MIME = "application/vnd.google-apps.folder";

export const ROOT_FOLDER_NAME = "Clientes interesados";

async function driveFetch(url: string, init: RequestInit = {}) {
  const token = await getAccessToken();

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Drive respondio ${response.status}: ${detail}`);
  }

  return response;
}

/// Drive permite casi cualquier caracter en los nombres, pero las barras
/// confunden al leer rutas y las comillas rompen las consultas de busqueda.
export function sanitizeFolderName(name: string): string {
  return name
    .replace(/[/\\]/g, "-")
    .replace(/['"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/// Busca una carpeta por nombre dentro de un padre y la crea si no existe.
///
/// Con el permiso `drive.file` la busqueda solo ve carpetas creadas por esta
/// aplicacion, que es justo lo que queremos: no tocamos nada del Drive que no
/// hayamos hecho nosotros.
export async function getOrCreateFolder(
  name: string,
  parentId: string
): Promise<string> {
  const safeName = sanitizeFolderName(name);
  const escaped = safeName.replace(/'/g, "\\'");

  const query = [
    `mimeType='${FOLDER_MIME}'`,
    `name='${escaped}'`,
    `'${parentId}' in parents`,
    "trashed=false"
  ].join(" and ");

  const search = await driveFetch(
    `${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1`
  );
  const found = (await search.json()) as { files: Array<{ id: string }> };

  if (found.files.length > 0) return found.files[0].id;

  const created = await driveFetch(`${DRIVE_API}/files?fields=id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: safeName,
      mimeType: FOLDER_MIME,
      parents: [parentId]
    })
  });

  const folder = (await created.json()) as { id: string };
  return folder.id;
}

export function folderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

/// Nombre de la carpeta de un interesado: "2026-08-14 - Ana Garcia Lopez".
/// La fecha va delante para que Drive las ordene cronologicamente solo.
export function applicantFolderName(
  submittedAt: Date,
  firstName: string,
  lastName: string
): string {
  const date = submittedAt.toISOString().slice(0, 10);
  return sanitizeFolderName(`${date} - ${firstName} ${lastName}`);
}

/// Crea (o reutiliza) toda la ruta hasta la carpeta del interesado:
///
///   Clientes interesados / Alquiler / REF-01 - Piso... / 2026-08-14 - Ana Garcia
///
/// Devuelve el identificador de la carpeta del interesado y el de la del
/// inmueble, para poder cachear esta ultima y ahorrar busquedas.
export async function ensureApplicantFolder(input: {
  operation: "RENT" | "SALE";
  propertyReference: string;
  propertyTitle: string;
  cachedPropertyFolderId?: string | null;
  submittedAt: Date;
  firstName: string;
  lastName: string;
}): Promise<{ applicantFolderId: string; propertyFolderId: string }> {
  const parentRoot = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || "root";

  let propertyFolderId = input.cachedPropertyFolderId ?? null;

  if (!propertyFolderId) {
    const rootId = await getOrCreateFolder(ROOT_FOLDER_NAME, parentRoot);
    const operationId = await getOrCreateFolder(
      input.operation === "RENT" ? "Alquiler" : "Compra",
      rootId
    );
    propertyFolderId = await getOrCreateFolder(
      `${input.propertyReference} - ${input.propertyTitle}`,
      operationId
    );
  }

  const applicantFolderId = await getOrCreateFolder(
    applicantFolderName(input.submittedAt, input.firstName, input.lastName),
    propertyFolderId
  );

  return { applicantFolderId, propertyFolderId };
}

/// Abre una sesion de subida reanudable y devuelve su direccion.
///
/// El navegador sube los bytes directamente a esa direccion, sin pasar por
/// nuestro servidor. Es obligatorio: las funciones de Vercel rechazan las
/// peticiones de mas de 4,5 MB, y una nomina escaneada las supera con
/// facilidad.
///
/// La direccion devuelta ya lleva la autorizacion incorporada, asi que el
/// navegador nunca ve nuestro token de Google.
export async function createResumableUpload(input: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  parentFolderId: string;
  origin: string;
}): Promise<string> {
  const token = await getAccessToken();

  const response = await fetch(
    `${DRIVE_UPLOAD}/files?uploadType=resumable&fields=id`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": input.mimeType,
        "X-Upload-Content-Length": String(input.sizeBytes),
        // Sin esta cabecera Google no devuelve las cabeceras CORS y el
        // navegador bloquea la subida desde nuestra pagina.
        Origin: input.origin
      },
      body: JSON.stringify({
        name: sanitizeFolderName(input.fileName),
        parents: [input.parentFolderId]
      })
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `No se ha podido abrir la subida a Drive (${response.status}): ${detail}`
    );
  }

  const location = response.headers.get("location");
  if (!location) {
    throw new Error("Google no ha devuelto la direccion de subida.");
  }

  return location;
}

/// Sube el resumen de respuestas como documento de Google.
///
/// Se envia HTML y Drive lo convierte a documento nativo, asi Artiko puede
/// leerlo, comentarlo y compartirlo desde el propio Drive sin descargar nada.
export async function uploadSummaryDocument(input: {
  name: string;
  html: string;
  parentFolderId: string;
}): Promise<{ id: string; webViewLink: string }> {
  const token = await getAccessToken();
  const boundary = `artiko-${Date.now()}`;

  const metadata = {
    name: sanitizeFolderName(input.name),
    parents: [input.parentFolderId],
    mimeType: "application/vnd.google-apps.document"
  };

  const body =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    "Content-Type: text/html; charset=UTF-8\r\n\r\n" +
    `${input.html}\r\n` +
    `--${boundary}--`;

  const response = await fetch(
    `${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,webViewLink`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `No se ha podido crear el resumen en Drive (${response.status}): ${detail}`
    );
  }

  return (await response.json()) as { id: string; webViewLink: string };
}

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
};

/// Lista lo que hay dentro de una carpeta.
///
/// Se usa para comprobar desde el servidor que los documentos que el
/// navegador dijo haber subido estan realmente ahi.
export async function listFolderFiles(folderId: string): Promise<DriveFile[]> {
  const query = `'${folderId}' in parents and trashed=false`;

  const response = await driveFetch(
    `${DRIVE_API}/files?q=${encodeURIComponent(query)}` +
      "&fields=files(id,name,mimeType,size,webViewLink)&pageSize=100"
  );

  const body = (await response.json()) as { files: DriveFile[] };
  return body.files;
}

/// Manda una carpeta a la papelera de Drive, con todo lo que contiene.
///
/// A la papelera y no borrado definitivo: Drive la conserva 30 dias, asi que
/// un borrado por error tiene arreglo. Pasado ese plazo desaparece sola, que
/// es justo lo que pide el RGPD para la documentacion de un candidato
/// descartado.
export async function trashFolder(folderId: string): Promise<void> {
  await driveFetch(`${DRIVE_API}/files/${folderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trashed: true })
  });
}

/// Datos publicos de un archivo ya subido, para guardar su enlace.
export async function getFileLink(fileId: string): Promise<string> {
  const response = await driveFetch(
    `${DRIVE_API}/files/${fileId}?fields=webViewLink`
  );
  const file = (await response.json()) as { webViewLink?: string };
  return file.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`;
}
