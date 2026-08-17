/// Radiografia rapida del estado del sistema.
///
///   npm run status
///
/// Sirve para saber en que punto esta todo sin abrir el panel: cuantos
/// inmuebles hay y en que estado, cuantas solicitudes, y si las piezas
/// externas (base de datos, Drive, correo) responden.
import { PrismaClient } from "@prisma/client";
import { isDriveConfigured } from "../src/lib/google/auth";

const prisma = new PrismaClient();

const propertyStatusLabels: Record<string, string> = {
  ACTIVE: "activos",
  PAUSED: "pausados",
  ARCHIVED: "archivados"
};

async function main() {
  console.log("\nEstado de Artiko Interesados\n");

  const [byStatus, applications, documents, batches] = await Promise.all([
    prisma.property.groupBy({ by: ["status"], _count: true }),
    prisma.application.count(),
    prisma.document.count(),
    prisma.importBatch.count({ where: { status: "PENDING" } })
  ]);

  const total = byStatus.reduce((sum, group) => sum + group._count, 0);

  console.log(`  Inmuebles: ${total}`);
  for (const group of byStatus) {
    console.log(
      `    ${propertyStatusLabels[group.status] ?? group.status}: ${group._count}`
    );
  }

  console.log(`  Solicitudes recibidas: ${applications}`);
  console.log(`  Documentos guardados: ${documents}`);
  if (batches > 0) {
    console.log(`  Sincronizaciones pendientes de revisar: ${batches}`);
  }

  console.log("\n  Conexiones:");
  console.log("    base de datos: conectada");
  console.log(
    `    google drive:  ${isDriveConfigured() ? "configurado" : "SIN CONFIGURAR"}`
  );
  console.log(
    `    correo:        ${process.env.SMTP_PASSWORD ? "configurado" : "SIN CONFIGURAR"}`
  );

  const active = byStatus.find((group) => group.status === "ACTIVE")?._count ?? 0;
  if (active === 0) {
    console.log(
      "\n  Aviso: no hay inmuebles activos, asi que el formulario publico\n" +
        "  no tiene nada que ofrecer. Activalos desde el panel.\n"
    );
  } else {
    console.log(
      `\n  El formulario publico ofrece ${active} inmueble(s).\n`
    );
  }
}

main()
  .catch((error) => {
    console.error("\nNo se ha podido leer el estado:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
