/// Genera un archivo HTML con los tres correos, para verlos en el navegador.
///
///   npx tsx --env-file=.env scripts/preview-emails-html.ts
///
/// El logo se sustituye por su version en linea, porque el identificador
/// interno del correo solo lo entiende un cliente de correo.
import { writeFileSync } from "node:fs";
import { es } from "../src/i18n/dictionaries/es";
import {
  buildApplicantEmail,
  buildDocumentRequestEmail,
  buildInternalEmail
} from "../src/lib/mail/templates";
import { ARTIKO_LOGO_BASE64 } from "../src/lib/mail/logo";
import { resolveDocumentItems } from "../src/lib/applications/document-catalog";

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
  monthlyIncome: "5200",
  employmentType: "permanent",
  provableIncome: "yes",
  moveInDate: "2026-10-01"
};

const correos = [
  {
    titulo: "1 · Confirmación al interesado (en su idioma)",
    ...buildApplicantEmail({
      dictionary: es,
      firstName: applicant.firstName,
      operation: "RENT",
      property,
      price: "1.600 €/mes",
      hadDocuments: true
    })
  },
  {
    titulo: "2 · Aviso interno a info@artikore.com",
    ...buildInternalEmail({
      applicationId: "muestra",
      operation: "RENT",
      locale: "es",
      applicant,
      property,
      price: "1.600 €/mes",
      answers,
      documentCount: 2,
      adminUrl: "https://artiko.vercel.app/admin/solicitudes/muestra",
      driveUrl: "https://drive.google.com/drive/folders/ejemplo"
    })
  },
  {
    titulo: "3 · Petición de documentación",
    ...buildDocumentRequestEmail({
      dictionary: es,
      firstName: applicant.firstName,
      property,
      items: resolveDocumentItems(
        ["id", "incomeProof", "employmentContract", "workHistory"],
        es.docs.items
      ),
      message: "Con la vida laboral nos vale la que descargues hoy mismo.",
      link: "https://artiko.vercel.app/documentos/muestra",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      locale: "es"
    })
  }
];

const dataUri = `data:image/png;base64,${ARTIKO_LOGO_BASE64}`;

const secciones = correos
  .map(
    (c) => `
  <section>
    <h2>${c.titulo}</h2>
    <p class="asunto"><b>Asunto:</b> ${c.subject}</p>
    <div class="marco">${c.html.replace(/cid:artiko-logo/g, dataUri)}</div>
  </section>`
  )
  .join("");

const salida = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Correos de Artiko Interesados</title>
<style>
 body{margin:0;padding:32px 16px;background:#F0ECE6;font-family:system-ui,sans-serif;color:#334155}
 h1{font-family:Georgia,serif;font-weight:400;color:#343434;text-align:center;margin:0 0 6px}
 .intro{text-align:center;color:#8a8a8a;font-size:14px;margin:0 0 36px}
 section{max-width:660px;margin:0 auto 44px}
 h2{font:400 18px Georgia,serif;color:#343434;margin:0 0 6px}
 .asunto{font-size:13px;color:#8a8a8a;margin:0 0 12px}
 .marco{border:1px solid #E5E1DA;border-radius:12px;overflow:hidden;background:#fff}
</style></head><body>
<h1>Correos automáticos de Artiko</h1>
<p class="intro">Así los recibe cada destinatario</p>
${secciones}
</body></html>`;

writeFileSync("email-preview.html", salida, "utf8");
console.log("Generado email-preview.html");
