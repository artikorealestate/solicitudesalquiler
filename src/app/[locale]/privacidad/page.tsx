import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtikoLogo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/public/site-footer";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { privacyPolicies } from "@/i18n/privacy";

/// Informacion completa de proteccion de datos, en el idioma de quien la lee.
///
/// Se enlaza desde el formulario, desde el pie de todas las paginas publicas
/// y desde el correo de confirmacion. No depende de la base de datos: tiene
/// que poder leerse aunque el resto de la aplicacion este caido.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const policy = isLocale(locale) ? privacyPolicies[locale] : null;
  return { title: policy ? `${policy.title} · Artiko Real Estate` : "Artiko" };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const policy = privacyPolicies[locale];
  const dictionary = await getDictionary(locale);

  return (
    <main className="mx-auto max-w-form px-4 py-10">
      <div className="flex justify-center">
        <a href={`/${locale}`} aria-label="Artiko Real Estate">
          <ArtikoLogo height={44} />
        </a>
      </div>

      <article className="surface mt-8 p-6 sm:p-9">
        <h1 className="heading-xl">{policy.title}</h1>
        <p className="mt-2 text-xs text-ink-muted">{policy.updated}</p>
        <p className="mt-5 text-sm leading-relaxed text-ink">{policy.intro}</p>

        {policy.sections.map((section) => (
          <section key={section.heading} className="mt-7">
            <h2 className="font-serif text-xl text-ink-strong">
              {section.heading}
            </h2>

            {section.items ? (
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink"
                  >
                    <span aria-hidden="true" className="text-gold-dark">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-relaxed text-ink"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>

      <SiteFooter dictionary={dictionary} locale={locale} />
    </main>
  );
}
