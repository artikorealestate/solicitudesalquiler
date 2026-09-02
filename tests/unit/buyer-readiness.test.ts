import { describe, expect, it } from "vitest";
import { assessBuyerReadiness } from "../../src/lib/applications/buyer-readiness";

/// El objetivo del indicador es separar a quien puede comprar hoy de quien
/// esta mirando escaparates, sin descartar a nadie.
describe("perfil de comprador", () => {
  it("un comprador al contado sin nada que vender sale como listo", () => {
    const result = assessBuyerReadiness({
      needsFinancing: "no",
      needToSell: "no",
      searchDuration: "threeToTwelve",
      propertiesVisited: "8",
    });

    expect(result.band).toBe("listo");
    expect(result.signals.map((s) => s.text)).toContain(
      "No necesita financiacion",
    );
  });

  it("con hipoteca preaprobada tambien sale como listo", () => {
    const result = assessBuyerReadiness({
      needsFinancing: "yes",
      financingApproved: "yes",
      needToSell: "no",
      madeOffer: "yes",
    });

    expect(result.band).toBe("listo");
  });

  it("quien necesita hipoteca sin aprobar queda encaminado, no descartado", () => {
    const result = assessBuyerReadiness({
      needsFinancing: "yes",
      financingApproved: "no",
      needToSell: "no",
      searchDuration: "moreThanYear",
      propertiesVisited: "10",
    });

    // Va en serio: lleva un ano buscando y ha visto diez casas. Solo le falta
    // el banco.
    expect(result.band).toBe("encaminado");
  });

  it("quien acaba de empezar y no tiene nada resuelto sale como explorando", () => {
    const result = assessBuyerReadiness({
      needsFinancing: "yes",
      financingApproved: "no",
      needToSell: "yes",
      searchDuration: "justStarted",
      propertiesVisited: "1",
    });

    expect(result.band).toBe("explorando");
  });

  it("avisa de que necesita vender otro inmueble", () => {
    const result = assessBuyerReadiness({
      needsFinancing: "no",
      needToSell: "yes",
    });

    expect(result.signals.map((s) => s.text)).toContain(
      "Necesita vender otro inmueble antes de comprar",
    );
  });

  it("haber hecho una oferta cuenta como senal fuerte", () => {
    const result = assessBuyerReadiness({ madeOffer: "yes" });
    const signal = result.signals.find((s) => s.text.includes("oferta"));

    expect(signal?.weight).toBe("fuerte");
  });

  it("no se rompe con un formulario a medias", () => {
    const result = assessBuyerReadiness({});

    expect(result.band).toBe("explorando");
    expect(result.signals).toEqual([]);
  });

  it("ignora un numero de visitas mal escrito", () => {
    const result = assessBuyerReadiness({ propertiesVisited: "unas cuantas" });
    expect(result.band).toBe("explorando");
  });
});
