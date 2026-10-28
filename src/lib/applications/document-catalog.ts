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
  | "SEASONAL"
  | "SALARIED"
  | "SELF_EMPLOYED"
  | "BUSINESS_OWNER"
  | "PENSIONER"
  | "FOREIGN_INCOME"
  | "NO_INCOME"
  | "COMPANY"
  | "OTHER";

/// El orden es el del desplegable del panel.
export const profileLabels: Record<ApplicantProfile, string> = {
  SALARIED: "Asalariado",
  SELF_EMPLOYED: "Autónomo",
  BUSINESS_OWNER: "Empresario o socio",
  PENSIONER: "Pensionista",
  FOREIGN_INCOME: "Ingresos del extranjero",
  NO_INCOME: "Sin ingresos propios",
  SEASONAL: "Estancia de temporada",
  COMPANY: "Empresa (alquila una sociedad)",
  OTHER: "Otra situación",
};

/// Aviso que el panel muestra al elegir el perfil, cuando hace falta algo
/// mas que marcar casillas.
export const profileHints: Partial<Record<ApplicantProfile, string>> = {
  NO_INCOME:
    "A esta persona solo se le pide la identidad. Añade como otra persona a quien vaya a pagar o avalar, con su propio perfil.",
  FOREIGN_INCOME:
    "Comprueba que el dinero llega o está disponible en España: es lo que mira la aseguradora.",
  SEASONAL:
    "Estancia de temporada: se cobra por adelantado y no lleva estudio de solvencia.",
};

/// Papel de cada persona en el contrato.
export type PersonRole = "TENANT" | "GUARANTOR";

export const roleLabels: Record<PersonRole, string> = {
  TENANT: "Titular",
  GUARANTOR: "Avalista",
};

/// Claves del catalogo. El orden es el de presentacion.
export const documentKeys = [
  "id",
  "nie",
  "residencePermit",
  "employmentContract",
  "incomeProof",
  "workHistory",
  "taxReturn",
  "selfEmployedProof",
  "quarterlyTax",
  "ownerPayProof",
  "pensionProof",
  "fundsInSpain",
  "bankStatements3",
  "bankStatements6",
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
  taxReturn: "modelo 100 del IRPF",
  selfEmployedProof: "alta de autónomo",
  quarterlyTax: "modelos 130 y 303",
  companyAccounts: "cuentas anuales e Impuesto sobre Sociedades",
};

/// Lo que se marca por defecto en cada perfil, para CADA persona que firme
/// o avale.
///
/// Es lo que piden las aseguradoras de impago para estudiar un inquilino. Los
/// extractos bancarios entran porque sin ellos la poliza no se emite: son lo
/// que demuestra que los ingresos se cobran de verdad.
export const defaultItemsByProfile: Record<ApplicantProfile, DocumentKey[]> = {
  SALARIED: ["id", "employmentContract", "incomeProof", "bankStatements3"],
  SELF_EMPLOYED: [
    "id",
    "taxReturn",
    "quarterlyTax",
    "selfEmployedProof",
    "bankStatements6",
  ],
  BUSINESS_OWNER: [
    "id",
    "taxReturn",
    "companyAccounts",
    "ownerPayProof",
    "bankStatements6",
  ],
  PENSIONER: ["id", "pensionProof", "bankStatements3"],
  FOREIGN_INCOME: [
    "id",
    "employmentContract",
    "incomeProof",
    "bankStatements3",
    "fundsInSpain",
  ],
  // Quien no cobra solo se identifica: los papeles de ingresos son los de
  // quien pague o avale, que va como otra persona con su propio perfil.
  NO_INCOME: ["id"],
  // Una estancia corta se cobra por adelantado: con saber quien viene basta.
  SEASONAL: ["id"],
  COMPANY: ["companyDocs", "representativeId", "companyAccounts"],
  OTHER: ["id", "incomeProof", "bankStatements3"],
};

