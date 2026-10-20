import { prisma } from "../src/lib/db";
import {
  applicationRetention,
  retentionSelect,
} from "../src/lib/privacy/application-retention";
import {
  daysUntilDeletion,
  isDue,
  isInWarningWindow,
} from "../src/lib/privacy/retention";

/// Calendario de borrados, SOLO LECTURA.
///
/// Enseña cuando se borraria cada solicitud segun el plazo de conservacion,
/// con la misma regla que aplica el proceso diario. No borra ni avisa a
/// nadie: sirve para comprobar que pasara antes de que pase.
///
///   npm run retention:preview

async function main() {
  const now = new Date();

  const applications = await prisma.application.findMany({
    select: {
      ...retentionSelect,
      id: true,
      firstName: true,
      lastName: true,
      property: { select: { reference: true } },
    },
  });

  const rows = applications
    .map((application) => ({
      application,
      retention: applicationRetention(application),
    }))
    .sort((a, b) => {
      const ta =
        a.retention.kind === "scheduled"
          ? a.retention.deleteAfter.getTime()
          : Infinity;
      const tb =
        b.retention.kind === "scheduled"
          ? b.retention.deleteAfter.getTime()
          : Infinity;
      return ta - tb;
    });

  console.log(`Calendario de borrados a ${now.toLocaleString("es-ES")}\n`);

  for (const { application, retention } of rows) {
    const name = `${application.firstName} ${application.lastName}`
      .slice(0, 28)
      .padEnd(28);
    const ref = `ref ${application.property.reference}`.padEnd(14);
    const status = application.status.padEnd(14);

    if (retention.kind === "contract") {
      console.log(`  ${name} ${ref} ${status} no se borra sola (contrato)`);
      continue;
    }

    const label = isDue(retention, now)
      ? "VENCIDA: se borra en la proxima ejecucion"
      : isInWarningWindow(retention, now)
        ? `AVISO: se borra en ${daysUntilDeletion(retention, now)} dias`
        : `en ${daysUntilDeletion(retention, now)} dias`;

    console.log(
      `  ${name} ${ref} ${status} ${retention.deleteAfter.toLocaleDateString("es-ES").padEnd(11)} ` +
        `(${retention.months} meses) · ${label}`,
    );
  }

  const due = rows.filter((r) => isDue(r.retention, now)).length;
  const warning = rows.filter((r) =>
    isInWarningWindow(r.retention, now),
  ).length;
  console.log(
    `\n${rows.length} solicitudes · ${due} vencidas · ${warning} en aviso`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
