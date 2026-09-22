import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/// Comprobacion de vida de la aplicacion.
///
/// Existe para que un vigilante externo pueda preguntar "¿esto funciona?"
/// cada pocos minutos y avisar cuando deje de hacerlo. En septiembre de 2026
/// la base de datos estuvo pausada casi una semana y nadie se entero: el
/// formulario publico devolvia un error a cada interesado que entraba.
///
/// Deliberadamente NO lleva credencial: un vigilante externo tiene que poder
/// llamarla sin configurar nada. Por eso tampoco dice nada que no se pueda
/// contar: ni cuantos datos hay, ni el mensaje de error interno, ni a que
/// servidor se conecta. Solo si responde o no.

export const dynamic = "force-dynamic";

export async function GET() {
  const comienzo = Date.now();

  try {
    await prisma.$queryRaw`select 1`;

    return NextResponse.json(
      { ok: true, db: "ok", ms: Date.now() - comienzo },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] La base de datos no responde:", error);

    // 503 y no 200: es lo que hace que un vigilante externo lo cuente como
    // caida sin tener que interpretar el contenido de la respuesta.
    return NextResponse.json(
      { ok: false, db: "down", ms: Date.now() - comienzo },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
