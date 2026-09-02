import nodemailer from "nodemailer";

/// Los correos salen por el SMTP de Gmail con una contrasena de aplicacion.
/// Se eligio frente a la API de Gmail porque el permiso de envio de la API es
/// "sensible" para Google: sin pasar su proceso de verificacion el acceso
/// caduca cada 7 dias y los envios se cortarian solos.
function readConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT ?? 465);

  const missing = [
    !host && "SMTP_HOST",
    !user && "SMTP_USER",
    !password && "SMTP_PASSWORD",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno para el envio de correo: ${missing.join(", ")}`,
    );
  }

  return { host: host!, user: user!, password: password!, port };
}

let cached: nodemailer.Transporter | null = null;

export function getMailer() {
  if (cached) return cached;

  const config = readConfig();

  cached = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // El 465 es SSL directo; el 587 negocia TLS despues de conectar.
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });

  return cached;
}

export function getFromAddress() {
  return (
    process.env.GMAIL_FROM_ADDRESS ??
    `Artiko Real Estate <${process.env.SMTP_USER}>`
  );
}

export function getInternalRecipients(): string[] {
  return (process.env.INTERNAL_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}
