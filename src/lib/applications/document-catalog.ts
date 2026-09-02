/// Catalogo de documentos que Artiko puede pedir a un candidato.
///
/// Dos decisiones de diseno importantes:
///
/// 1. Los documentos se nombran por SU FUNCION, no por su nombre espanol. Un
///    aleman no tiene "informe de vida laboral" ni presenta el "modelo 130";
///    tiene el equivalente de su pais. Pedirle el nombre espanol le deja sin
///    saber que buscar.
///
/// 2. Aun asi se conserva el nombre oficial espanol como referencia, porque
///    quien vive en Espana necesita pedirlo con ese nombre exacto en la
///    Seguridad Social o en Hacienda.
///
/// Los textos viven en los diccionarios de idiomas; aqui solo estan las
/// claves y la estructura.

import { isSeasonalStay } from "./stay";

export type ApplicantProfile =
  "SEASONAL" | "SALARIED" | "SELF_EMPLOYED" | "PENSIONER" | "COMPANY" | "OTHER";

export const profileLabels: Record<ApplicantProfile, string> = {
  SEASONAL: "Estancia de temporada",
  SALARIED: "Asalariado",
  SELF_EMPLOYED: "Autonomo",
  PENSIONER: "Jubilado o pensionista",
  COMPANY: "Empresa",
  OTHER: "Otra situacion",
};

/// Claves del catalogo. El orden es el de presentacion.
export const documentKeys = [
  "id",
  "nie",
  "residencePermit",
  "incomeProof",
  "employmentContract",
  "workHistory",
  "taxReturn",
  "selfEmployedProof",
  "quarterlyTax",
  "pensionProof",
  "companyDocs",
  "representativeId",
  "companyAccounts",
  "guarantorDocuments",
  "other",
] as const;

export type DocumentKey = (typeof documentKeys)[number];

/// Nombre oficial espanol, cuando existe uno concreto que merece la pena
/// citar. No se traduce: es el termino con el que hay que pedirlo aqui.
export const spanishOfficialName: Partial<Record<DocumentKey, string>> = {
  nie: "NIE",
  incomeProof: "nóminas",
  workHistory: "informe de vida laboral",
  taxReturn: "declaración de la renta (IRPF)",
  selfEmployedProof: "alta de autónomo",
  quarterlyTax: "modelos 130 y 303",
  companyAccounts: "Impuesto sobre Sociedades",
};

/// Lo que se marca por defecto en cada perfil.
///
/// Los extractos bancarios NO estan en el catalogo a proposito: son el
/// documento mas invasivo y con justificantes de ingresos, contrato e
/// historial laboral el analisis ya se sostiene.
export const defaultItemsByProfile: Record<ApplicantProfile, DocumentKey[]> = {
  // Una estancia corta se cobra por adelantado: con saber quien viene basta.
  SEASONAL: ["id"],
  SALARIED: ["id", "incomeProof", "employmentContract", "workHistory"],
  SELF_EMPLOYED: ["id", "selfEmployedProof", "taxReturn", "quarterlyTax"],
  PENSIONER: ["id", "pensionProof"],
  COMPANY: ["companyDocs", "representativeId", "companyAccounts"],
  OTHER: ["id", "incomeProof"],
};

/// Todo lo que tiene sentido ofrecer para cada perfil.
///
/// El NIE y el permiso de residencia estan disponibles en todos los perfiles
/// de persona fisica: hacen falta para firmar un contrato en Espana y buena
/// parte de los interesados de Artiko vienen de fuera.
const forEveryone: DocumentKey[] = [
  "nie",
  "residencePermit",
  "guarantorDocuments",
  "other",
];

export const availableItemsByProfile: Record<ApplicantProfile, DocumentKey[]> =
  {
    SEASONAL: ["id", "nie", "residencePermit", "incomeProof", "other"],
    SALARIED: [
      "id",
      "incomeProof",
      "employmentContract",
      "workHistory",
      "taxReturn",
      ...forEveryone,
    ],
    SELF_EMPLOYED: [
      "id",
      "selfEmployedProof",
      "taxReturn",
      "quarterlyTax",
      "incomeProof",
      ...forEveryone,
    ],
    PENSIONER: ["id", "pensionProof", "taxReturn", ...forEveryone],
    COMPANY: [
      "companyDocs",
      "representativeId",
      "companyAccounts",
      "quarterlyTax",
      "guarantorDocuments",
      "other",
    ],
    OTHER: [
      "id",
      "incomeProof",
      "employmentContract",
      "workHistory",
      "taxReturn",
      ...forEveryone,
    ],
  };

/// Adivina el perfil a partir de lo que el interesado contesto, para llegar
/// con la casilla ya marcada.
export function guessProfile(
  answers: Record<string, string>,
): ApplicantProfile {
  // La temporada manda sobre la situacion laboral: a quien viene dos meses no
  // se le piden nominas por tener contrato indefinido.
  if (isSeasonalStay(answers)) return "SEASONAL";

  switch (answers.employmentType) {
    case "selfEmployed":
      return "SELF_EMPLOYED";
    case "retired":
      return "PENSIONER";
    case "permanent":
    case "temporary":
    case "civilServant":
      return "SALARIED";
    default:
      return "OTHER";
  }
}

export function isDocumentKey(value: string): value is DocumentKey {
  return (documentKeys as readonly string[]).includes(value);
}

export type ResolvedDocumentItem = {
  key: DocumentKey;
  label: string;
  /// Nombre oficial espanol, cuando lo hay. Se muestra como referencia junto
  /// a la etiqueta traducida: "Historial laboral (en Espana: informe de vida
  /// laboral)". Quien vive aqui necesita pedirlo con ese nombre exacto.
  spanishName?: string;
};

/// Traduce las claves guardadas a textos del idioma del candidato.
export function resolveDocumentItems(
  keys: string[],
  labels: Record<string, string>,
): ResolvedDocumentItem[] {
  return keys.filter(isDocumentKey).map((key) => ({
    key,
    label: labels[key] ?? key,
    spanishName: spanishOfficialName[key],
  }));
}
