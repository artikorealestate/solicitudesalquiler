/// Crea o borra dos inmuebles de ejemplo para poder ver el formulario
/// publico funcionando antes de tener catalogo real.
///
///   npm run demo:properties         crea
///   npm run demo:properties -- borrar
///
/// Se distinguen por la referencia DEMO-*, asi que el borrado nunca puede
/// llevarse por delante un inmueble de verdad.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_PREFIX = "DEMO-";

const demoProperties = [
  {
    reference: `${DEMO_PREFIX}ALQ-01`,
    title: "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer",
    operationType: "RENT" as const,
    zone: "Canet d'En Berenguer",
    address: "Calle de la Flor del Taronger",
    rentPrice: 1600,
    mainImageUrl:
      "https://img4.idealista.com/blur/480_360_mq/0/id.pro.es.image.master/1d/ee/45/1263388341.jpg",
    description: "Alquiler de temporada en Gran Canet, con vistas al mar.",
    status: "ACTIVE" as const
  },
  {
    reference: `${DEMO_PREFIX}VTA-01`,
    title: "Piso en Calle Mayor, Sagunto",
    operationType: "SALE" as const,
    zone: "Sagunto",
    address: "Calle Mayor",
    salePrice: 295000,
    description: "Vivienda reformada en el centro de Sagunto.",
    status: "ACTIVE" as const
  }
];

async function main() {
  const shouldRemove = process.argv.includes("borrar");

  if (shouldRemove) {
    const { count } = await prisma.property.deleteMany({
      where: { reference: { startsWith: DEMO_PREFIX } }
    });
    console.log(`Borrados ${count} inmuebles de ejemplo.`);
    return;
  }

  for (const property of demoProperties) {
    await prisma.property.upsert({
      where: { reference: property.reference },
      create: property,
      update: property
    });
    console.log(`Listo: ${property.reference} — ${property.title}`);
  }

  console.log(
    "\nAbre http://localhost:3000 para ver el formulario.\n" +
      "Para borrarlos despues: npm run demo:properties -- borrar\n"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
