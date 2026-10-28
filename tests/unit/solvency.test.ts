import { describe, expect, it } from "vitest";
import {
  assessSolvency,
  meetsSolvency,
  parseDeclaredIncome,
  recommendedIncomeFor,
} from "../../src/lib/applications/types";

describe("lectura de los ingresos declarados", () => {
  it("acepta el numero a secas", () => {
    expect(parseDeclaredIncome("5200")).toBe(5200);
  });

  it("acepta el punto de millares", () => {
    expect(parseDeclaredIncome("5.200")).toBe(5200);
  });

  it("acepta el simbolo del euro y los espacios", () => {
    expect(parseDeclaredIncome("5 200 €")).toBe(5200);
  });

  it("devuelve null cuando no hay nada aprovechable", () => {
    expect(parseDeclaredIncome("")).toBe(null);
    expect(parseDeclaredIncome(undefined)).toBe(null);
    expect(parseDeclaredIncome("no lo se")).toBe(null);
    expect(parseDeclaredIncome("0")).toBe(null);
  });
});

describe("valoracion de solvencia para el panel", () => {
  it("calcula el ratio de una solicitud", () => {
    const result = assessSolvency(1600, "5200")!;

    expect(result.ratioPercent).toBe(31);
    expect(result.monthlyIncome).toBe(5200);
    expect(result.recommendedIncome).toBe(4000);
  });

  it("cumple hasta el 40% incluido", () => {
    expect(assessSolvency(2000, "5000")!.band).toBe("cumple");
    expect(assessSolvency(1000, "5000")!.band).toBe("cumple");
  });

  // Con el criterio anterior (30%) esto no cumplia.
  it("da por buena una solicitud al 35%", () => {
    expect(assessSolvency(1750, "5000")!.band).toBe("cumple");
  });

  // Una sola linea, sin tramo intermedio: por poco que pase del 40%, no
  // cumple. Es lo que pidio Artiko.
  it("no cumple en cuanto pasa del 40%", () => {
    expect(assessSolvency(2010, "5000")!.band).toBe("no_cumple");
    expect(assessSolvency(2500, "5000")!.band).toBe("no_cumple");
    expect(assessSolvency(4000, "5000")!.band).toBe("no_cumple");
  });

  it("no inventa nada si falta el precio o los ingresos", () => {
    expect(assessSolvency(null, "5000")).toBe(null);
    expect(assessSolvency(1600, undefined)).toBe(null);
    expect(assessSolvency(1600, "")).toBe(null);
    expect(assessSolvency(0, "5000")).toBe(null);
  });
});

/// El criterio de solvencia se le muestra al interesado como orientacion, asi
/// que conviene que los numeros sean exactos: un calculo mal hecho aqui
/// desanima a candidatos validos o anima a los que no llegan.
describe("criterio de solvencia del 40%", () => {
  describe("recommendedIncomeFor", () => {
    it("calcula los ingresos recomendados para un alquiler", () => {
      // 1.600 / 0,40 = 4.000
      expect(recommendedIncomeFor(1600)).toBe(4000);
    });

    it("funciona con alquileres bajos", () => {
      // 900 / 0,40 = 2.250
      expect(recommendedIncomeFor(900)).toBe(2250);
    });

    it("funciona con alquileres altos", () => {
      // 4.500 / 0,40 = 11.250
      expect(recommendedIncomeFor(4500)).toBe(11250);
    });
  });

  describe("meetsSolvency", () => {
    it("acepta cuando el alquiler es justo el 40% de los ingresos", () => {
      expect(meetsSolvency(2000, 5000)).toBe(true);
    });

    it("acepta cuando sobra margen", () => {
      expect(meetsSolvency(1600, 6000)).toBe(true);
    });

    it("rechaza cuando el alquiler pasa del 40%", () => {
      expect(meetsSolvency(1600, 3900)).toBe(false);
    });

    it("no da por bueno un ingreso de cero", () => {
      // Sin este caso, 0 ingresos daria division por cero -> Infinity.
      expect(meetsSolvency(1600, 0)).toBe(false);
    });

    it("no da por bueno un ingreso negativo", () => {
      expect(meetsSolvency(1600, -100)).toBe(false);
    });
  });
});
