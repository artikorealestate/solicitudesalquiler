import { describeStay } from "./stay";
import {
  localeLabels,
  operationLabels,
  rentQuestionLabels,
  readableAnswer,
  saleQuestionLabels,
  statusLabels,
  type ApplicationStatus,
} from "@/lib/applications/labels";

/// Genera el CSV de solicitudes que se abre en Excel.
///
/// Dos decisiones que parecen manias pero no lo son:
///
///   - Separador punto y coma. El Excel en espanol interpreta la coma como
///     separador decimal, asi que un CSV con comas se abre todo en una
///     columna.
///   - Marca BOM al principio. Sin ella Excel lee el archivo como ANSI y
///     "García" aparece como "GarcÃ­a".

export type ExportableApplication = {
  submittedAt: Date;
  status: string;
  operation: string;
  locale: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string | null;
  idDocument: string | null;
  comment: string | null;
  answers: Record<string, string>;
  driveFolderUrl: string | null;
  documentCount: number;
  property: { reference: string; title: string; zone: string | null };
};

const BASE_COLUMNS = [
  "Fecha",
  "Estado",
  "Operacion",
  "Referencia inmueble",
  "Inmueble",
  "Zona",
  "Nombre",
  "Apellidos",
  "Email",
  "Telefono",
  "Nacionalidad",
  "Documento identidad",
  "Idioma",
  "Documentos adjuntos",
  "Carpeta Drive",
  "Estancia",
];

/// Las preguntas de alquiler y de compra van en columnas distintas. Mezclarlas
/// dejaria una columna "ocupacion" con significados diferentes segun la fila.
const RENT_KEYS = Object.keys(rentQuestionLabels);
const SALE_KEYS = Object.keys(saleQuestionLabels);

const ALL_COLUMNS = [
  ...BASE_COLUMNS,
  ...RENT_KEYS.map((key) => `Alquiler: ${rentQuestionLabels[key]}`),
  ...SALE_KEYS.map((key) => `Compra: ${saleQuestionLabels[key]}`),
  "Comentario adicional",
];

/// Escapa un valor para CSV.
///
/// El apostrofo inicial en valores que empiezan por = + - @ evita que Excel
/// los interprete como formulas: un telefono como "+34600..." podria acabar
/// ejecutandose en lugar de mostrarse.
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";

  let text = String(value);

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  if (/[";\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function formatDate(date: Date): string {
  // Formato que Excel en espanol reconoce como fecha y hora.
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function buildApplicationsCsv(
  applications: ExportableApplication[],
): string {
  const rows: string[] = [ALL_COLUMNS.map(csvCell).join(";")];

  for (const application of applications) {
    const isRent = application.operation === "RENT";

    const cells: Array<string | number | null> = [
      formatDate(application.submittedAt),
      statusLabels[application.status as ApplicationStatus] ??
        application.status,
      operationLabels[application.operation] ?? application.operation,
      application.property.reference,
      application.property.title,
      application.property.zone,
      application.firstName,
      application.lastName,
      application.email,
      application.phone,
      application.nationality,
      application.idDocument,
      localeLabels[application.locale] ?? application.locale,
      application.documentCount,
      application.driveFolderUrl,
      isRent ? (describeStay(application.answers) ?? "") : "",
    ];

    for (const key of RENT_KEYS) {
      const value = isRent ? application.answers[key] : undefined;
      cells.push(value ? readableAnswer(value) : "");
    }

    for (const key of SALE_KEYS) {
      const value = !isRent ? application.answers[key] : undefined;
      cells.push(value ? readableAnswer(value) : "");
    }

    cells.push(application.comment);

    rows.push(cells.map(csvCell).join(";"));
  }

  // \r\n porque es lo que espera Excel en Windows.
  return `﻿${rows.join("\r\n")}\r\n`;
}

export function exportFileName(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `solicitudes-artiko-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate(),
  )}.csv`;
}
