import { createHmac, timingSafeEqual } from "node:crypto";

/// Permiso temporal para subir documentos de UNA solicitud concreta.
///
/// El formulario publico es anonimo, asi que sin esto cualquiera que
/// adivinase un identificador de solicitud podria colgar archivos en la
/// carpeta de Drive de otra persona. El billete se emite al enviar la
/// solicitud, va firmado y caduca en 30 minutos: suficiente para subir la
/// documentacion, corto para que no sirva despues.

const TTL_MS = 30 * 60 * 1000;

function secret(): string {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value) throw new Error("Falta NEXTAUTH_SECRET para firmar las subidas.");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueUploadTicket(applicationId: string): string {
  const expiresAt = Date.now() + TTL_MS;
  const payload = `${applicationId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyUploadTicket(
  ticket: string,
  applicationId: string,
): boolean {
  const parts = ticket.split(".");
  if (parts.length !== 3) return false;

  const [ticketApplicationId, expiresAtRaw, signature] = parts;
  if (ticketApplicationId !== applicationId) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = sign(`${ticketApplicationId}.${expiresAtRaw}`);

  // Comparacion en tiempo constante: comparar con === filtra por el primer
  // caracter distinto y deja medir cuanto se acerta.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
