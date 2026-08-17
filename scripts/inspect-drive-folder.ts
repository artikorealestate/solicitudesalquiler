/// Lista lo que hay dentro de la carpeta de Drive de la ultima solicitud.
///
///   npm run inspect:drive
///
/// Sirve para distinguir dos fallos que se parecen desde fuera:
///   - el archivo no llego a Drive
///   - el archivo llego pero no se registro en la base de datos
import { PrismaClient } from "@prisma/client";
import { getAccessToken } from "../src/lib/google/auth";

const prisma = new PrismaClient();

async function listFolder(folderId: string) {
  const token = await getAccessToken();
  const query = `'${folderId}' in parents and trashed=false`;

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}` +
      "&fields=files(id,name,mimeType,size,createdTime)",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error(`Drive respondio ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as {
    files: Array<{
      id: string;
      name: string;
      mimeType: string;
      size?: string;
      createdTime: string;
    }>;
  };
}

async function main() {
  const application = await prisma.application.findFirst({
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      driveFolderId: true,
      driveFolderUrl: true,
      _count: { select: { documents: true } }
    }
  });

  if (!application?.driveFolderId) {
    console.log("\nLa ultima solicitud no tiene carpeta de Drive.\n");
    return;
  }

  console.log(
    `\nCarpeta de ${application.firstName} ${application.lastName}\n` +
      `  ${application.driveFolderUrl}\n`
  );

  const { files } = await listFolder(application.driveFolderId);

  console.log(`  Archivos en Drive: ${files.length}`);
  for (const file of files) {
    const size = file.size ? `${Math.round(Number(file.size) / 1024)} KB` : "—";
    console.log(`    - ${file.name}  (${size})  ${file.mimeType}`);
  }

  console.log(`\n  Documentos registrados en la base de datos: ${application._count.documents}`);

  const subidos = files.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.document"
  ).length;

  if (subidos > application._count.documents) {
    console.log(
      "\n  DIAGNOSTICO: los archivos llegaron a Drive pero no se registraron.\n" +
        "  El fallo esta en el paso final de la subida.\n"
    );
  } else if (subidos === 0) {
    console.log(
      "\n  DIAGNOSTICO: no llego ningun archivo del interesado.\n" +
        "  O no adjunto nada, o la subida no llego a completarse.\n"
    );
  } else {
    console.log("\n  Drive y base de datos coinciden.\n");
  }
}

main()
  .catch((error) => {
    console.error("\nError:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
