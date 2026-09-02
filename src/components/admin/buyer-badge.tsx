import {
  buyerBandHints,
  buyerBandLabels,
  type BuyerReadiness,
} from "@/lib/applications/buyer-readiness";

const bandStyles: Record<BuyerReadiness["band"], string> = {
  listo: "bg-success/12 text-success",
  encaminado: "bg-gold-wash text-gold-dark",
  explorando: "bg-cream-deep text-ink-muted",
};

const signalMarks = {
  fuerte: "✓",
  debil: "·",
  neutro: "·",
} as const;

/// Perfil de comprador de un vistazo.
///
/// "Explorando" sale en gris, no en rojo: alguien que empieza a buscar hoy
/// puede comprar el mes que viene. Es una senal de prioridad, no un descarte.
export function BuyerBadge({
  readiness,
  compact = false,
}: {
  readiness: BuyerReadiness;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span
        className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-bold ${
          bandStyles[readiness.band]
        }`}
        title={buyerBandHints[readiness.band]}
      >
        {buyerBandLabels[readiness.band]}
      </span>
    );
  }

  return (
    <div className={`rounded-card p-4 ${bandStyles[readiness.band]}`}>
      <p className="font-serif text-xl leading-none">
        {buyerBandLabels[readiness.band]}
      </p>
      <p className="mt-2 text-xs leading-relaxed opacity-90">
        {buyerBandHints[readiness.band]}
      </p>

      {readiness.signals.length > 0 ? (
        <ul className="mt-3 space-y-1 border-t border-current/15 pt-3">
          {readiness.signals.map((signal) => (
            <li key={signal.text} className="flex gap-2 text-xs">
              <span aria-hidden="true">{signalMarks[signal.weight]}</span>
              <span className={signal.weight === "debil" ? "opacity-75" : ""}>
                {signal.text}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
