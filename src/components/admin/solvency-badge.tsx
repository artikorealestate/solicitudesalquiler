import {
  SOLVENCY_THRESHOLD,
  SOLVENCY_TIGHT_LIMIT,
  asPercent,
  type SolvencyAssessment,
} from "@/lib/applications/types";

const CRITERIO = asPercent(SOLVENCY_THRESHOLD);
const LIMITE = asPercent(SOLVENCY_TIGHT_LIMIT);

/// Muestra el ratio de solvencia de un vistazo.
///
/// Tres tramos en lugar de un si/no, porque la realidad tiene un medio: entre
/// el criterio y el limite es donde un aval, unos ahorros o un segundo
/// titular pueden inclinar la decision. Marcarlo en rojo haria descartar
/// candidatos que merecen una llamada.
const bandStyles: Record<SolvencyAssessment["band"], string> = {
  holgado: "bg-success/12 text-success",
  ajustado: "bg-gold-wash text-gold-dark",
  insuficiente: "bg-danger/10 text-danger",
};

const bandLabels: Record<SolvencyAssessment["band"], string> = {
  holgado: "Cumple el criterio",
  ajustado: "Ajustado",
  insuficiente: "Por debajo del criterio",
};

const bandHints: Record<SolvencyAssessment["band"], string> = {
  holgado: `El alquiler no supera el ${CRITERIO}% de los ingresos declarados.`,
  ajustado: `Entre el ${CRITERIO}% y el ${LIMITE}%. Merece una llamada: con aval, ahorros o un segundo titular puede encajar.`,
  insuficiente: `Supera el ${LIMITE}% de los ingresos declarados. Convendria aval o revisar el encaje.`,
};

export function SolvencyBadge({
  assessment,
  compact = false,
}: {
  assessment: SolvencyAssessment | null;
  compact?: boolean;
}) {
  if (!assessment) {
    return compact ? (
      <span className="text-xs text-ink-faint">—</span>
    ) : (
      <p className="text-sm text-ink-muted">
        No hay datos suficientes para calcular el ratio.
      </p>
    );
  }

  if (compact) {
    return (
      <span
        className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-bold ${
          bandStyles[assessment.band]
        }`}
        title={bandHints[assessment.band]}
      >
        {assessment.ratioPercent}%
      </span>
    );
  }

  return (
    <div className={`rounded-card p-4 ${bandStyles[assessment.band]}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold">{bandLabels[assessment.band]}</p>
        <p className="font-serif text-3xl leading-none">
          {assessment.ratioPercent}%
        </p>
      </div>

      <p className="mt-2 text-sm">
        {assessment.rentPrice.toLocaleString("es-ES")} € de alquiler sobre{" "}
        {assessment.monthlyIncome.toLocaleString("es-ES")} € declarados
      </p>

      <p className="mt-2 text-xs leading-relaxed opacity-90">
        {bandHints[assessment.band]}
      </p>

      {assessment.band !== "holgado" ? (
        <p className="mt-1.5 text-xs opacity-90">
          Para cumplir el {CRITERIO}% harian falta{" "}
          {assessment.recommendedIncome.toLocaleString("es-ES")} € netos.
        </p>
      ) : null}

      <p className="mt-3 border-t border-current/15 pt-2 text-xs opacity-75">
        Calculado sobre los ingresos que declaro el interesado. Pendiente de
        verificar con nominas o documentacion equivalente.
      </p>
    </div>
  );
}
