import { describe, expect, it } from "vitest";
import { describeStay, stayLengthText } from "../../src/lib/applications/stay";

describe("stayLengthText", () => {
  it("cuenta en dias las estancias cortas", () => {
    expect(stayLengthText(new Date("2026-07-01"), new Date("2026-07-15"))).toBe(
      "14 dias",
    );
  });

  it("usa el singular con un solo dia", () => {
    expect(stayLengthText(new Date("2026-07-01"), new Date("2026-07-02"))).toBe(
      "1 dia",
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
      "1 ano",
    );
  });

  it("combina anos y meses", () => {
    expect(stayLengthText(new Date("2026-01-01"), new Date("2027-07-01"))).toBe(
      "1 ano y 6 meses",
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
    ).toBe("Del 1 jul 2026 al 1 sept 2026 · 2 meses");
  });

  it("muestra entrada y duracion cuando no hay fecha de salida", () => {
    expect(
      describeStay({ moveInDate: "2026-09-01", stayLength: "oneYear" }),
    ).toBe("Desde el 1 sept 2026 · Un ano");
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
