/// Envia una muestra de los dos correos automaticos para poder verlos en un
/// cliente de correo real.
///
///   npm run email:preview
///
/// Se mandan a INTERNAL_NOTIFICATION_EMAILS, nunca a un interesado.
import { es } from "../src/i18n/dictionaries/es";
import {
  LOGO_ATTACHMENT,
  buildApplicantEmail,
  buildDocumentRequestEmail,
  buildInternalEmail
} from "../src/lib/mail/templates";
import { resolveDocumentItems } from "../src/lib/applications/document-catalog";
import {
  getFromAddress,
  getInternalRecipients,
  getMailer
} from "../src/lib/mail/transport";

const property = {
  reference: "195",
  title: "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer",
  zone: "Canet d'En Berenguer"
};

const applicant = {
  firstName: "Ana",
  lastName: "García López",
  email: "ana.garcia@example.com",
  phone: "600 123 456"
};

const answers: Record<string, string> = {
  householdSize: "2",
  relationship: "couple",
  moveInDate: "2026-10-01",
  occupation: "Enfermera y profesor",
  employmentType: "permanent",
  provableIncome: "yes",
  monthlyIncome: "5200",
  pets: "no",
  searchDuration: "oneToThree",
  visitedOthers: "yes",
  documentsReady: "yes"
};

async function main() {
  const mailer = getMailer();
  const recipients = getInternalRecipients();

  if (recipients.length === 0) {
    throw new Error("INTERNAL_NOTIFICATION_EMAILS esta vacio.");
  }

  const applicantEmail = buildApplicantEmail({
    dictionary: es,
    firstName: applicant.firstName,
    operation: "RENT",
    property,
    price: "1.600 €/mes",
    hadDocuments: true,
    selfServiceUrl: "https://artiko-interesados.vercel.app/solicitud/token-de-ejemplo"
  });

  const internalEmail = buildInternalEmail({
    applicationId: "muestra-1234",
    operation: "RENT",
    locale: "es",
    applicant,
    property,
    price: "1.600 €/mes",
    answers,
    documentCount: 3,
    adminUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/solicitudes/muestra-1234`,
    driveUrl: "https://drive.google.com/drive/folders/ejemplo"
  });

  const documentEmail = buildDocumentRequestEmail({
    dictionary: es,
    firstName: applicant.firstName,
    property,
    items: resolveDocumentItems(
      ["id", "incomeProof", "employmentContract", "workHistory"],
      es.docs.items
    ),
    message: "Con la vida laboral nos vale la que descargues hoy mismo.",
    link: "https://ejemplo.artikore.com/documentos/muestra",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    locale: "es"
  });

  for (const [label, message] of [
    ["confirmacion al interesado", applicantEmail],
    ["aviso interno a Artiko", internalEmail],
    ["peticion de documentacion", documentEmail]
  ] as const) {
    await mailer.sendMail({
      from: getFromAddress(),
      to: recipients,
      subject: `[MUESTRA] ${message.subject}`,
      html: message.html,
      text: message.text,
      attachments: [LOGO_ATTACHMENT]
    });
    console.log(`Enviada la muestra de ${label}`);
  }

  console.log(`\nRevisa la bandeja de ${recipients.join(", ")}\n`);
}

main().catch((error) => {
  console.error("\nHa fallado el envio:\n", error);
  process.exitCode = 1;
});
