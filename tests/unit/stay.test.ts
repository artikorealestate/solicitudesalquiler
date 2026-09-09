import { describe, expect, it } from "vitest";
import {
  describeStay,
  isSeasonalStay,
  stayKind,
  stayLengthText,
} from "../../src/lib/applications/stay";

describe("stayLengthText", () => {
  it("cuenta en dias las estancias cortas", () => {
    expect(stayLengthText(new Date("2026-07-01"), new Date("2026-07-15"))).toBe(
      "14 días",
    );
  });

  it("usa el singular con un solo dia", () => {
    expect(stayLengthText(new Date("2026-07-01"), new Date("2026-07-02"))).toBe(
      "1 día",
    );
  });

  it("pasa a meses a partir del mes", () => {
    expect(stayLengthText(new Date("2026-07-01"), new Date("2026-09-01"))).toBe(
      "2 meses",
    );
  });

  it("cuenta el verano completo como tres meses", () => {
    expect(stayLengthText(new Date("2026-06-15"), new Date("2026-09-15"))).toBe(
      "3 meses",
    );
  });

  it("pasa a anos al llegar al ano", () => {
    expect(stayLengthText(new Date("2026-01-01"), new Date("2027-01-01"))).toBe(
      "1 año",
    );
  });

  it("combina anos y meses", () => {
    expect(stayLengthText(new Date("2026-01-01"), new Date("2027-07-01"))).toBe(
      "1 año y 6 meses",
    );
  });

  // Una fecha de salida anterior a la de entrada es un error de quien
  // rellena; mejor no enseñar "-30 dias" al propietario.
  it("no inventa duracion si las fechas van al reves", () => {
    expect(
      stayLengthText(new Date("2026-09-01"), new Date("2026-07-01")),
    ).toBeNull();
  });
});

describe("describeStay", () => {
  it("muestra el tramo completo cuando hay las dos fechas", () => {
    expect(
      describeStay({ moveInDate: "2026-07-01", moveOutDate: "2026-09-01" }),
    ).toBe("Temporada alta · del 1 jul 2026 al 1 sept 2026 (2 meses)");
  });

  it("muestra entrada y duracion cuando no hay fecha de salida", () => {
    expect(
      describeStay({ moveInDate: "2026-09-01", stayLength: "oneYear" }),
    ).toBe("Larga estancia · desde el 1 sept 2026 · un año");
  });

  it("se conforma con la fecha de entrada sola", () => {
    expect(describeStay({ moveInDate: "2026-09-01" })).toBe(
      "Desde el 1 sept 2026",
    );
  });

  // Las solicitudes anteriores a estas preguntas no tienen ninguno de los dos
  // datos, y las de compra tampoco.
  it("devuelve null cuando no hay nada que contar", () => {
    expect(describeStay({})).toBeNull();
    expect(describeStay({ buyerProfile: "Pareja joven" })).toBeNull();
  });

  it("ignora fechas que no se pueden leer", () => {
    expect(describeStay({ moveInDate: "cuando sea" })).toBeNull();
  });
});

describe("isSeasonalStay", () => {
  it("reconoce quien lo dice explicitamente", () => {
    expect(isSeasonalStay({ stayLength: "season" })).toBe(true);
  });

  it("reconoce un verano por las fechas", () => {
    expect(
      isSeasonalStay({ moveInDate: "2026-07-01", moveOutDate: "2026-09-01" }),
    ).toBe(true);
  });

  // Justo por debajo del corte de once meses.
  it("cuenta diez meses como temporada", () => {
    expect(
      isSeasonalStay({ moveInDate: "2026-01-01", moveOutDate: "2026-11-01" }),
    ).toBe(true);
  });

  it("un ano entero no es temporada", () => {
    expect(
      isSeasonalStay({ moveInDate: "2026-01-01", moveOutDate: "2027-01-01" }),
    ).toBe(false);
  });

  it("no lo es quien pide un ano o mas", () => {
    expect(isSeasonalStay({ stayLength: "oneYear" })).toBe(false);
    expect(isSeasonalStay({ stayLength: "twoOrThree" })).toBe(false);
    expect(isSeasonalStay({ stayLength: "longTerm" })).toBe(false);
  });

  // Las solicitudes anteriores a estas preguntas se siguen tratando como
  // vivienda habitual, que es como se recibieron.
  it("ante la falta de datos no lo da por temporada", () => {
    expect(isSeasonalStay({})).toBe(false);
    expect(isSeasonalStay({ moveInDate: "2026-07-01" })).toBe(false);
  });
});

