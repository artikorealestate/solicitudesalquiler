/// Autenticacion con Google para Drive.
///
/// Usamos OAuth con la cuenta que posee el Drive (artikorealestate@gmail.com)
/// y el permiso estrecho `drive.file`, que solo da acceso a los archivos y
/// carpetas que crea esta misma aplicacion. Elegido asi a proposito:
///
///   - Es una cuenta de Gmail gratuita, sin Workspace, asi que no hay
///     unidades compartidas y las cuentas de servicio no sirven (tienen 0 GB
///     de cuota y la subida fallaria).
///   - `drive.file` no es un permiso sensible para Google, asi que no exige
///     pasar su proceso de verificacion ni caduca cada 7 dias.
///
/// El precio de esa decision: la app solo ve lo que ella misma ha creado. Por
/// eso construye el arbol "Clientes interesados" desde cero en lugar de
/// escribir en una carpeta preexistente.

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

type CachedToken = { accessToken: string; expiresAt: number };
let cached: CachedToken | null = null;

function readCredentials() {
  // Reutilizamos las credenciales del login de administradores si no se han
  // definido unas propias para Drive: es el mismo proyecto de Google Cloud.
  const clientId =
    process.env.GOOGLE_DRIVE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    process.env.GOOGLE_DRIVE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  const missing = [
    !clientId && "GOOGLE_CLIENT_ID",
    !clientSecret && "GOOGLE_CLIENT_SECRET",
    !refreshToken && "GOOGLE_DRIVE_REFRESH_TOKEN",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno para Google Drive: ${missing.join(", ")}. ` +
        "Ejecuta 'npm run google:authorize' para obtener el token.",
    );
  }

  return {
    clientId: clientId!,
    clientSecret: clientSecret!,
    refreshToken: refreshToken!,
  };
}

export function isDriveConfigured(): boolean {
  try {
    readCredentials();
    return true;
  } catch {
    return false;
  }
}

/// Devuelve un token de acceso valido, renovandolo cuando hace falta.
/// Se cachea en memoria con un margen de 60 segundos para no pedir uno nuevo
/// en cada peticion.
export async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const { clientId, clientSecret, refreshToken } = readCredentials();

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Google ha rechazado la renovacion del token (${response.status}). ` +
        `Puede que se haya revocado el acceso: vuelve a ejecutar 'npm run google:authorize'. ${detail}`,
    );
  }

  const body = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cached = {
    accessToken: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };

  return cached.accessToken;
}

/// Vacia la cache. Util en pruebas y tras un error de autorizacion.
export function resetTokenCache() {
  cached = null;
}
