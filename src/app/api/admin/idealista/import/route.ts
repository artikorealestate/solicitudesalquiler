import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

/// Recibe los anuncios que el boton de la barra de marcadores lee en la
/// pagina de Idealista del administrador.
///
/// Todo lo que llega aqui es contenido de una pagina de terceros: se valida,
/// se guarda como lote pendiente y NUNCA toca la tabla de inmuebles hasta que
/// una persona lo confirma en pantalla.

const ALLOWED_ORIGINS = [
  "https://www.idealista.com",
  "https://idealista.com"
];

/// Topes generosos frente a un catalogo real (19 anuncios) pero que impiden
/// que un envio manipulado llene la base de datos.
const MAX_LISTINGS = 200;

const listingSchema = z.object({
  idealistaId: z.string().min(1).max(40),
  /// Referencia propia de Artiko, leida de la ficha del anuncio.
  reference: z.string().max(60).nullable().optional(),
  title: z.string().min(1).max(300),
  priceText: z.string().max(60).nullable().optional(),
  url: z.string().max(500).nullable().optional(),
  imageUrl: z.string().max(1000).nullable().optional(),
  description: z.string().max(4000).nullable().optional(),
  details: z.array(z.string().max(120)).max(20).default([])
});

const payloadSchema = z.object({
  token: z.string().min(20).max(200),
  sourceUrl: z.string().max(500).optional(),
  hasMorePages: z.boolean().optional(),
  listings: z.array(listingSchema).min(1).max(MAX_LISTINGS)
});

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : null;

  return {
    "Access-Control-Allow-Origin": allowed ?? ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin"))
  });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders(request.headers.get("origin"));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El envio no es JSON valido." },
      { status: 400, headers }
    );
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "El envio no tiene el formato esperado." },
      { status: 400, headers }
    );
  }

  const { token, listings, sourceUrl, hasMorePages } = parsed.data;

  const admin = await prisma.adminUser.findUnique({
    where: { syncToken: token },
    select: { email: true, active: true }
  });

  // Mismo mensaje para token inexistente y administrador desactivado: no hay
  // razon para revelar cual de las dos cosas ocurre.
  if (!admin?.active) {
    return NextResponse.json(
      {
        error:
          "La credencial del boton no es valida. Vuelve a crearlo desde el panel de Artiko."
      },
      { status: 401, headers }
    );
  }

  // Un solo lote pendiente por administrador: si vuelve a sincronizar antes
  // de revisar, sustituimos el anterior en lugar de acumular borradores.
  await prisma.importBatch.updateMany({
    where: { createdByEmail: admin.email, status: "PENDING" },
    data: { status: "DISCARDED", reviewedAt: new Date() }
  });

  const batch = await prisma.importBatch.create({
    data: {
      createdByEmail: admin.email,
      itemCount: listings.length,
      payload: { listings, sourceUrl, hasMorePages: hasMorePages ?? false }
    },
    select: { id: true }
  });

  return NextResponse.json(
    { batchId: batch.id, received: listings.length },
    { status: 201, headers }
  );
}