describe("una fecha de salida que ya no aplica", () => {
  // Alguien pone "ya sabemos la fecha", escribe agosto, y luego cambia a
  // "un ano". La fecha vieja no puede seguir decidiendo por el.
  it("no convierte en temporada a quien pide un ano", () => {
    expect(
      isSeasonalStay({
        stayLength: "oneYear",
        moveInDate: "2026-07-01",
        moveOutDate: "2026-08-31",
      }),
    ).toBe(false);
  });

  it("tampoco a quien no pone fecha de fin", () => {
    expect(
      isSeasonalStay({
        stayLength: "longTerm",
        moveInDate: "2026-07-01",
        moveOutDate: "2026-08-31",
      }),
    ).toBe(false);
  });
});

describe("de que tipo de alquiler se trata", () => {
  it("dice Temporada delante de las fechas", () => {
    expect(
      describeStay({
        stayLength: "withEndDate",
        moveInDate: "2026-07-01",
        moveOutDate: "2026-08-31",
      }),
    ).toBe("Temporada alta · del 1 jul 2026 al 31 ago 2026 (2 meses)");
  });

  // "Temporada · una temporada" sobraba.
  it("no repite la palabra cuando la duracion ya lo dice", () => {
    expect(
      describeStay({ stayLength: "season", moveInDate: "2026-06-15" }),
    ).toBe("Media temporada · desde el 15 jun 2026");
  });

  it("dice Larga estancia en un contrato de un ano con fechas", () => {
    expect(
      describeStay({
        stayLength: "withEndDate",
        moveInDate: "2026-09-01",
        moveOutDate: "2027-09-01",
      }),
    ).toBe("Larga estancia · del 1 sept 2026 al 1 sept 2027 (1 año)");
  });

  it("dice Larga estancia sin fecha de salida", () => {
    expect(
      describeStay({ stayLength: "longTerm", moveInDate: "2026-09-01" }),
    ).toBe(
      "Larga estancia · desde el 1 sept 2026 · sin fecha de salida prevista",
    );
  });

  // Las solicitudes anteriores solo tienen fecha de entrada: llamarlas larga
  // estancia seria inventarselo.
  it("no clasifica lo que no puede saber", () => {
    expect(describeStay({ moveInDate: "2026-09-01" })).toBe(
      "Desde el 1 sept 2026",
    );
  });
});

describe("temporada alta frente a media temporada", () => {
  // El negocio de Gran Canet: julio y agosto a precio de temporada alta, de
  // septiembre a junio contratos sueltos por meses a bastante menos.
  it("julio y agosto es temporada alta", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-07-01",
        moveOutDate: "2026-08-31",
      }),
    ).toBe("ALTA");
  });

  it("de septiembre a mayo es media temporada", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-09-01",
        moveOutDate: "2027-05-31",
      }),
    ).toBe("MEDIA");
  });

  // El dia de salida no cuenta: se van el 1 de julio, no lo ocupan.
  it("un contrato que termina el 1 de julio sigue siendo media", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-09-01",
        moveOutDate: "2027-07-01",
      }),
    ).toBe("MEDIA");
  });

  it("pero si se queda hasta mediados de julio, es alta", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-09-01",
        moveOutDate: "2027-07-15",
      }),
    ).toBe("ALTA");
  });

  it("junio completo todavia no es alta", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-06-01",
        moveOutDate: "2026-07-01",
      }),
    ).toBe("MEDIA");
  });

  it("entrar el 31 de agosto si lo es", () => {
    expect(
      stayKind({
        stayLength: "withEndDate",
        moveInDate: "2026-08-31",
        moveOutDate: "2027-05-31",
      }),
    ).toBe("ALTA");
  });

  it("sin fecha de salida decide el mes de entrada", () => {
    expect(stayKind({ stayLength: "season", moveInDate: "2026-07-10" })).toBe(
      "ALTA",
    );
    expect(stayKind({ stayLength: "season", moveInDate: "2026-10-01" })).toBe(
      "MEDIA",
    );
  });

  it("un ano o mas es larga estancia", () => {
    expect(stayKind({ stayLength: "oneYear", moveInDate: "2026-09-01" })).toBe(
      "LARGA",
    );
  });

  it("no clasifica una solicitud antigua", () => {
    expect(stayKind({ moveInDate: "2026-09-01" })).toBeNull();
  });
});
