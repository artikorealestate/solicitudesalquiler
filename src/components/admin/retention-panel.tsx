import {
  keepApplication,
  leaveCandidatePool,
} from "@/lib/applications/actions";
import {
  daysUntilDeletion,
  isInWarningWindow,
  type Retention,
} from "@/lib/privacy/retention";

/// Cuando se borrara esta solicitud, y por que.
///
/// El borrado es automatico y no pide permiso, asi que tiene que verse antes
/// de que ocurra: en la ficha siempre, en rojo cuando faltan menos de dos
/// semanas, y con la forma de evitarlo a mano si hay motivo.
export function RetentionPanel({
  applicationId,
  retention,
  candidatePool,
}: {
  applicationId: string;
  retention: Retention;
  candidatePool: boolean;
}) {
  if (retention.kind === "contract") {
    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">
          Conservación de datos
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          Reservada o cerrada: <strong>no se borra sola</strong>. Es el
          expediente del contrato y tiene sus propios plazos legales.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          Cuando venzan (consúltalo con vuestro asesor: en contratos suele
          hablarse de seis años, y en ventas la ley de blanqueo obliga a guardar
          la identificación diez), bórrala a mano desde abajo.
        </p>
      </section>
    );
  }

  const days = daysUntilDeletion(retention) ?? 0;
  const urgent = isInWarningWindow(retention) || days === 0;

  return (
    <section className="surface p-5">
      <h2 className="font-serif text-lg text-ink-strong">
        Conservación de datos
      </h2>

      <p
        className={`mt-3 rounded-md px-3 py-2 text-sm ${
          urgent ? "bg-danger/10 text-danger" : "bg-gold-wash text-ink-strong"
        }`}
      >
        Se borrará con sus documentos el{" "}
        <strong>{retention.deleteAfter.toLocaleDateString("es-ES")}</strong>
        {days === 0
          ? " (hoy)"
          : days === 1
            ? " (mañana)"
            : ` (en ${days} días)`}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        {retention.months} meses desde la última gestión (
        {retention.lastActivity.toLocaleDateString("es-ES")}).{" "}
        {candidatePool
          ? "El interesado aceptó la bolsa de candidatos."
          : "Cambiar el estado, añadir una nota o pedir documentación reinicia el plazo."}
      </p>

      <form action={keepApplication.bind(null, applicationId)} className="mt-3">
        <button type="submit" className="btn-secondary w-full py-2 text-sm">
          Conservar {retention.months} meses más
        </button>
      </form>

      {candidatePool ? (
        <form
          action={leaveCandidatePool.bind(null, applicationId)}
          className="mt-2"
        >
          <button
            type="submit"
            className="w-full text-xs text-ink-muted underline-offset-4 hover:text-danger hover:underline"
          >
            Sacar de la bolsa de candidatos (si retira su consentimiento)
          </button>
        </form>
      ) : null}
    </section>
  );
}
