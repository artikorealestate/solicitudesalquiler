import { describe, expect, it } from "vitest";
import {
  defaultItemsByProfile,
  guessProfile,
} from "../../src/lib/applications/document-catalog";

describe("guessProfile con estancias de temporada", () => {
  // El caso que motiva todo esto: alguien con contrato indefinido que viene
  // dos meses de verano. Antes se le pedia nomina, contrato y vida laboral.
  it("la temporada manda sobre la situacion laboral", () => {
    expect(
      guessProfile({
        employmentType: "permanent",
        moveInDate: "2026-07-01",
        moveOutDate: "2026-09-01",
      }),
    ).toBe("SEASONAL");
  });

  it("sigue distinguiendo perfiles en el alquiler de vivienda", () => {
    expect(guessProfile({ employmentType: "permanent" })).toBe("SALARIED");
    expect(guessProfile({ employmentType: "selfEmployed" })).toBe(
      "SELF_EMPLOYED",
    );
    expect(guessProfile({ employmentType: "retired" })).toBe("PENSIONER");
  });

  it("a la temporada solo se le pide identificarse", () => {
    expect(defaultItemsByProfile.SEASONAL).toEqual(["id"]);
  });
});
