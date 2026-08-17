/// Genera la version ligera del logotipo que viaja dentro de los correos.
///
///   npx tsx scripts/make-email-logo.ts
///
/// El original tiene 3188 px de ancho y pesa 117 KB. Incrustar eso en cada
/// correo es absurdo: a 400 px se ve nitido incluso en pantallas de alta
/// densidad, porque se muestra a 150 px.
import sharp from "sharp";
import { resolve } from "node:path";

async function main() {
  const origen = resolve("public/brand/artiko-logo.png");
  const destino = resolve("public/brand/artiko-logo-email.png");

  const info = await sharp(origen)
    .resize({ width: 400 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(destino);

  console.log(
    `Generado ${destino}\n  ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`
  );
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
