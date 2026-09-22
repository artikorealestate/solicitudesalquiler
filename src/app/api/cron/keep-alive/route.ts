import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/// Mantiene despierta la base de datos.
///
/// El plan gratuito de Supabase pausa un proyecto tras una semana sin
/// actividad. Cuando eso pasa no se cae solo el panel: el formulario publico
/// deja de responder y los interesados ven un error del servidor. Ocurrio en
/// septiembre de 2026 y estuvo asi varios dias sin que nadie lo notara,
/// porque nada avisa.
///
/// Una consulta trivial al dia basta para que el proyecto cuente como activo.
/// No lee ni escribe datos: solo abre la conexion.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Vercel firma sus ejecuciones programadas con CRON_SECRET. Si la variable
  // existe, se exige; asi nadie de fuera puede usar esta ruta para tantear.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const comienzo = Date.now();

  try {
    await prisma.$queryRaw`select 1`;
    return NextResponse.json({ ok: true, ms: Date.now() - comienzo });
  } catch (error) {
    // Se devuelve 503 a proposito: asi la ejecucion sale marcada como
    // fallida en Vercel en lugar de pasar por buena.
    console.error("[keep-alive] La base de datos no responde:", error);
    return NextResponse.json(
      { ok: false, error: "La base de datos no responde." },
      { status: 503 },
    );
  }
}
