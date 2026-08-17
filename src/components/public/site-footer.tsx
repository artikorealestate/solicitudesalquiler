import type { Dictionary } from "@/i18n";

/// Pie del formulario público.
///
/// Le estamos pidiendo a alguien su DNI, sus nóminas y su pasaporte. Que vea
/// a quién se los está dando no es un adorno: es lo que hace que termine el
/// formulario en lugar de cerrarlo, y además el RGPD obliga a identificar a
/// la empresa que trata los datos.
///
/// El canal de contacto es WhatsApp, no el correo, a propósito:
/// info@artikore.com es la bandeja de trabajo diaria de Artiko. Si se le da
/// esa dirección a cada interesado, en un mes queda inservible.
export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  const website = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://artikore.com";
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");

  return (
    <footer className="mt-10 border-t border-line pt-6 text-center">
      <p className="font-serif text-lg text-ink-strong">Artiko Real Estate</p>
      <p className="mt-0.5 text-xs text-ink-muted">{dictionary.footer.agency}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {dictionary.footer.whatsapp}
          </a>
        ) : null}

        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm text-ink transition-colors hover:border-gold"
        >
          artikore.com ↗
        </a>
      </div>

      {/* Identificación legal de quien trata los datos. Basta con el nombre
          y el CIF, que ya identifican unívocamente a la sociedad en el
          registro; la dirección completa no aporta nada al interesado. */}
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        INMOARTIKO SL · B56527930 · Sagunto (Valencia)
      </p>
    </footer>
  );
}