/// Todo lo que tiene sentido ofrecer para cada perfil.
///
/// El NIE y el permiso de residencia estan disponibles en todos los perfiles
/// de persona fisica: hacen falta para firmar un contrato en Espana y buena
/// parte de los interesados de Artiko vienen de fuera.
const forEveryone: DocumentKey[] = [
  "nie",
  "residencePermit",
  "workHistory",
  "other",
];

export const availableItemsByProfile: Record<ApplicantProfile, DocumentKey[]> =
  {
    SALARIED: [
      "id",
      "employmentContract",
      "incomeProof",
      "bankStatements3",
      "bankStatements6",
      "taxReturn",
      ...forEveryone,
    ],
    SELF_EMPLOYED: [
      "id",
      "taxReturn",
      "quarterlyTax",
      "selfEmployedProof",
      "bankStatements6",
      "bankStatements3",
      "incomeProof",
      ...forEveryone,
    ],
    BUSINESS_OWNER: [
      "id",
      "taxReturn",
      "companyAccounts",
      "ownerPayProof",
      "bankStatements6",
      "quarterlyTax",
      ...forEveryone,
    ],
    PENSIONER: [
      "id",
      "pensionProof",
      "bankStatements3",
      "taxReturn",
      ...forEveryone,
    ],
    FOREIGN_INCOME: [
      "id",
      "employmentContract",
      "incomeProof",
      "bankStatements3",
      "bankStatements6",
      "fundsInSpain",
      "taxReturn",
      ...forEveryone,
    ],
    NO_INCOME: ["id", "nie", "residencePermit", "other"],
    SEASONAL: ["id", "nie", "residencePermit", "incomeProof", "other"],
    COMPANY: [
      "companyDocs",
      "representativeId",
      "companyAccounts",
      "quarterlyTax",
      "bankStatements6",
      "other",
    ],
    OTHER: [
      "id",
      "employmentContract",
      "incomeProof",
      "bankStatements3",
      "bankStatements6",
      "taxReturn",
      ...forEveryone,
    ],
  };

/// Una persona de la peticion: cada titular y cada avalista aporta lo suyo.
export type RequestPerson = {
  name: string;
  role: PersonRole;
  profile: ApplicantProfile;
  items: DocumentKey[];
};

export const MAX_PEOPLE_PER_REQUEST = 6;

/// Lee las personas guardadas en una peticion.
///
/// Las peticiones anteriores a esto no tienen personas: se tratan como una
/// sola, sin nombre, con la lista de siempre.
export function requestPeople(request: {
  people: unknown;
  profile: string;
  requestedItems: string[];
}): Array<Omit<RequestPerson, "name"> & { name: string | null }> {
  if (Array.isArray(request.people) && request.people.length > 0) {
    return (request.people as RequestPerson[]).map((person) => ({
      name: person.name,
      role: person.role === "GUARANTOR" ? "GUARANTOR" : "TENANT",
      profile: person.profile,
      items: person.items.filter(isDocumentKey),
    }));
  }

  return [
    {
      name: null,
      role: "TENANT",
      profile: request.profile as ApplicantProfile,
      items: request.requestedItems.filter(isDocumentKey),
    },
  ];
}

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
    case "student":
    case "unemployed":
      return "NO_INCOME";
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

/// Lo que hay que pedirle a una persona, ya en su idioma.
export type ResolvedPersonGroup = {
  /// Null en las peticiones antiguas, que eran de una sola persona.
  name: string | null;
  guarantor: boolean;
  items: ResolvedDocumentItem[];
};

export function resolvePeopleGroups(
  people: Array<{ name: string | null; role: PersonRole; items: string[] }>,
  labels: Record<string, string>,
): ResolvedPersonGroup[] {
  return people.map((person) => ({
    name: person.name,
    guarantor: person.role === "GUARANTOR",
    items: resolveDocumentItems(person.items, labels),
  }));
}

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
