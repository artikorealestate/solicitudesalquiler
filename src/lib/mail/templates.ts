import { describeStay, isSeasonalStay } from "@/lib/applications/stay";
import type { Dictionary } from "@/i18n";
import { interpolate } from "@/i18n";
import { ARTIKO_LOGO_BASE64 } from "@/lib/mail/logo";
import {
  localeLabels,
  operationLabels,
  questionLabelsFor,
  readableAnswer,
} from "@/lib/applications/labels";

/// Plantillas de los dos correos que salen con cada solicitud.
///
/// HTML sencillo y en tablas a proposito: los clientes de correo no soportan
/// hojas de estilo modernas, y Gmail recorta lo que no entiende. Los colores
/// son los de la marca, pero sin florituras que puedan romperse.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GOLD = "#CAB269";
const INK = "#343434";
const BODY = "#334155";
const CREAM = "#F7F5F2";
const LINE = "#E5E1DA";

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function websiteUrl(): string {
  return process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://artikore.com";
}

/// Enlace de WhatsApp. Solo digitos con prefijo de pais.
export function whatsappUrl(text?: string): string | null {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
  if (!number) return null;

  return text
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${number}`;
}

/// Identificador del logotipo incrustado en el propio correo.
const LOGO_CID = "artiko-logo";

/// El logotipo viaja DENTRO del correo, no enlazado a una direccion web.
///
/// Enlazarlo obliga a que el servidor sea accesible desde internet, asi que
/// en desarrollo aparece roto y en produccion depende de que la app siga en
/// pie. Incrustado se ve siempre, incluso al reenviar el correo o leerlo sin
/// conexion. Son 9 KB.
export const LOGO_ATTACHMENT = {
  filename: "artiko.png",
  content: ARTIKO_LOGO_BASE64,
  encoding: "base64" as const,
  cid: LOGO_CID,
};

/// Cabecera de marca: el logotipo enlazado a la web.
///
/// Aun asi, muchos clientes de correo no muestran ninguna imagen hasta que la
/// persona lo autoriza. Por eso debajo va el nombre en texto: si la imagen no
/// aparece, la cabecera sigue teniendo sentido y el enlace sigue funcionando.
function brandHeader(): string {
  return `<a href="${websiteUrl()}" style="text-decoration:none;display:inline-block;">
    <img src="cid:${LOGO_CID}"
         alt=""
         width="150"
         style="display:block;width:150px;height:auto;border:0;">
    <span style="display:block;margin-top:6px;font:400 11px Arial,sans-serif;
                 letter-spacing:.22em;color:#9a9a9a;">ARTIKO REAL ESTATE</span>
  </a>`;
}

function shell(content: string, footer: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="background:${CREAM};padding:28px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="max-width:560px;background:#ffffff;border:1px solid ${LINE};
                  border-radius:12px;overflow:hidden;">
      <tr><td style="padding:26px 32px 0;">
        ${brandHeader()}
      </td></tr>
      <tr><td style="padding:22px 32px 28px;font:400 15px/1.6 Arial,sans-serif;color:${BODY};">
        ${content}
      </td></tr>
      <tr><td style="padding:18px 32px;background:${CREAM};border-top:1px solid ${LINE};
                     font:400 12px/1.6 Arial,sans-serif;color:#8a8a8a;">
        ${footer}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/// Bloque de contacto personal para los correos al interesado.
///
/// El trato directo va por WhatsApp a proposito: info@artikore.com es la
/// bandeja de trabajo diaria de Artiko, no un buzon de atencion al publico.
function personalContactBlock(texts: {
  personalTouch: string;
  whatsappCta: string;
  visitWebsite: string;
}): string {
  const wa = whatsappUrl();

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
     style="margin:26px 0 0;border-top:1px solid ${LINE};">
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 10px;font:400 14px Arial,sans-serif;color:${BODY};">
        ${escapeHtml(texts.personalTouch)}
      </p>
      ${
        wa
          ? `<a href="${wa}"
               style="display:inline-block;background:#25D366;color:#ffffff;
                      text-decoration:none;padding:11px 20px;border-radius:6px;
                      font:700 14px Arial,sans-serif;margin-right:8px;">
               ${escapeHtml(texts.whatsappCta)}</a>`
          : ""
      }
      <a href="${websiteUrl()}"
         style="display:inline-block;border:1px solid ${LINE};color:${BODY};
                text-decoration:none;padding:10px 20px;border-radius:6px;
                font:700 14px Arial,sans-serif;">
         ${escapeHtml(texts.visitWebsite)}</a>
    </td></tr>
  </table>`;
}

