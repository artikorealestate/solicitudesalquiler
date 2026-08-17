/// Idiomas del formulario publico. El panel de administracion va solo en espanol.
export const locales = ["es", "en", "de", "fr", "ru", "uk", "nl", "pt", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/// Nombre de cada idioma en su propia lengua, que es como debe aparecer en el selector.
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  uk: "Українська",
  nl: "Nederlands",
  pt: "Português",
  it: "Italiano"
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/// Elige el mejor idioma soportado a partir de la cabecera Accept-Language.
/// Solo se usa como sugerencia inicial: el interesado siempre puede cambiarlo.
export function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qualityPart] = part.trim().split(";q=");
      return { tag: tag.split("-")[0].toLowerCase(), quality: Number(qualityPart ?? 1) };
    })
    .sort((a, b) => b.quality - a.quality);

  return preferred.find((entry) => isLocale(entry.tag))?.tag as Locale ?? defaultLocale;
}
