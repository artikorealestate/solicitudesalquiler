/// Prueba de extremo a extremo del circuito de sincronizacion con Idealista,
/// sin pasar por el login de Google.
///
///   npm run smoke:sync
///
/// Recorre el camino real: credencial -> endpoint -> lote pendiente ->
/// comparacion. Al terminar deja la base de datos como estaba.
import { PrismaClient } from "@prisma/client";
import { buildBatchRows, type RawListing } from "../src/lib/idealista/batch";

const prisma = new PrismaClient();
const APP = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const TEST_EMAIL = "prueba-sincronizacion@artiko.local";

/// Anuncios calcados de los reales de Artiko en Idealista.
const listings: RawListing[] = [
  {
    idealistaId: "105799303",
    title: "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer",
    priceText: "1.600€/mes",
    url: "https://www.idealista.com/pro/artiko-real-estate/inmueble/105799303/",
    imageUrl: "https://img4.idealista.com/blur/480_360_mq/0/foto.jpg",
    description: "Alquiler de temporada en Gran Canet.",
    details: ["Garaje incluido", "2 hab.", "116 m²"]
  },
  {
    idealistaId: "104112233",
    title: "Chalet adosado en Antigua Moreria, Sagunto/Sagunt",
    priceText: "4.500€/mes",
    url: "https://www.idealista.com/pro/artiko-real-estate/inmueble/104112233/",
    imageUrl: null,
    description: "Edificio completo en alquiler para empresas.",
    details: ["8 hab.", "316 m²"]
  }
];

function check(label: string, condition: boolean, detail = "") {
  const mark = condition ? "OK  " : "FALLO";
  console.log(`  [${mark}] ${label}${detail ? ` — ${detail}` : ""}`);
  if (!condition) process.exitCode = 1;
}

async function main() {
  console.log("\nPrueba del circuito de sincronizacion con Idealista\n");

  const token = `prueba-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await prisma.adminUser.upsert({
    where: { email: TEST_EMAIL },
    create: { email: TEST_EMAIL, name: "Prueba", syncToken: token },
    update: { syncToken: token, active: true }
  });

  console.log("1. Credencial invalida");
  const rejected = await fetch(`${APP}/api/admin/idealista/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "x".repeat(30), listings })
  });
  check("se rechaza con 401", rejected.status === 401, `recibido ${rejected.status}`);

  console.log("\n2. Envio malformado");
  const malformed = await fetch(`${APP}/api/admin/idealista/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, listings: [{ sinCampos: true }] })
  });
  check("se rechaza con 400", malformed.status === 400, `recibido ${malformed.status}`);

  console.log("\n3. Envio valido");
  const response = await fetch(`${APP}/api/admin/idealista/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://www.idealista.com" },
    body: JSON.stringify({
      token,
      sourceUrl: "https://www.idealista.com/pro/artiko-real-estate/alquiler-viviendas/",
      hasMorePages: false,
      listings
    })
  });
  const body = (await response.json()) as { batchId?: string; received?: number };

  check("se acepta con 201", response.status === 201, `recibido ${response.status}`);
  check(
    "responde con la cabecera CORS de Idealista",
    response.headers.get("access-control-allow-origin") === "https://www.idealista.com"
  );
  check("devuelve identificador de lote", Boolean(body.batchId));
  check("confirma los 2 anuncios", body.received === 2);

  console.log("\n4. El lote queda pendiente, sin tocar los inmuebles");
  const batch = await prisma.importBatch.findUnique({
    where: { id: body.batchId! },
    select: { status: true, itemCount: true, payload: true }
  });
  check("estado PENDING", batch?.status === "PENDING");
  check("con los 2 anuncios", batch?.itemCount === 2);

  const created = await prisma.property.count({
    where: { idealistaId: { in: listings.map((l) => l.idealistaId) } }
  });
  check("no se ha creado ningun inmueble todavia", created === 0);

  console.log("\n5. Comparacion previa a confirmar");
  const rows = buildBatchRows(
    (batch!.payload as { listings: RawListing[] }).listings,
    []
  );
  check("los 2 salen como nuevos", rows.every((r) => r.state === "nuevo"));
  check(
    "el chalet adosado se interpreta bien",
    rows[1].listing.rentPrice === 4500 && rows[1].listing.zone === "Sagunto/Sagunt",
    `${rows[1].listing.rentPrice} € en ${rows[1].listing.zone}`
  );

  console.log("\n6. Limpieza");
  await prisma.importBatch.deleteMany({ where: { createdByEmail: TEST_EMAIL } });
  await prisma.adminUser.delete({ where: { email: TEST_EMAIL } });
  const leftovers = await prisma.adminUser.count({ where: { email: TEST_EMAIL } });
  check("no queda rastro de la prueba", leftovers === 0);

  console.log(
    process.exitCode === 1
      ? "\nHay comprobaciones fallidas.\n"
      : "\nCircuito completo verificado.\n"
  );
}

main()
  .catch((error) => {
    console.error("\nLa prueba ha fallado:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
