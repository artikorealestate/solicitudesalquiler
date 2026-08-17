/// Comprobacion manual del envio de correo.
///
///   npm run email:test
///
/// Verifica que las credenciales SMTP son validas y manda un correo de prueba
/// a las direcciones de INTERNAL_NOTIFICATION_EMAILS.
import { getFromAddress, getInternalRecipients, getMailer } from "../src/lib/mail/transport";

async function main() {
  const mailer = getMailer();
  const recipients = getInternalRecipients();

  if (recipients.length === 0) {
    throw new Error("INTERNAL_NOTIFICATION_EMAILS esta vacio: no hay a quien enviar.");
  }

  process.stdout.write("Comprobando credenciales SMTP... ");
  await mailer.verify();
  process.stdout.write("correctas.\n");

  const info = await mailer.sendMail({
    from: getFromAddress(),
    to: recipients,
    subject: "Artiko Interesados - correo de prueba",
    text:
      "Si estas leyendo esto, el envio automatico de correos de Artiko Interesados funciona.\n\n" +
      "Este mensaje lo genero el script de prueba; puedes borrarlo."
  });

  console.log(`Enviado a ${recipients.join(", ")}`);
  console.log(`Identificador del mensaje: ${info.messageId}`);
}

main().catch((error: unknown) => {
  console.error("\nEl envio ha fallado:\n");
  console.error(error instanceof Error ? error.message : error);
  console.error(
    "\nCausas habituales:\n" +
      "  - La contrasena de aplicacion esta mal copiada (son 16 letras, sin espacios).\n" +
      "  - La verificacion en dos pasos no esta activada en la cuenta de Google.\n" +
      "  - SMTP_USER no coincide con la cuenta que genero la contrasena.\n"
  );
  process.exitCode = 1;
});
