/// Lista todo lo que la aplicacion ha creado en el Drive de Artiko.
///
///   npm run drive:audit
///
/// Con el permiso `drive.file` solo vemos lo nuestro, asi que esto es
/// exactamente el inventario de lo que la app ha subido.
import { getAccessToken } from "../src/lib/google/auth";

async function main() {
  const token = await getAccessToken();

  // Incluye la papelera a proposito. Sin ella es imposible distinguir "la app
  // no lo creo" de "se creo y alguien lo borro despues", y eso ya nos ha
  // costado un rato de diagnostico.
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files?" +
      "pageSize=200&orderBy=createdTime desc&" +
      "fields=files(id,name,mimeType,size,createdTime,parents,trashed)",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  const { files } = (await response.json()) as {
    files: Array<{
      id: string;
      name: string;
      mimeType: string;
      size?: string;
      createdTime: string;
      parents?: string[];
      trashed: boolean;
    }>;
  };

  const marca = (f: { trashed: boolean }) =>
    f.trashed ? "[PAPELERA]" : "[activo]  ";

  const carpetas = files.filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder"
  );
  const documentos = files.filter(
    (f) => f.mimeType === "application/vnd.google-apps.document"
  );
  const subidos = files.filter(
    (f) =>
      f.mimeType !== "application/vnd.google-apps.folder" &&
      f.mimeType !== "application/vnd.google-apps.document"
  );

  console.log(`\nInventario de lo que la app ha creado (${files.length} elementos)\n`);

  console.log(`  Carpetas (${carpetas.length}):`);
  for (const f of carpetas) {
    console.log(`    ${marca(f)} ${f.name}`);
  }

  console.log(`\n  Documentos de resumen (${documentos.length}):`);
  for (const f of documentos) {
    console.log(
      `    ${marca(f)} ${f.name}  — ${new Date(f.createdTime).toLocaleString("es-ES")}`
    );
  }

  console.log(`\n  Archivos subidos por interesados (${subidos.length}):`);
  for (const f of subidos) {
    const kb = f.size ? `${Math.round(Number(f.size) / 1024)} KB` : "sin tamano";
    console.log(`    ${marca(f)} ${f.name}  (${kb})`);
  }
  console.log("");
}

main().catch((error) => {
  console.error("\nError:", error instanceof Error ? error.message : error, "\n");
  process.exitCode = 1;
});
