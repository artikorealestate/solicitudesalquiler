import { randomBytes } from "node:crypto";
import { prisma } from "../src/lib/db";

/// Da un enlace personal a las solicitudes anteriores a que existiera.
///
/// Se ejecuta una vez. Las nuevas ya nacen con el suyo desde submit.ts.
async function main() {
  const sinEnlace = await prisma.application.findMany({
    where: { accessToken: null },
    select: { id: true, firstName: true, lastName: true, submittedAt: true }
  });

  if (sinEnlace.length === 0) {
    console.log("Todas las solicitudes tienen ya su enlace.");
    return;
  }

  for (const solicitud of sinEnlace) {
    await prisma.application.update({
      where: { id: solicitud.id },
      data: { accessToken: randomBytes(32).toString("base64url") }
    });
    console.log(
      `· ${solicitud.firstName} ${solicitud.lastName} (${solicitud.submittedAt.toLocaleDateString("es-ES")})`
    );
  }

  console.log(`\n${sinEnlace.length} solicitud(es) actualizada(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
