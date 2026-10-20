import type { Dictionary } from "@/i18n";

/// Primera capa de informacion sobre proteccion de datos.
///
/// Es lo que la ley obliga a decir en el momento de recoger los datos
/// (art. 13 RGPD), resumido en una tabla como permite el art. 11 de la
/// LOPDGDD, con un enlace al resto. Lo que se muestra aqui es exactamente lo
/// que se guarda como constancia al enviar: si se cambia este texto, hay que
/// subir la version en el diccionario.
///
/// El enlace se abre en otra pestaña para no perder lo que la persona lleva
/// escrito.
export function PrivacyNotice({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: string;
}) {
  const t = dictionary.consent;

  return (
    <section
      aria-labelledby="privacy-notice-title"
      className="rounded-md border border-line bg-cream p-4 sm:p-5"
    >
      <h3
        id="privacy-notice-title"
        className="text-sm font-bold text-ink-strong"
      >
        {t.infoTitle}
      </h3>

      <dl className="mt-3 space-y-2.5">
        {t.infoRows.map((row) => (
          <div key={row.label} className="text-sm leading-relaxed">
            <dt className="font-bold text-ink-strong">{row.label}</dt>
            <dd className="text-ink">{row.text}</dd>
          </div>
        ))}
      </dl>

      <a
        href={`/${locale}/privacidad`}
        target="_blank"
        rel="noopener"
        className="mt-4 inline-block text-sm font-bold text-gold-dark underline-offset-4 hover:underline"
      >
        {t.moreInfo} ↗
      </a>
    </section>
  );
}

/// El texto tal y como se mostro, para guardarlo como constancia.
export function privacyNoticeSnapshot(dictionary: Dictionary): string {
  const t = dictionary.consent;
  return [
    t.infoTitle,
    ...t.infoRows.map((row) => `${row.label}: ${row.text}`),
    "",
    `[x] ${t.acknowledgeText}`,
  ].join("\n");
}
