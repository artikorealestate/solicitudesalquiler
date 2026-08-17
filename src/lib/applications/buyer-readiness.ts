/// Valoracion del perfil de un comprador.
///
/// Para un comprador la documentacion no filtra nada: nadie manda sus nominas
/// antes de ver el piso, y tampoco hace falta. Lo que separa a un comprador
/// de un curioso son las respuestas que ya da en el formulario.
///
/// Esto las convierte en una senal legible de un vistazo, para decidir a
/// quien se le devuelve la llamada primero. No es un veredicto: alguien que
/// acaba de empezar a buscar puede comprar la semana que viene.

export type BuyerBand = "listo" | "encaminado" | "explorando";

export type BuyerSignal = {
  text: string;
  /// "fuerte" suma, "debil" resta, "neutro" solo informa.
  weight: "fuerte" | "debil" | "neutro";
};

export type BuyerReadiness = {
  band: BuyerBand;
  score: number;
  signals: BuyerSignal[];
};

export const buyerBandLabels: Record<BuyerBand, string> = {
  listo: "Listo para comprar",
  encaminado: "Encaminado",
  explorando: "Explorando"
};

export const buyerBandHints: Record<BuyerBand, string> = {
  listo: "Tiene la financiacion resuelta y nada que le frene. Llamar primero.",
  encaminado:
    "Va en serio pero le queda algun paso: la hipoteca sin aprobar o un inmueble que vender.",
  explorando:
    "Todavia esta mirando. Merece atencion, pero sin prioridad frente a los anteriores."
};

export function assessBuyerReadiness(
  answers: Record<string, string>
): BuyerReadiness {
  const signals: BuyerSignal[] = [];
  let score = 0;

  // --- Financiacion: la senal mas importante ---
  if (answers.needsFinancing === "no") {
    score += 3;
    signals.push({ text: "No necesita financiacion", weight: "fuerte" });
  } else if (answers.needsFinancing === "yes") {
    if (answers.financingApproved === "yes") {
      score += 3;
      signals.push({ text: "Financiacion ya preaprobada", weight: "fuerte" });
    } else {
      signals.push({
        text: "Necesita financiacion y aun no la tiene aprobada",
        weight: "debil"
      });
    }
  }

  // --- Tener que vender otra vivienda alarga los plazos ---
  if (answers.needToSell === "yes") {
    score -= 1;
    signals.push({
      text: "Necesita vender otro inmueble antes de comprar",
      weight: "debil"
    });
  } else if (answers.needToSell === "no") {
    score += 1;
  }

  // --- Haber hecho una oferta demuestra que va en serio ---
  if (answers.madeOffer === "yes") {
    score += 2;
    signals.push({ text: "Ya ha hecho alguna oferta", weight: "fuerte" });
  }

  // --- Recorrido de busqueda ---
  const visited = Number((answers.propertiesVisited ?? "").replace(/\D/g, ""));
  if (Number.isFinite(visited) && visited >= 5) {
    score += 1;
    signals.push({
      text: `Ha visitado unas ${visited} viviendas`,
      weight: "neutro"
    });
  } else if (Number.isFinite(visited) && visited > 0) {
    signals.push({
      text: `Ha visitado unas ${visited} viviendas`,
      weight: "neutro"
    });
  }

  if (answers.searchDuration === "justStarted") {
    score -= 1;
    signals.push({ text: "Acaba de empezar a buscar", weight: "debil" });
  } else if (
    answers.searchDuration === "threeToTwelve" ||
    answers.searchDuration === "moreThanYear"
  ) {
    score += 1;
    signals.push({ text: "Lleva tiempo buscando", weight: "neutro" });
  }

  // --- Experiencia previa ---
  if (answers.firstPurchase === "experienced") {
    signals.push({ text: "Ya conoce el proceso de compraventa", weight: "neutro" });
  }

  const band: BuyerBand =
    score >= 4 ? "listo" : score >= 1 ? "encaminado" : "explorando";

  return { band, score, signals };
}
