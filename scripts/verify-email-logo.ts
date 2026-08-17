/// Comprueba que el logotipo viaja correctamente dentro del correo.
///
///   npx tsx --env-file=.env scripts/verify-email-logo.ts
///
/// Construye el mensaje sin enviarlo y revisa el MIME resultante: que lleve
/// el adjunto, que el identificador coincida con el que usa el HTML, y que la
/// imagen sea un PNG valido.
import nodemailer from "nodemailer";
import { es } from "../src/i18n/dictionaries/es";
import { LOGO_ATTACHMENT, buildApplicantEmail } from "../src/lib/mail/templates";

function check(label: string, ok: boolean, detail = "") {
  console.log(`  [${ok ? "OK  " : "FALLO"}] ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  console.log("\nVerificacion del logotipo en los correos\n");

  const mensaje = buildApplicantEmail({
    dictionary: es,
    firstName: "Ana",
    operation: "RENT",
    property: { reference: "195", title: "Piso de prueba", zone: "Sagunto" },
    price: "1.600 €/mes",
    hadDocuments: true
  });

  // Transporte que no envia: solo compone el mensaje y lo devuelve.
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const info = await transport.sendMail({
    from: "Artiko <artiko@example.com>",
    to: "prueba@example.com",
    subject: mensaje.subject,
    html: mensaje.html,
    text: mensaje.text,
    attachments: [LOGO_ATTACHMENT]
  });

  const mime = (info.message as Buffer).toString("utf8");

  check("el HTML apunta al logo incrustado", mensaje.html.includes("cid:artiko-logo"));
  check("el mensaje incluye el adjunto", mime.includes("Content-ID: <artiko-logo>"));
  check("va marcado como imagen PNG", /Content-Type: image\/png/i.test(mime));
  check(
    "se envia como contenido embebido, no como fichero suelto",
    /Content-Disposition: inline/i.test(mime)
  );

  const bytes = Buffer.from(LOGO_ATTACHMENT.content, "base64");
  const esPng = bytes[0] === 0x89 && bytes.toString("ascii", 1, 4) === "PNG";
  check("los datos son un PNG valido", esPng, `${Math.round(bytes.length / 1024)} KB`);

  check(
    "el correo completo pesa poco",
    mime.length < 60_000,
    `${Math.round(mime.length / 1024)} KB`
  );

  check(
    "hay nombre en texto por si bloquean la imagen",
    mensaje.html.includes("ARTIKO REAL ESTATE")
  );

  console.log(
    process.exitCode === 1 ? "\nHay comprobaciones fallidas.\n" : "\nTodo correcto.\n"
  );
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
