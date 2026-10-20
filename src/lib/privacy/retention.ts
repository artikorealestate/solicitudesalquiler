/// Cuanto tiempo se conservan los datos de una solicitud.
///
/// Es la regla que se le cuenta al interesado en la informacion de
/// privacidad, asi que tiene que ser exactamente esto y nada mas:
///
/// - Si la solicitud no sigue adelante, se borra todo (datos y documentos)
///   tres meses despues de la ultima gestion.
/// - Si hay contrato o esta a punto (reservado o cerrado), no se borra sola:
///   pasa a ser el expediente de la operacion, con sus propios plazos legales.
///
/// "Ultima gestion" es la mas reciente de: un cambio de estado o una peticion
/// de conservar desde el panel, un documento subido, una nota, o una peticion
/// de documentacion. Asi una solicitud en la que se sigue trabajando nunca se
/// borra, y una olvidada en "Nuevo" si.
///
/// No hace falta marcar a nadie como descartado para que se borre: lo normal
/// es que nadie lo haga, y la ley no admite que eso alargue la conservacion.
///
/// Hubo una "bolsa de candidatos" opcional que alargaba el plazo a doce
/// meses; Artiko decidio no ofrecerla (octubre de 2026). Si se recupera,
/// tiene que volver tambien a la informacion de privacidad.

export const RETENTION_MONTHS = 3;

/// Con cuanta antelacion se avisa a Artiko de un borrado.
export const WARNING_DAYS = 14;

/// Estados en los que hay contrato o esta a punto de haberlo.
export const CONTRACT_STATUSES = ["RESERVED", "CLOSED"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export type RetentionInput = {
  status: string;
  lastActivityAt: Date;
  /// Fechas de documentos, notas y peticiones de documentacion.
  activity: ReadonlyArray<Date | null | undefined>;
};

export type Retention =
  | { kind: "contract" }
  | {
      kind: "scheduled";
      lastActivity: Date;
      deleteAfter: Date;
      months: number;
    };

/// Suma meses de calendario. El 31 de enero mas un mes es el 28 (o 29) de
/// febrero, no el 3 de marzo.
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCMonth(result.getUTCMonth() + months);
  if (result.getUTCDate() < day) result.setUTCDate(0);
  return result;
}

function isValidDate(value: Date | null | undefined): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function retentionFor(input: RetentionInput): Retention {
  if ((CONTRACT_STATUSES as readonly string[]).includes(input.status)) {
    return { kind: "contract" };
  }

  const lastActivity = [input.lastActivityAt, ...input.activity]
    .filter(isValidDate)
    .reduce((latest, date) => (date > latest ? date : latest));

  return {
    kind: "scheduled",
    lastActivity,
    deleteAfter: addMonths(lastActivity, RETENTION_MONTHS),
    months: RETENTION_MONTHS,
  };
}

export function isDue(retention: Retention, now: Date = new Date()): boolean {
  return (
    retention.kind === "scheduled" &&
    retention.deleteAfter.getTime() <= now.getTime()
  );
}

/// Dentro de las dos semanas previas al borrado, que es cuando se avisa.
export function isInWarningWindow(
  retention: Retention,
  now: Date = new Date(),
): boolean {
  if (retention.kind !== "scheduled" || isDue(retention, now)) return false;
  return (
    retention.deleteAfter.getTime() - now.getTime() <= WARNING_DAYS * DAY_MS
  );
}

/// Dias que faltan para el borrado, redondeando hacia arriba: "mañana" es 1,
/// no 0.
export function daysUntilDeletion(
  retention: Retention,
  now: Date = new Date(),
): number | null {
  if (retention.kind !== "scheduled") return null;
  return Math.max(
    0,
    Math.ceil((retention.deleteAfter.getTime() - now.getTime()) / DAY_MS),
  );
}
