import { es, type Dictionary } from "./dictionaries/es";
import { defaultLocale, type Locale } from "./config";

/// Idiomas cuyos textos ya estan traducidos. Los demas se sirven en espanol
/// mientras tanto: es preferible un formulario legible en otro idioma a uno
/// lleno de huecos.
///
/// Al anadir una traduccion basta con registrarla aqui.
const dictionaries: Partial<Record<Locale, () => Promise<Dictionary>>> = {
  es: async () => es,
  en: async () => (await import("./dictionaries/en")).en,
  de: async () => (await import("./dictionaries/de")).de,
  fr: async () => (await import("./dictionaries/fr")).fr,
  it: async () => (await import("./dictionaries/it")).it,
  pt: async () => (await import("./dictionaries/pt")).pt,
  nl: async () => (await import("./dictionaries/nl")).nl,
  ru: async () => (await import("./dictionaries/ru")).ru,
  uk: async () => (await import("./dictionaries/uk")).uk,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries[defaultLocale];
  return load ? load() : es;
}

/// Indica si un idioma esta realmente traducido. Sirve para avisar en el
/// selector en lugar de fingir que lo esta.
export function isTranslated(locale: Locale): boolean {
  return locale in dictionaries;
}

/// Sustituye marcadores {clave} por sus valores.
/// "Paso {current} de {total}" + { current: 2, total: 7 } -> "Paso 2 de 7"
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