function propertyBox(
  reference: string,
  title: string,
  zone: string | null,
  price: string,
  /// Enlace al anuncio publicado. Ahorra tener que buscar el inmueble para
  /// recordar de cual se esta hablando.
  listingUrl?: string | null,
): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
     style="margin:18px 0;background:${CREAM};border-radius:8px;">
    <tr><td style="padding:16px 18px;">
      <p style="margin:0;font:400 11px Arial,sans-serif;color:#9a9a9a;">
        ${escapeHtml(reference)}
      </p>
      <p style="margin:4px 0 0;font:400 17px Georgia,serif;color:${INK};">
        ${escapeHtml(title)}
      </p>
      ${
        zone
          ? `<p style="margin:3px 0 0;font:400 13px Arial,sans-serif;color:#8a8a8a;">${escapeHtml(zone)}</p>`
          : ""
      }
      ${
        price
          ? `<p style="margin:8px 0 0;font:400 16px Georgia,serif;color:${GOLD};">${escapeHtml(price)}</p>`
          : ""
      }
      ${
        listingUrl
          ? `<p style="margin:10px 0 0;font:400 13px Arial,sans-serif;"><a href="${escapeHtml(
              listingUrl,
            )}" style="color:#A8914F;">Ver el anuncio</a></p>`
          : ""
      }
    </td></tr>
  </table>`;
}

/// Correo al interesado, en el idioma en que relleno el formulario.
export function buildApplicantEmail(input: {
  dictionary: Dictionary;
  firstName: string;
  operation: "RENT" | "SALE";
  property: {
    reference: string;
    title: string;
    zone: string | null;
    listingUrl?: string | null;
  };
  price: string;
  hadDocuments: boolean;
  /// Enlace personal para volver a esta misma solicitud y anadir lo que
  /// falte, sin rellenar el formulario otra vez.
  selfServiceUrl: string | null;
}): { subject: string; html: string; text: string } {
  const t = input.dictionary.email;
  const operationWord =
    input.operation === "RENT" ? t.operationRent : t.operationSale;

  const content = `
    <p style="margin:0 0 14px;">
      ${escapeHtml(interpolate(t.greeting, { name: input.firstName }))}
    </p>
    <p style="margin:0;">
      ${escapeHtml(interpolate(t.received, { operation: operationWord }))}
    </p>
    ${propertyBox(
      input.property.reference,
      input.property.title,
      input.property.zone,
      input.price,
    )}
    <p style="margin:0 0 14px;">${escapeHtml(t.nextSteps)}</p>
    ${
      input.hadDocuments
        ? ""
        : `<p style="margin:0 0 14px;">${escapeHtml(t.documentsPending)}</p>`
    }
    ${
      input.selfServiceUrl
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="margin:20px 0 0;background:${CREAM};border-radius:8px;">
             <tr><td style="padding:16px 18px;">
               <p style="margin:0 0 10px;font:400 14px/1.6 Arial,sans-serif;color:${BODY};">
                 ${escapeHtml(t.selfServiceIntro)}
               </p>
               <a href="${escapeHtml(input.selfServiceUrl)}"
                  style="display:inline-block;background:${INK};color:#ffffff;
                         text-decoration:none;padding:11px 20px;border-radius:6px;
                         font:700 14px Arial,sans-serif;">${escapeHtml(t.selfServiceCta)}</a>
             </td></tr>
           </table>`
        : ""
    }
    <p style="margin:22px 0 0;font:400 17px Georgia,serif;color:${INK};">
      ${escapeHtml(t.signature)}
    </p>
    ${personalContactBlock(t)}`;

  const wa = whatsappUrl();

  const text = [
    interpolate(t.greeting, { name: input.firstName }),
    "",
    interpolate(t.received, { operation: operationWord }),
    `${input.property.reference} — ${input.property.title}`,
    "",
    t.nextSteps,
    "",
    input.selfServiceUrl ? t.selfServiceIntro : "",
    input.selfServiceUrl ?? "",
    "",
    t.personalTouch,
    wa ? `${t.whatsappCta}: ${wa}` : "",
    `${t.visitWebsite}: ${websiteUrl()}`,
    "",
    t.signature,
    t.signatureTagline,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: t.subject,
    html: shell(
      content,
      `${escapeHtml(t.noReply)}<br>${escapeHtml(t.signatureTagline)}`,
    ),
    text,
  };
}

