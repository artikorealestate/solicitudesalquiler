import { describe, expect, it } from "vitest";
import {
  availableItemsByProfile,
  defaultItemsByProfile,
  guessProfile,
  profileLabels,
  requestPeople,
  type ApplicantProfile,
} from "../../src/lib/applications/document-catalog";
import { es } from "../../src/i18n/dictionaries/es";

const profiles = Object.keys(profileLabels) as ApplicantProfile[];

/// Lo que piden las aseguradoras de impago para cada perfil.
describe("documentacion por perfil", () => {
  it("al asalariado: contrato, tres nominas y tres meses de extractos", () => {
    expect(defaultItemsByProfile.SALARIED).toEqual([
      "id",
      "employmentContract",
      "incomeProof",
      "bankStatements3",
    ]);
  });

  it("al autonomo: renta, trimestrales, actividad y seis meses", () => {
    expect(defaultItemsByProfile.SELF_EMPLOYED).toContain("taxReturn");
    expect(defaultItemsByProfile.SELF_EMPLOYED).toContain("quarterlyTax");
    expect(defaultItemsByProfile.SELF_EMPLOYED).toContain("bankStatements6");
  });

  it("al empresario o socio: lo que cobra de la sociedad y seis meses", () => {
    expect(defaultItemsByProfile.BUSINESS_OWNER).toContain("ownerPayProof");
    expect(defaultItemsByProfile.BUSINESS_OWNER).toContain("bankStatements6");
  });

  it("al pensionista: certificado y tres meses", () => {
    expect(defaultItemsByProfile.PENSIONER).toEqual([
      "id",
      "pensionProof",
      "bankStatements3",
    ]);
  });

  it("a quien cobra de fuera: prueba de que el dinero esta en Espana", () => {
    expect(defaultItemsByProfile.FOREIGN_INCOME).toContain("fundsInSpain");
  });

  it("a quien no tiene ingresos solo la identidad", () => {
    expect(defaultItemsByProfile.NO_INCOME).toEqual(["id"]);
  });

  it("lo marcado por defecto siempre se puede pedir", () => {
    for (const profile of profiles) {
      for (const key of defaultItemsByProfile[profile]) {
        expect(availableItemsByProfile[profile]).toContain(key);
      }
    }
  });

  it("todos los documentos tienen nombre en castellano", () => {
    for (const profile of profiles) {
      for (const key of availableItemsByProfile[profile]) {
        expect(es.docs.items[key as keyof typeof es.docs.items]).toBeTruthy();
      }
    }
  });

  it("estudiantes y personas sin empleo van como sin ingresos propios", () => {
    expect(guessProfile({ employmentType: "student" })).toBe("NO_INCOME");
    expect(guessProfile({ employmentType: "unemployed" })).toBe("NO_INCOME");
  });
});

describe("personas de una peticion", () => {
  it("lee cada persona con su perfil y sus documentos", () => {
    const people = requestPeople({
      profile: "SALARIED",
      requestedItems: [],
      people: [
        { name: "Ana", role: "TENANT", profile: "SALARIED", items: ["id"] },
        {
          name: "Luis",
          role: "GUARANTOR",
          profile: "PENSIONER",
          items: ["pensionProof", "inventado"],
        },
      ],
    });

    expect(people).toHaveLength(2);
    expect(people[1]).toEqual({
      name: "Luis",
      role: "GUARANTOR",
      profile: "PENSIONER",
      items: ["pensionProof"],
    });
  });

  it("las peticiones antiguas son una sola persona sin nombre", () => {
    expect(
      requestPeople({
        profile: "SALARIED",
        requestedItems: ["id", "incomeProof"],
        people: null,
      }),
    ).toEqual([
      {
        name: null,
        role: "TENANT",
        profile: "SALARIED",
        items: ["id", "incomeProof"],
      },
    ]);
  });
});
