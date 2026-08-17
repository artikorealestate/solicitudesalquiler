import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DRIVE_SCOPE } from "@/lib/google/auth";

/// Arranca la autorizacion de Google Drive, una sola vez en la vida del
/// proyecto. Solo esta disponible en desarrollo: en produccion el token ya
/// tiene que estar en las variables de entorno.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "La autorizacion se hace en local, no en produccion." },
      { status: 404 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Falta GOOGLE_CLIENT_ID en el entorno." },
      { status: 500 }
    );
  }

  const redirectUri = new URL(
    "/api/google/drive/callback",
    request.url
  ).toString();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: DRIVE_SCOPE,
    // Sin estos dos, Google devuelve solo un token de una hora y ningun
    // refresh token, y la app dejaria de subir a Drive al rato.
    access_type: "offline",
    prompt: "consent"
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
