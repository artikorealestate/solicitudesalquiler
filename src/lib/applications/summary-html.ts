import { es } from "@/i18n/dictionaries/es";
import { describeStay } from "./stay";
import { localeLabels } from "./labels";

/// Genera el resumen de la solicitud que se guarda en la carpeta de Drive.
///
/// Se envia como HTML y Drive lo convierte en documento de Google, para que
/// Artiko pueda leerlo, comentarlo y compartirlo sin descargar nada.
///
/// Las preguntas se escriben SIEMPRE en espanol aunque el interesado
/// rellenase el formulario en otro idioma: quien lo lee es Artiko. Las
/// respuestas van tal cual las escribio la persona.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px 6px 0;vertical-align:top"><b>${escapeHtml(
    label,
  )}</b></td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`;
}

/// Etiquetas de las preguntas, en espanol, para el documento interno.
const RENT_LABELS: Record<string, string> = {
  householdSize: "Personas que viviran en la vivienda",
  relationship: "Relacion entre ellas",
  moveInDate: "Fecha deseada de entrada",
  stayLength: "Duracion que necesita",
  moveOutDate: "Fecha de salida",
  stayPurpose: "Motivo de la estancia",
  occupation: "Ocupacion actual",
  employmentType: "Situacion laboral",
  provableIncome: "Ingresos demostrables",
  monthlyIncome: "Ingreso neto mensual del grupo (EUR)",
  pets: "Mascotas",
  petsDetail: "Que mascotas",
  searchDuration: "Tiempo buscando vivienda",
  visitedOthers: "Ha visitado otras viviendas",
  documentsReady: "Documentacion disponible",
};

const SALE_LABELS: Record<string, string> = {
  buyerProfile: "Quien compra y perfil",
  searchDuration: "Tiempo buscando vivienda",
  propertiesVisited: "Viviendas visitadas",
  madeOffer: "Ha hecho alguna oferta",
  needToSell: "Necesita vender otro inmueble",
  needsFinancing: "Necesita financiacion",
  financingApproved: "Financiacion preaprobada",
  firstPurchase: "Primera compra",
  occupation: "Ocupacion actual",
};

/// Traduce los valores codificados a texto legible en espanol.
///
/// Va siempre en castellano aunque el interesado rellenara en otro idioma:
/// este documento lo lee Artiko, no el. Un resumen interno con
/// "Unbefristeter Vertrag" no le sirve a nadie de la oficina.
function readableValue(key: string, value: string): string {
  if (value === "yes") return "Si";
  if (value === "no") return "No";

  // El formulario guarda las fechas como 2026-07-01.
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (date) return `${Number(date[3])}/${Number(date[2])}/${date[1]}`;

  const catalogs: Record<string, Record<string, string>> = {
    relationship: es.rentQuestions.relationshipOptions,
    employmentType: es.rentQuestions.employmentOptions,
    documentsReady: es.rentQuestions.documentsReadyOptions,
    stayLength: es.rentQuestions.stayOptions,
    stayPurpose: es.rentQuestions.stayPurposeOptions,
    // El tiempo buscando se pregunta en alquiler y en compra con opciones
    // distintas; las claves no se solapan, asi que valen las dos juntas.
    searchDuration: {
      ...es.rentQuestions.searchDurationOptions,
      ...es.saleQuestions.searchDurationOptions,
    },
    firstPurchase: es.saleQuestions.firstPurchaseOptions,
  };

  const catalog = catalogs[key];
  if (catalog && value in catalog) {
    return (catalog as Record<string, string>)[value];
  }

  return value;
}

export function buildSummaryHtml(input: {
  operation: "RENT" | "SALE";
  locale: string;
  submittedAt: Date;
  property: {
    reference: string;
    title: string;
    zone: string | null;
    price: number | null;
    /// Enlace al anuncio. Sin el hay que buscar el inmueble a mano cada vez
    /// que se abre el resumen para saber de que vivienda se esta hablando.
    idealistaUrl: string | null;
  };
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality?: string | null;
    idDocument?: string | null;
    comment?: string | null;
  };
  answers: Record<string, string>;
  consents: Array<{ label: string; version: string; text: string }>;
}): string {
  const labels = input.operation === "RENT" ? RENT_LABELS : SALE_LABELS;

  const answerRows = Object.entries(labels)
    .map(([key, label]) => {
      const raw = input.answers[key];
      if (!raw) return "";
      return row(label, readableValue(key, raw));
    })
    .join("");

  const consentBlocks = input.consents
    .map(
      (consent) =>
        `<p style="margin:10px 0"><b>${escapeHtml(consent.label)}</b>
         (version ${escapeHtml(consent.version)})<br>
         <span style="color:#555">${escapeHtml(consent.text)}</span></p>`,
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"></head><body
     style="font-family:Arial,sans-serif;color:#222;line-height:1.5">
    <h1 style="font-size:20px;margin:0 0 4px">
      Solicitud de ${input.operation === "RENT" ? "alquiler" : "compra"}
    </h1>
    <p style="margin:0 0 20px;color:#666">
      ${escapeHtml(input.property.reference)} — ${escapeHtml(input.property.title)}
    </p>

    <h2 style="font-size:15px;margin:20px 0 6px">Inmueble</h2>
    <table>
      ${row("Referencia", input.property.reference)}
      ${row("Titulo", input.property.title)}
      ${row("Zona", input.property.zone)}
      ${row(
        input.operation === "RENT" ? "Precio" : "Precio de venta",
        input.property.price
          ? `${input.property.price.toLocaleString("es-ES")} EUR${
              input.operation === "RENT" ? " al mes" : ""
            }`
          : null,
      )}
      ${
        input.property.idealistaUrl
          ? `<tr><td style="padding:6px 12px 6px 0;vertical-align:top"><b>Anuncio</b></td><td style="padding:6px 0"><a href="${escapeHtml(
              input.property.idealistaUrl,
            )}">${escapeHtml(input.property.idealistaUrl)}</a></td></tr>`
          : ""
      }
    </table>

    <h2 style="font-size:15px;margin:20px 0 6px">Datos del interesado</h2>
    <table>
      ${row("Nombre", `${input.applicant.firstName} ${input.applicant.lastName}`)}
      ${row("Email", input.applicant.email)}
      ${row("Telefono", input.applicant.phone)}
      ${row("Nacionalidad", input.applicant.nationality)}
      ${row("Documento de identidad", input.applicant.idDocument)}
      ${row("Idioma del formulario", localeLabels[input.locale] ?? input.locale)}
      ${row("Fecha de envio", input.submittedAt.toLocaleString("es-ES"))}
    </table>

${
  input.operation === "RENT" && describeStay(input.answers)
    ? `<h2 style="font-size:15px;margin:24px 0 6px">Estancia</h2>
           <p style="margin:0;font-size:16px"><b>${escapeHtml(
             describeStay(input.answers) ?? "",
           )}</b></p>`
    : ""
}

    <h2 style="font-size:15px;margin:24px 0 6px">Respuestas</h2>
    <table>${answerRows}</table>

    ${
      input.applicant.comment
        ? `<h2 style="font-size:15px;margin:24px 0 6px">Comentario adicional</h2>
           <p style="margin:0">${escapeHtml(input.applicant.comment)}</p>`
        : ""
    }

    <h2 style="font-size:15px;margin:24px 0 6px">Consentimientos aceptados</h2>
    ${consentBlocks}

    <p style="margin-top:28px;color:#888;font-size:12px">
      Documento generado automaticamente por Artiko Interesados.
    </p>
  </body></html>`;
}