/// Correo que pide documentacion a un candidato ya preseleccionado.
///
/// Va en espanol de momento. Los nombres de estos documentos son terminos
/// administrativos espanoles ("informe de vida laboral", "modelo 130") que el
/// candidato va a tener que pedir con ese nombre exacto, asi que traducirlos
/// tampoco ayudaria del todo. El texto que los envuelve si conviene
/// traducirlo mas adelante.
export function buildDocumentRequestEmail(input: {
  dictionary: Dictionary;
  firstName: string;
  property: { reference: string; title: string };
  items: Array<{ label: string; spanishName?: string }>;
  message: string | null;
  link: string;
  expiresAt: Date;
  locale: string;
}): { subject: string; html: string; text: string } {
  const t = input.dictionary.docs;
  const expiryDate = input.expiresAt.toLocaleDateString(input.locale);

  const itemName = (item: { label: string; spanishName?: string }) =>
    item.spanishName
      ? `${item.label} (${t.spanishNameLabel} ${item.spanishName})`
      : item.label;

  const itemRows = input.items
    .map(
      (item) =>
        `<tr><td style="padding:7px 0;border-bottom:1px solid ${LINE};color:${INK};">
           ${escapeHtml(itemName(item))}
         </td></tr>`,
    )
    .join("");

  const content = `
    <p style="margin:0 0 14px;">
      ${escapeHtml(interpolate(t.greeting, { name: input.firstName }))}
    </p>
    <p style="margin:0 0 14px;">${escapeHtml(t.emailIntro)}</p>
    ${propertyBox(input.property.reference, input.property.title, null, "")}
    ${
      input.message
        ? `<p style="margin:0 0 16px;padding:12px 14px;background:${CREAM};
             border-radius:8px;">${escapeHtml(input.message)}</p>`
        : ""
    }
    <p style="margin:0 0 8px;"><b>${escapeHtml(t.weNeed)}</b></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="font:400 14px/1.5 Arial,sans-serif;margin:0 0 16px;">
      ${itemRows}
    </table>

    <p style="margin:0 0 22px;padding:12px 14px;background:${CREAM};
              border-radius:8px;font-size:13px;line-height:1.6;">
      ${escapeHtml(t.abroadNote)}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td>
      <a href="${escapeHtml(input.link)}"
         style="display:inline-block;background:${GOLD};color:#ffffff;
                text-decoration:none;padding:13px 26px;border-radius:6px;
                font:700 15px Arial,sans-serif;">${escapeHtml(t.emailCta)}</a>
    </td></tr></table>

    <p style="margin:18px 0 0;font-size:13px;color:#8a8a8a;">
      ${escapeHtml(interpolate(t.emailExpiry, { date: expiryDate }))}
    </p>
    ${personalContactBlock(input.dictionary.email)}`;

  const text = [
    interpolate(t.greeting, { name: input.firstName }),
    "",
    t.emailIntro,
    "",
    `${t.weNeed}:`,
    ...input.items.map((item) => `  - ${itemName(item)}`),
    "",
    t.abroadNote,
    "",
    input.message ?? "",
    input.link,
    interpolate(t.emailExpiry, { date: expiryDate }),
    "",
    "Artiko Real Estate",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: interpolate(t.emailSubject, { property: input.property.title }),
    html: shell(content, "Artiko Real Estate · artikore.com"),
    text,
  };
}

/// Aviso interno a Artiko. Siempre en espanol, con lo justo para decidir si
/// merece la pena abrir la ficha.
export function buildInternalEmail(input: {
  applicationId: string;
  operation: "RENT" | "SALE";
  locale: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  property: {
    reference: string;
    title: string;
    zone: string | null;
    listingUrl?: string | null;
  };
  price: string;
  answers: Record<string, string>;
  documentCount: number;
  adminUrl: string;
  driveUrl: string | null;
}): { subject: string; html: string; text: string } {
  const fullName = `${input.applicant.firstName} ${input.applicant.lastName}`;
  const subject = `Nueva solicitud de ${operationLabels[
    input.operation
  ].toLowerCase()}: ${fullName} — ${input.property.reference}`;

  // Solo las respuestas que de verdad ayudan a decidir; el resto esta en la
  // ficha. Un correo interno de treinta lineas no lo lee nadie.
  // A una estancia de temporada no se le preguntaron los ingresos: enseñar
  // esas filas vacias en el aviso interno solo despista.
  const seasonal = input.operation === "RENT" && isSeasonalStay(input.answers);

  const highlightKeys =
    input.operation === "RENT"
      ? [
          "householdSize",
          ...(seasonal ? ["stayPurpose"] : ["monthlyIncome", "provableIncome"]),
          "employmentType",
        ]
      : ["buyerProfile", "needsFinancing", "financingApproved", "needToSell"];

  const labels = questionLabelsFor(input.operation);

  const stay = input.operation === "RENT" ? describeStay(input.answers) : null;

  const stayRow = stay
    ? `<tr>
        <td style="padding:4px 14px 4px 0;color:#8a8a8a;vertical-align:top;">Estancia</td>
        <td style="padding:4px 0;color:${INK};font-weight:bold;">${escapeHtml(stay)}</td>
      </tr>`
    : "";

  const highlights = highlightKeys
    .map((key) => {
      const value = input.answers[key];
      if (!value) return "";
      return `<tr>
        <td style="padding:4px 14px 4px 0;color:#8a8a8a;vertical-align:top;">${escapeHtml(labels[key] ?? key)}</td>
        <td style="padding:4px 0;color:${INK};">${escapeHtml(readableAnswer(value))}</td>
      </tr>`;
    })
    .join("");

  const content = `
    <p style="margin:0 0 4px;font:400 11px Arial,sans-serif;letter-spacing:.18em;
              text-transform:uppercase;color:${GOLD};">
      Nueva solicitud de ${escapeHtml(operationLabels[input.operation])}
    </p>
    <p style="margin:0;font:400 22px Georgia,serif;color:${INK};">
      ${escapeHtml(fullName)}
    </p>
    <p style="margin:6px 0 0;">
      <a href="mailto:${escapeHtml(input.applicant.email)}" style="color:#A8914F;">
        ${escapeHtml(input.applicant.email)}</a>
      &nbsp;·&nbsp;
      <a href="tel:${escapeHtml(input.applicant.phone.replace(/\s/g, ""))}" style="color:#A8914F;">
        ${escapeHtml(input.applicant.phone)}</a>
    </p>
    <p style="margin:4px 0 0;font:400 12px Arial,sans-serif;color:#8a8a8a;">
      Formulario en ${escapeHtml(localeLabels[input.locale] ?? input.locale)}
      · ${input.documentCount} documento${input.documentCount === 1 ? "" : "s"} adjunto${input.documentCount === 1 ? "" : "s"}
    </p>

    ${propertyBox(
      input.property.reference,
      input.property.title,
      input.property.zone,
      input.price,
      input.property.listingUrl,
    )}

    ${
      stayRow || highlights
        ? `<table role="presentation" cellpadding="0" cellspacing="0"
             style="font:400 14px/1.5 Arial,sans-serif;margin:0 0 22px;">${stayRow}${highlights}</table>`
        : ""
    }

    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;">
        <a href="${escapeHtml(input.adminUrl)}"
           style="display:inline-block;background:${INK};color:#ffffff;
                  text-decoration:none;padding:11px 20px;border-radius:6px;
                  font:700 14px Arial,sans-serif;">Ver la solicitud</a>
      </td>
      ${
        input.driveUrl
          ? `<td><a href="${escapeHtml(input.driveUrl)}"
               style="display:inline-block;border:1px solid ${LINE};color:${BODY};
                      text-decoration:none;padding:10px 20px;border-radius:6px;
                      font:700 14px Arial,sans-serif;">Carpeta en Drive</a></td>`
          : ""
      }
    </tr></table>`;

  const text = [
    `Nueva solicitud de ${operationLabels[input.operation].toLowerCase()}`,
    fullName,
    `${input.applicant.email} · ${input.applicant.phone}`,
    `${input.property.reference} — ${input.property.title}`,
    input.property.listingUrl ? `Anuncio: ${input.property.listingUrl}` : "",
    stay ? `Estancia: ${stay}` : "",
    "",
    `Ver la solicitud: ${input.adminUrl}`,
    input.driveUrl ? `Carpeta en Drive: ${input.driveUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html: shell(content, "Aviso automatico de Artiko Interesados."),
    text,
  };
}
