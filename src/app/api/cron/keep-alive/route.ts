import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  getFromAddress,
  getInternalRecipients,
  getMailer,
} from "@/lib/mail/transport";

/// Mantiene despierta la base de datos y avisa si no lo esta.
///
/// El plan gratuito de Supabase pausa un proyecto tras una semana sin
/// actividad. Cuando eso pasa no se cae solo el panel: el formulario publico
/// deja de responder y los interesados ven un error del servidor. Ocurrio en
/// septiembre de 2026 y estuvo asi varios dias sin que nadie lo notara,
/// porque nada avisa.
///
/// Una consulta trivial al dia basta para que el proyecto cuente como activo.
/// No lee ni escribe datos: solo abre la conexion.
///
/// Y si falla, manda un correo. Sale por SMTP, que no depende de la base de
/// datos: justo por eso puede dar la noticia cuando la base es lo que esta
/// roto.

export const dynamic = "force-dynamic";

async function avisarPorCorreo(detalle: string) {
  const destinatarios = getInternalRecipients();
  if (destinatarios.length === 0) return;

  const url =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://artiko-interesados.vercel.app";

  await getMailer().sendMail({
    from: getFromAddress(),
    to: destinatarios,
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
      `Detalle tecnico: ${detalle}`,
    ].join("\n"),
  });
}

export async function GET(request: NextRequest) {
  // Vercel firma sus ejecuciones programadas con CRON_SECRET. Si la variable
  // existe, se exige; asi nadie de fuera puede disparar el aviso por correo.
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
    console.error("[keep-alive] La base de datos no responde:", error);

    // Que falle el aviso no puede tumbar la respuesta: sin este try, un SMTP
    // caido convertiria un problema en dos y nos dejaria sin el 503.
    try {
      await avisarPorCorreo(String(error).slice(0, 500));
    } catch (falloCorreo) {
      console.error("[keep-alive] Tampoco se ha podido avisar:", falloCorreo);
    }

    // Se devuelve 503 a proposito: asi la ejecucion sale marcada como
    // fallida en Vercel en lugar de pasar por buena.
    return NextResponse.json(
      { ok: false, error: "La base de datos no responde." },
      { status: 503 },
    );
  }
}
