import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  getFromAddress,
  getInternalRecipients,
  getMailer,
} from "@/lib/mail/transport";
import { runRetention } from "@/lib/privacy/purge";

/// Tarea diaria. Hace dos cosas, en este orden:
///
/// 1. Mantiene despierta la base de datos y avisa si no responde. El plan
///    gratuito de Supabase pausa el proyecto tras una semana sin actividad,
///    y entonces cae tambien el formulario publico. Paso en septiembre de
///    2026 y nadie se entero en casi una semana.
///
/// 2. Aplica el plazo de conservacion de datos: borra las solicitudes
///    vencidas y avisa de las que van a vencer (ver lib/privacy).
///
/// Va todo en una sola tarea porque el plan gratuito de Vercel limita el
/// numero de tareas programadas.

export const dynamic = "force-dynamic";
/// Borrar carpetas de Drive lleva su tiempo; el limite por defecto se queda
/// corto si un dia vencen varias solicitudes a la vez.
export const maxDuration = 60;

async function alertDatabaseDown(detail: string) {
  const recipients = getInternalRecipients();
  if (recipients.length === 0) return;

  const url =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://artiko-interesados.vercel.app";

  await getMailer().sendMail({
    from: getFromAddress(),
    to: recipients,
    subject: "AVISO: la base de datos de Artiko Interesados no responde",
    text: [
      "La comprobacion automatica no ha podido conectar con la base de datos.",
      "",
      "Mientras siga asi, el formulario publico NO admite solicitudes y el",
      "panel no carga.",
      "",
      "Que suele ser: el proyecto de Supabase se ha pausado por inactividad.",
      "Se arregla entrando en el panel de Supabase y pulsando Restore.",
      "",
      `Comprobar si ya funciona: ${url}/api/health`,
      "",
      `Detalle tecnico: ${detail}`,
    ].join("\n"),
  });
}

export async function GET(request: NextRequest) {
  // Vercel firma sus ejecuciones programadas con CRON_SECRET. Si la variable
  // existe, se exige. Si no existe la ruta sigue siendo segura: solo hace lo
  // que de todos modos tocaba hacer ese dia (ver runRetention).
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const started = Date.now();

  // 1. Base de datos.
  try {
    await prisma.$queryRaw`select 1`;
  } catch (error) {
    console.error("[diaria] La base de datos no responde:", error);

    // Que falle el aviso no puede tumbar la respuesta: sin este try, un SMTP
    // caido convertiria un problema en dos y nos dejaria sin el 503.
    try {
      await alertDatabaseDown(String(error).slice(0, 500));
    } catch (mailError) {
      console.error("[diaria] Tampoco se ha podido avisar:", mailError);
    }

    // 503 a proposito: la ejecucion sale como fallida en Vercel.
    return NextResponse.json(
      { ok: false, error: "La base de datos no responde." },
      { status: 503 },
    );
  }

  // 2. Plazo de conservacion.
  try {
    const retention = await runRetention();
    console.info("[diaria] Conservacion:", retention);

    return NextResponse.json({
      ok: retention.failed === 0,
      ms: Date.now() - started,
      retention,
    });
  } catch (error) {
    console.error("[diaria] Fallo aplicando el plazo de conservacion:", error);
    return NextResponse.json(
      { ok: false, error: "Fallo aplicando el plazo de conservacion." },
      { status: 500 },
    );
  }
}
