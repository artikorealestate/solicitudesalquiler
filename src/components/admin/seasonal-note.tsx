/// Sustituye al bloque de solvencia cuando la estancia es de temporada.
///
/// El hueco vacio invita a pensar que falta un dato. Este aviso dice que no
/// falta nada: es que a una estancia corta no se le aplica el criterio del
/// 30%, y por eso no se le pidieron los ingresos.
const purposeLabels: Record<string, string> = {
  work: "Trabajo o traslado laboral",
  studies: "Estudios",
  holiday: "Vacaciones",
  betweenHomes: "Mientras encuentra vivienda o acaban unas obras",
  other: "Otro motivo",
};

export function SeasonalNote({
  titulo,
  stay,
  purpose,
}: {
  /// "Temporada alta" o "Media temporada": son negocios distintos con
  /// tarifas distintas y conviene ver cual es sin abrir las fechas.
  titulo: string;
  stay: string | null;
  purpose: string | undefined;
}) {
  return (
    <div className="rounded-card bg-gold-wash p-4">
      <p className="text-sm font-bold text-gold-dark">{titulo}</p>

      {stay ? <p className="mt-2 text-sm text-ink-strong">{stay}</p> : null}

      {purpose ? (
        <p className="mt-1 text-sm text-ink">
          Motivo: {purposeLabels[purpose] ?? purpose}
        </p>
      ) : null}

      <p className="mt-3 border-t border-gold/25 pt-2 text-xs leading-relaxed text-ink-muted">
        No se le ha hecho el estudio de solvencia ni se le han pedido los
        ingresos: el criterio del 30% se aplica al alquiler de vivienda, no a
        una estancia corta que suele cobrarse por adelantado.
      </p>
    </div>
  );
}
