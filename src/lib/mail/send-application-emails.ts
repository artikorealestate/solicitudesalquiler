import type { Dictionary } from "@/i18n";
import {
  getFromAddress,
  getInternalRecipients,
  getMailer,
} from "@/lib/mail/transport";
import {
  LOGO_ATTACHMENT,
  buildApplicantEmail,
  buildInternalEmail,
} from "@/lib/mail/templates";

/// Envia los dos correos de una solicitud: la confirmacion al interesado (en
/// su idioma) y el aviso interno a Artiko.
///
/// Nunca lanza. La solicitud ya esta guardada cuando se llama a esto, y que
/// el correo falle no puede tumbar el envio del formulario ni hacer creer al
/// interesado que su solicitud se ha perdido.
export async function sendApplicationEmails(input: {
  dictionary: Dictionary;
  applicationId: string;
  operation: "RENT" | "SALE";
  locale: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  property: { reference: string; title: string; zone: string | null };
  price: string;
  answers: Record<string, string>;
  documentCount: number;
  driveUrl: string | null;
  /// Credencial del enlace personal del interesado, para que pueda volver a
  /// su solicitud y anadir lo que le falte.
  accessToken: string | null;
}): Promise<{ applicantSent: boolean; internalSent: boolean }> {
  const result = { applicantSent: false, internalSent: false };

  let mailer: ReturnType<typeof getMailer>;
  try {
    mailer = getMailer();
  } catch (error) {
    console.error("[email] Sin configuracion de envio:", error);
    return result;
  }

  const from = getFromAddress();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const adminUrl = `${appUrl}/admin/solicitudes/${input.applicationId}`;

  // --- Confirmacion al interesado ---
  try {
    const message = buildApplicantEmail({
      dictionary: input.dictionary,
      firstName: input.applicant.firstName,
      operation: input.operation,
      property: input.property,
      price: input.price,
      hadDocuments: input.documentCount > 0,
      selfServiceUrl: input.accessToken
        ? `${appUrl}/solicitud/${input.accessToken}`
        : null,
    });

    await mailer.sendMail({
      from,
      to: input.applicant.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: [LOGO_ATTACHMENT],
    });

    result.applicantSent = true;
  } catch (error) {
    console.error(
      `[email] No se ha podido avisar al interesado de la solicitud ${input.applicationId}:`,
      error,
    );
  }

  // --- Aviso interno ---
  const recipients = getInternalRecipients();

  if (recipients.length === 0) {
    console.warn("[email] INTERNAL_NOTIFICATION_EMAILS esta vacio.");
    return result;
  }

  try {
    const message = buildInternalEmail({
      applicationId: input.applicationId,
      operation: input.operation,
      locale: input.locale,
      applicant: input.applicant,
      property: input.property,
      price: input.price,
      answers: input.answers,
      documentCount: input.documentCount,
      adminUrl,
      driveUrl: input.driveUrl,
    });

    await mailer.sendMail({
      from,
      to: recipients,
      // Si Artiko responde, que la respuesta le llegue al interesado
      // directamente en lugar de a la propia cuenta de envio.
      replyTo: input.applicant.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: [LOGO_ATTACHMENT],
    });

    result.internalSent = true;
  } catch (error) {
    console.error(
      `[email] No se ha podido avisar a Artiko de la solicitud ${input.applicationId}:`,
      error,
    );
  }

  return result;
}
