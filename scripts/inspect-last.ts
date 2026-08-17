/// Muestra el detalle de la ultima solicitud recibida, para diagnosticar.
///
///   npm run inspect:last
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const application = await prisma.application.findFirst({
    orderBy: { submittedAt: "desc" },
    include: {
      property: { select: { reference: true, title: true } },
      documents: true,
      consents: { select: { type: true, textVersion: true } }
    }
  });

  if (!application) {
    console.log("\nNo hay solicitudes.\n");
    return;
  }

  console.log("\nUltima solicitud\n");
  console.log(`  Interesado:  ${application.firstName} ${application.lastName}`);
  console.log(`  Email:       ${application.email}`);
  console.log(`  Telefono:    ${application.phone}`);
  console.log(`  Nacionalidad:${application.nationality ?? " (vacia)"}`);
  console.log(`  Documento:   ${application.idDocument ?? "(vacio)"}`);
  console.log(`  Operacion:   ${application.operation}`);
  console.log(`  Idioma:      ${application.locale}`);
  console.log(`  Inmueble:    ${application.property.reference} — ${application.property.title}`);
  console.log(`  Estado:      ${application.status}`);
  console.log(`  Enviada:     ${application.submittedAt.toLocaleString("es-ES")}`);

  console.log(`\n  Carpeta de Drive: ${application.driveFolderUrl ?? "NO SE CREO"}`);
  console.log(`  Documentos registrados: ${application.documents.length}`);
  for (const document of application.documents) {
    console.log(`    - ${document.fileName} (${Math.round(document.sizeBytes / 1024)} KB)`);
    console.log(`      ${document.driveViewUrl}`);
  }

  console.log(`\n  Consentimientos: ${application.consents.length}`);
  for (const consent of application.consents) {
    console.log(`    - ${consent.type} (${consent.textVersion})`);
  }

  const answers = application.answers as Record<string, string>;
  console.log(`\n  Respuestas: ${Object.keys(answers).length}`);
  for (const [key, value] of Object.entries(answers)) {
    console.log(`    ${key}: ${value}`);
  }
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
