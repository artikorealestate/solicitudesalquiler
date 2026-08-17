/// Activa un inmueble de alquiler y otro de venta para poder probar el
/// formulario publico.
///
///   npm run demo:activar
///
/// Es solo un atajo para las pruebas: en el uso real se activan desde el
/// panel, uno a uno o en bloque.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function activateOne(kind: "RENT" | "SALE") {
  const property = await prisma.property.findFirst({
    where: {
      status: "PAUSED",
      operationType: kind === "RENT" ? { in: ["RENT", "BOTH"] } : { in: ["SALE", "BOTH"] },
      ...(kind === "RENT" ? { rentPrice: { not: null } } : { salePrice: { not: null } })
    },
    orderBy: { updatedAt: "desc" }
  });

  if (!property) {
    console.log(`  No hay ningun inmueble pausado de ${kind}`);
    return;
  }

  await prisma.property.update({
    where: { id: property.id },
    data: { status: "ACTIVE" }
  });

  console.log(`  Activado [${property.reference}] ${property.title}`);
}

async function main() {
  console.log("\nActivando inmuebles de prueba\n");
  await activateOne("RENT");
  await activateOne("SALE");

  const active = await prisma.property.count({ where: { status: "ACTIVE" } });
  console.log(`\n  Inmuebles activos ahora: ${active}\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
