/// Inmueble tal y como se le muestra al interesado.
///
/// Deliberadamente NO incluye notas internas ni estado: es lo que viaja al
/// navegador y cualquiera puede leerlo.
export type PublicProperty = {
  id: string;
  reference: string;
  title: string;
  zone: string | null;
  operationType: "RENT" | "SALE" | "BOTH";
  rentPrice: number | null;
  salePrice: number | null;
  mainImageUrl: string | null;
  idealistaUrl: string | null;
};

export type Operation = "RENT" | "SALE";

/// Borrador del formulario mientras se rellena.
///
/// Los archivos no viven aqui: se guardan aparte porque el borrador se
/// persiste en el navegador y los archivos no se pueden serializar.
export type ApplicationDraft = {
  operation: Operation | "";
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idDocument: string;
  comment: string;
  answers: Record<string, string>;
  consentGdpr: boolean;
  consentOwner: boolean;
};

export const emptyDraft: ApplicationDraft = {
  operation: "",
  propertyId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  idDocument: "",
  comment: "",
  answers: {},
  consentGdpr: false,
  consentOwner: false,
};

/// Preguntas de alquiler, en el orden en que se muestran.
export const RENT_ANSWER_KEYS = [
  "householdSize",
  "relationship",
  "moveInDate",
  "stayLength",
  "moveOutDate",
  "occupation",
  "employmentType",
  "provableIncome",
  "monthlyIncome",
  "pets",
  "petsDetail",
  "searchDuration",
  "visitedOthers",
  "documentsReady",
] as const;

/// Preguntas de compra, en el orden en que se muestran.
export const SALE_ANSWER_KEYS = [
  "buyerProfile",
  "searchDuration",
  "propertiesVisited",
  "madeOffer",
  "needToSell",
  "needsFinancing",
  "financingApproved",
  "firstPurchase",
  "occupation",
] as const;

/// Umbral de solvencia que aplica Artiko: el alquiler no deberia superar el
/// 30% de los ingresos netos demostrables del grupo.
///
/// La referencia del sector se mueve entre el 30% y el 45%; Artiko usa el
/// extremo prudente a proposito. Cambiarlo aqui lo cambia en todas partes.
export const SOLVENCY_THRESHOLD = 0.3;

/// Ingresos que harian falta para cumplir el criterio con ese alquiler.
export function recommendedIncomeFor(rentPrice: number): number {
  return Math.round(rentPrice / SOLVENCY_THRESHOLD / 10) * 10;
}

export function meetsSolvency(
  rentPrice: number,
  monthlyIncome: number,
): boolean {
  return monthlyIncome > 0 && rentPrice / monthlyIncome <= SOLVENCY_THRESHOLD;
}

export type SolvencyAssessment = {
  /// Porcentaje que representa el alquiler sobre los ingresos, redondeado.
  ratioPercent: number;
  monthlyIncome: number;
  rentPrice: number;
  recommendedIncome: number;
  /// "holgado" hasta el 30%, "ajustado" hasta el 45%, "insuficiente" por
  /// encima. El tramo intermedio existe porque ahi es donde un aval o unos
  /// ahorros pueden inclinar la decision: no es un no, es un "miralo".
  band: "holgado" | "ajustado" | "insuficiente";
};

/// Lee los ingresos tal y como los escribio el interesado.
/// Acepta "5.200", "5200 €", "5 200" y similares.
export function parseDeclaredIncome(raw: string | undefined): number | null {
  if (!raw) return null;

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;

  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/// Calcula el ratio de una solicitud concreta. Devuelve null cuando falta
/// algun dato: es preferible no mostrar nada a mostrar un numero inventado.
export function assessSolvency(
  rentPrice: number | null,
  declaredIncome: string | undefined,
): SolvencyAssessment | null {
  const monthlyIncome = parseDeclaredIncome(declaredIncome);
  if (!rentPrice || rentPrice <= 0 || !monthlyIncome) return null;

  const ratio = rentPrice / monthlyIncome;

  return {
    ratioPercent: Math.round(ratio * 100),
    monthlyIncome,
    rentPrice,
    recommendedIncome: recommendedIncomeFor(rentPrice),
    band:
      ratio <= SOLVENCY_THRESHOLD
        ? "holgado"
        : ratio <= 0.45
          ? "ajustado"
          : "insuficiente",
  };
}
