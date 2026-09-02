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
    expect(result.recommendedIncome).toBe(5330);
  });

  it("marca como holgado lo que cumple el 30%", () => {
    expect(assessSolvency(1500, "5000")!.band).toBe("holgado");
    expect(assessSolvency(1000, "5000")!.band).toBe("holgado");
  });

  it("marca como ajustado el tramo entre el 30% y el 45%", () => {
    // Aqui es donde un aval o unos ahorros pueden cambiar la decision, asi
    // que no puede salir como un rechazo.
    expect(assessSolvency(1600, "5000")!.band).toBe("ajustado");
    expect(assessSolvency(2250, "5000")!.band).toBe("ajustado");
  });

  it("marca como insuficiente lo que pasa del 45%", () => {
    expect(assessSolvency(2300, "5000")!.band).toBe("insuficiente");
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
describe("criterio de solvencia del 30%", () => {
  describe("recommendedIncomeFor", () => {
    it("calcula los ingresos recomendados para un alquiler", () => {
      // 1.600 / 0,30 = 5.333,33 -> redondeado a decenas
      expect(recommendedIncomeFor(1600)).toBe(5330);
    });

    it("funciona con alquileres bajos", () => {
      expect(recommendedIncomeFor(900)).toBe(3000);
    });

    it("funciona con alquileres altos", () => {
      expect(recommendedIncomeFor(4500)).toBe(15000);
    });
  });

  describe("meetsSolvency", () => {
    it("acepta cuando el alquiler es justo el 30% de los ingresos", () => {
      expect(meetsSolvency(1500, 5000)).toBe(true);
    });

    it("acepta cuando sobra margen", () => {
      expect(meetsSolvency(1600, 6000)).toBe(true);
    });

    it("rechaza cuando el alquiler pasa del 30%", () => {
      expect(meetsSolvency(1600, 4000)).toBe(false);
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
