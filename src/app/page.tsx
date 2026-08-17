import Link from "next/link";
import { headers } from "next/headers";
import { ArtikoLogo } from "@/components/brand/logo";
import { Flag } from "@/components/public/flags";
import { locales, localeNames, resolveLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

/// Primera pantalla del formulario publico.
///
/// No es una pagina de marketing: el interesado llega aqui desde un anuncio o
/// desde un enlace que le hemos pasado, asi que lo primero que ve es lo
/// primero que tiene que hacer.
export default async function LanguageChooserPage() {
  const requestHeaders = await headers();
  const suggested = resolveLocale(requestHeaders.get("accept-language"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="flex justify-center">
          <ArtikoLogo height={52} />
        </div>

        <div className="surface mt-8 p-7 sm:p-9">
          <p className="eyebrow">Solicitud de información</p>
          <h1 className="heading-lg mt-2">Choose your language</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Elige tu idioma para continuar · Choose your language to continue
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {locales.map((locale) => (
              <li key={locale}>
                <Link
                  href={`/${locale}`}
                  hrefLang={locale}
                  className={`flex h-full items-center justify-center gap-2 rounded-md border px-3 py-3 text-center text-sm transition-colors ${
                    locale === suggested
                      ? "border-gold bg-gold-wash font-bold text-ink-strong"
                      : "border-line bg-white text-ink hover:border-gold hover:text-ink-strong"
                  }`}
                >
                  <Flag locale={locale} />
                  {localeNames[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Artiko Real Estate · Valencia ·{" "}
          <a
            href={process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://artikore.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dark underline-offset-4 hover:underline"
          >
            artikore.com
          </a>
        </p>
      </div>
    </main>
  );
}
