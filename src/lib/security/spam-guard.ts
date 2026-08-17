import { createHmac } from "node:crypto";

/// Defensas del formulario publico frente a envios automaticos.
///
/// El formulario es anonimo por diseno: el interesado no inicia sesion. Sin
/// estas comprobaciones, veinte lineas de codigo bastan para mandar diez mil
/// solicitudes falsas en una hora, llenar la base de datos, crear diez mil
/// carpetas en Drive y reventar la bandeja de info@artikore.com.
///
/// Todas las medidas son invisibles para una persona normal. Nada de
/// CAPTCHAs: la mayoria del abuso se detiene sin molestar a nadie, y si algun
/// dia hiciera falta mas, se anade una verificacion entonces.

/// Tiempo minimo razonable para rellenar el formulario, en segundos.
///
/// Son siete pasos con datos personales, respuestas y consentimientos. Una
/// persona que lo haga a toda prisa tarda como poco medio minuto; un programa
/// lo envia en decimas.
export const MIN_FILL_SECONDS = 20;

/// Topes por direccion de internet.
///
/// Generosos a proposito: una familia que mira cinco pisos en una tarde no
/// puede quedarse fuera. Lo que cortan es el envio masivo.
export const MAX_PER_IP_PER_HOUR = 10;
export const MAX_PER_IP_PER_DAY = 25;

/// Ventana en la que dos envios iguales se consideran el mismo.
/// Cubre el doble clic y el "no se si se ha enviado, lo mando otra vez".
export const DUPLICATE_WINDOW_MINUTES = 15;

export type GuardVerdict =
  | { allow: true }
  /// El envio se descarta pero al remitente se le responde como si hubiera
  /// ido bien: decirle a un programa por que ha fallado solo le ayuda a
  /// afinar el siguiente intento.
  | { allow: false; reason: string; pretendSuccess: boolean };

/// Cifra la direccion en un solo sentido. Nunca se guarda en claro.
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  return createHmac("sha256", secret).update(ip.trim()).digest("hex").slice(0, 32);
}

/// Saca la direccion del cliente de las cabeceras del proxy.
///
/// En Vercel llega en x-forwarded-for, que puede traer varias separadas por
/// comas; la primera es la del navegador.
export function clientIpFrom(headers: {
  get(name: string): string | null;
}): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip") ?? null;
}

/// Comprobaciones que no necesitan la base de datos.
export function checkSubmissionShape(input: {
  /// Campo trampa: existe en el formulario pero esta oculto. Una persona no
  /// lo ve, asi que solo lo rellena un programa que completa todo lo que
  /// encuentra.
  honeypot: string | undefined;
  /// Momento en que se cargo el formulario, en milisegundos.
  startedAt: number | undefined;
  now?: number;
}): GuardVerdict {
  if (input.honeypot && input.honeypot.trim() !== "") {
    return { allow: false, reason: "honeypot", pretendSuccess: true };
  }

  if (typeof input.startedAt !== "number" || !Number.isFinite(input.startedAt)) {
    // Sin marca de tiempo no podemos medir, pero tampoco es motivo para
    // rechazar: puede ser un navegador con el reloj mal o JavaScript raro.
    return { allow: true };
  }

  const now = input.now ?? Date.now();
  const elapsedSeconds = (now - input.startedAt) / 1000;

  // Un tiempo negativo o absurdo indica manipulacion.
  if (elapsedSeconds < 0) {
    return { allow: false, reason: "tiempo-invalido", pretendSuccess: true };
  }

  if (elapsedSeconds < MIN_FILL_SECONDS) {
    return { allow: false, reason: "demasiado-rapido", pretendSuccess: true };
  }

  return { allow: true };
}

/// Decide segun los envios recientes de esa misma direccion.
export function checkRate(counts: {
  lastHour: number;
  lastDay: number;
}): GuardVerdict {
  if (counts.lastHour >= MAX_PER_IP_PER_HOUR) {
    return { allow: false, reason: "limite-por-hora", pretendSuccess: false };
  }

  if (counts.lastDay >= MAX_PER_IP_PER_DAY) {
    return { allow: false, reason: "limite-diario", pretendSuccess: false };
  }

  return { allow: true };
}
