import { describe, expect, it } from "vitest";
import { es } from "../../src/i18n/dictionaries/es";
import { en } from "../../src/i18n/dictionaries/en";
import { de } from "../../src/i18n/dictionaries/de";
import { fr } from "../../src/i18n/dictionaries/fr";
import { it as italiano } from "../../src/i18n/dictionaries/it";
import { pt } from "../../src/i18n/dictionaries/pt";
import { nl } from "../../src/i18n/dictionaries/nl";
import { ru } from "../../src/i18n/dictionaries/ru";
import { uk } from "../../src/i18n/dictionaries/uk";
import { locales } from "../../src/i18n/config";
import { interpolate } from "../../src/i18n";

const dictionaries = { es, en, de, fr, it: italiano, pt, nl, ru, uk };

/// Recorre un objeto anidado y devuelve todas sus rutas: "common.next",
/// "rentQuestions.relationshipOptions.couple"...
function paths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [prefix];
  if (typeof value !== "object" || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, child]) =>
    paths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function valueAt(dictionary: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (current, key) => (current as Record<string, unknown>)?.[key],
      dictionary,
    );
}

const referencePaths = paths(es);

describe("diccionarios de idiomas", () => {
  it("hay un diccionario para cada idioma ofrecido en el selector", () => {
    for (const locale of locales) {
      expect(
        dictionaries[locale],
        `falta el diccionario de ${locale}`,
      ).toBeDefined();
    }
  });

  describe.each(Object.entries(dictionaries))("%s", (code, dictionary) => {
    it("tiene exactamente las mismas claves que el espanol", () => {
      expect(paths(dictionary).sort()).toEqual(referencePaths.slice().sort());
    });

    it("no deja ningun texto vacio", () => {
      for (const path of referencePaths) {
        const value = valueAt(dictionary, path);
        if (typeof value === "string") {
          expect(value.trim(), `${code}: ${path} esta vacio`).not.toBe("");
        }
      }
    });

    it("conserva los marcadores que la aplicacion sustituye", () => {
      // Si una traduccion pierde {name} o cambia {rent} por {alquiler}, el
      // interesado veria el marcador crudo en pantalla.
      const withPlaceholders = referencePaths.filter((path) => {
        const value = valueAt(es, path);
        return typeof value === "string" && /\{\w+\}/.test(value);
      });

      for (const path of withPlaceholders) {
        const original = valueAt(es, path) as string;
        const translated = valueAt(dictionary, path) as string;

        const expected = [...original.matchAll(/\{(\w+)\}/g)]
          .map((match) => match[1])
          .sort();
        const actual = [...translated.matchAll(/\{(\w+)\}/g)]
          .map((match) => match[1])
          .sort();

        expect(actual, `${code}: ${path}`).toEqual(expected);
      }
    });

    it("mantiene el numero de sugerencias de documentacion", () => {
      expect(dictionary.documents.suggestionsRentList).toHaveLength(
        es.documents.suggestionsRentList.length,
      );
    });

    it("usa una version de consentimiento propia del idioma", () => {
      // Guardamos el texto aceptado junto a su version. Si dos idiomas
      // compartieran version con textos distintos, no se podria saber cual
      // firmo la persona.
      expect(dictionary.consent.gdprVersion.trim()).not.toBe("");
      expect(dictionary.consent.ownerVersion.trim()).not.toBe("");
    });
  });

  it("las versiones de consentimiento no se repiten entre idiomas", () => {
    const versions = Object.values(dictionaries).map(
      (dictionary) => dictionary.consent.gdprVersion,
    );
    expect(new Set(versions).size).toBe(versions.length);
  });

  it("interpolate rellena los marcadores de cualquier idioma", () => {
    expect(interpolate(ru.common.stepOf, { current: 3, total: 7 })).toBe(
      "Шаг 3 из 7",
    );
    expect(
      interpolate(de.success.emailSent, { email: "ana@example.com" }),
    ).toContain("ana@example.com");
  });
});
