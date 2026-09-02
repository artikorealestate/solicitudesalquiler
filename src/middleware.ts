import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

/// Todo lo que cuelga de /admin exige sesion, salvo la propia pantalla de
/// entrada. El formulario publico queda fuera: el interesado no inicia sesion.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
