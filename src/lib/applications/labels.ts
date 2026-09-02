/// Etiquetas en espanol para el panel interno.
///
/// El panel va solo en espanol aunque el interesado rellenase el formulario
/// en ruso: quien lo lee es Artiko.

export const applicationStatuses = [
  "NEW",
  "REVIEWING",
  "PENDING_DOCS",
  "VALID",
  "DISCARDED",
  "VISIT_PROPOSED",
  "VISITED",
  "OFFER",
  "RESERVED",
  "CLOSED",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const statusLabels: Record<ApplicationStatus, string> = {
  NEW: "Nuevo",
  REVIEWING: "Revisando",
  PENDING_DOCS: "Pendiente de documentacion",
  VALID: "Valido",
  DISCARDED: "Descartado",
  VISIT_PROPOSED: "Visita propuesta",
  VISITED: "Visitado",
  OFFER: "Oferta",
  RESERVED: "Reservado",
  CLOSED: "Cerrado",
};

/// Color de cada estado. Agrupados por significado para que el listado se
/// pueda escanear de un vistazo: verdes lo que avanza, rojo lo descartado,
/// dorado lo que espera accion de Artiko.
export const statusStyles: Record<ApplicationStatus, string> = {
  NEW: "bg-gold-wash text-gold-dark",
  REVIEWING: "bg-gold-wash text-gold-dark",
  PENDING_DOCS: "bg-gold-wash text-gold-dark",
  VALID: "bg-success/12 text-success",
  DISCARDED: "bg-danger/10 text-danger",
  VISIT_PROPOSED: "bg-success/12 text-success",
  VISITED: "bg-success/12 text-success",
  OFFER: "bg-success/12 text-success",
  RESERVED: "bg-success/12 text-success",
  CLOSED: "bg-cream-deep text-ink-muted",
};

export const operationLabels: Record<string, string> = {
  RENT: "Alquiler",
  SALE: "Compra",
};

export const localeLabels: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  de: "Alemán",
  fr: "Francés",
  ru: "Ruso",
  uk: "Ucraniano",
  nl: "Neerlandés",
  pt: "Portugués",
  it: "Italiano",
};

/// Etiquetas de las preguntas del formulario, para la ficha del interesado.
export const rentQuestionLabels: Record<string, string> = {
  householdSize: "Personas que viviran en la vivienda",
  relationship: "Relacion entre ellas",
  moveInDate: "Fecha deseada de entrada",
  stayLength: "Duracion que necesita",
  moveOutDate: "Fecha de salida",
  stayPurpose: "Motivo de la estancia",
  occupation: "Ocupacion actual",
  employmentType: "Situacion laboral",
  provableIncome: "Ingresos demostrables",
  monthlyIncome: "Ingreso neto mensual del grupo",
  pets: "Mascotas",
  petsDetail: "Que mascotas",
  searchDuration: "Tiempo buscando vivienda",
  visitedOthers: "Ha visitado otras viviendas",
  documentsReady: "Documentacion disponible",
};

export const saleQuestionLabels: Record<string, string> = {
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

/// Valores codificados que guarda el formulario, traducidos para el panel.
const valueLabels: Record<string, string> = {
  yes: "Si",
  no: "No",
  couple: "Pareja",
  family: "Familia",
  flatmates: "Companeros de piso",
  alone: "Viviria solo o sola",
  other: "Otra",
  permanent: "Contrato indefinido",
  temporary: "Contrato temporal",
  selfEmployed: "Autonomo",
  civilServant: "Funcionario",
  retired: "Jubilado o pensionista",
  student: "Estudiante",
  unemployed: "Sin empleo actualmente",
  justStarted: "Acaba de empezar",
  lessThanMonth: "Menos de un mes",
  oneToThree: "Entre uno y tres meses",
  moreThanThree: "Mas de tres meses",
  lessThanThree: "Menos de tres meses",
  threeToTwelve: "Entre tres meses y un ano",
  moreThanYear: "Mas de un ano",
  withEndDate: "Ya tiene fecha de salida",
  work: "Trabajo o traslado laboral",
  studies: "Estudios",
  holiday: "Vacaciones",
  betweenHomes: "Mientras encuentra vivienda o acaban unas obras",
  season: "Una temporada, menos de un ano",
  oneYear: "Un ano",
  twoOrThree: "Dos o tres anos",
  longTerm: "Largo plazo, sin fecha prevista",
  partly: "En parte",
  first: "Si, es su primera compra",
  experienced: "No, ya conoce el proceso",
};

const ISO_DATE = /^(d{4})-(d{2})-(d{2})$/;

export function readableAnswer(value: string): string {
  const date = ISO_DATE.exec(value);
  if (date) {
    const [, ano, mes, dia] = date;
    return `${Number(dia)}/${Number(mes)}/${ano}`;
  }
  return valueLabels[value] ?? value;
}

export function questionLabelsFor(operation: string): Record<string, string> {
  return operation === "SALE" ? saleQuestionLabels : rentQuestionLabels;
}
