/// Comprueba que la conexion con Google Drive funciona de verdad.
///
///   npm run drive:check
///
/// Renueva el token, crea (o reutiliza) el arbol de carpetas real y sube un
/// documento de prueba que luego borra. No toca nada mas del Drive: con el
/// permiso `drive.file` la app solo ve lo que ella misma ha creado.
import { getAccessToken, isDriveConfigured } from "../src/lib/google/auth";
import {
  ROOT_FOLDER_NAME,
  folderUrl,
  getOrCreateFolder,
  uploadSummaryDocument
} from "../src/lib/google/drive";

function ok(label: string, detail = "") {
  console.log(`  [OK  ] ${label}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log("\nComprobacion de Google Drive\n");

  if (!isDriveConfigured()) {
    console.error(
      "  [FALLO] Faltan credenciales. Entra en el panel y pulsa 'Conectar Google Drive'.\n"
    );
    process.exitCode = 1;
    return;
  }
  ok("credenciales presentes");

  const token = await getAccessToken();
  ok("token renovado", `${token.length} caracteres`);

  const parentRoot = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || "root";

  const rootId = await getOrCreateFolder(ROOT_FOLDER_NAME, parentRoot);
  ok(`carpeta "${ROOT_FOLDER_NAME}"`, folderUrl(rootId));

  const alquilerId = await getOrCreateFolder("Alquiler", rootId);
  ok("carpeta Alquiler", folderUrl(alquilerId));

  const compraId = await getOrCreateFolder("Compra", rootId);
  ok("carpeta Compra", folderUrl(compraId));

  // Segunda llamada: debe devolver la MISMA carpeta, no crear una nueva.
  const alquilerOtraVez = await getOrCreateFolder("Alquiler", rootId);
  if (alquilerOtraVez === alquilerId) {
    ok("no duplica carpetas al repetir");
  } else {
    console.error("  [FALLO] Se ha creado una carpeta Alquiler duplicada");
    process.exitCode = 1;
  }

  const doc = await uploadSummaryDocument({
    name: "Prueba de conexion (se puede borrar)",
    parentFolderId: rootId,
    html: "<h1>Prueba</h1><p>Si ves esto, Artiko Interesados puede escribir en tu Drive.</p>"
  });
  ok("documento de prueba creado", doc.webViewLink);

  console.log(
    `\nTodo correcto. Abre la carpeta y comprueba que la ves:\n  ${folderUrl(rootId)}\n\n` +
      "Puedes borrar el documento 'Prueba de conexion' cuando quieras.\n"
  );
}

main().catch((error) => {
  console.error(
    "\n  [FALLO]",
    error instanceof Error ? error.message : error,
    "\n\nSi habla de token revocado o invalido, entra en el panel y vuelve a\n" +
      "pulsar 'Conectar Google Drive'.\n"
  );
  process.exitCode = 1;
});
