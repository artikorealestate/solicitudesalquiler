import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyUploadTicket } from "@/lib/applications/upload-ticket";
import { createResumableUpload } from "@/lib/google/drive";

/// Abre una subida directa del navegador a Google Drive.
///
/// El archivo NO pasa por aqui: las funciones de Vercel rechazan cuerpos de
/// mas de 4,5 MB y una nomina escaneada los supera. Lo que devolvemos es una
/// direccion de subida ya autorizada, valida para ese unico archivo y esa
/// unica carpeta. El navegador nunca ve nuestro token de Google.

const MAX_BYTES = 10 * 1024 * 1024;

/// Topes por solicitud. Holgados para un expediente real —nominas, contrato,
/// vida laboral, DNI de dos titulares— pero suficientes para que nadie use la
/// carpeta de un cliente como disco duro gratuito.
const MAX_DOCUMENTS_PER_APPLICATION = 25;
const MAX_TOTAL_BYTES_PER_APPLICATION = 120 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/webp"
];

const schema = z.object({
  applicationId: z.string().min(1).max(60),
  ticket: z.string().min(10).max(400),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive().max(MAX_BYTES)
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "peticion-invalida" }, { status: 400 });
  }

  const { applicationId, ticket, fileName, mimeType, sizeBytes } = parsed.data;

  if (!verifyUploadTicket(ticket, applicationId)) {
    return NextResponse.json({ error: "permiso-caducado" }, { status: 403 });
  }

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: "tipo-no-admitido" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      driveFolderId: true,
      documents: { select: { sizeBytes: true } }
    }
  });

  if (!application?.driveFolderId) {
    return NextResponse.json({ error: "sin-carpeta" }, { status: 409 });
  }

  if (application.documents.length >= MAX_DOCUMENTS_PER_APPLICATION) {
    return NextResponse.json({ error: "demasiados-archivos" }, { status: 429 });
  }

  const usedBytes = application.documents.reduce(
    (total, document) => total + document.sizeBytes,
    0
  );

  if (usedBytes + sizeBytes > MAX_TOTAL_BYTES_PER_APPLICATION) {
    return NextResponse.json({ error: "espacio-agotado" }, { status: 429 });
  }

  try {
    const uploadUrl = await createResumableUpload({
      fileName,
      mimeType,
      sizeBytes,
      parentFolderId: application.driveFolderId,
      // El origen tiene que ser EXACTAMENTE el del navegador que va a subir.
      // Si no coincide, Google acepta el archivo pero no devuelve las
      // cabeceras que permiten al navegador leer la respuesta: el documento
      // llega a Drive y la app se queda sin saber su identificador.
      // Con el movil en la red local el origen es 192.168.x.x, no localhost,
      // asi que hay que leerlo de la peticion en lugar de deducirlo.
      origin: request.headers.get("origin") ?? request.nextUrl.origin
    });

    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error("[drive] No se ha podido abrir la subida:", error);
    return NextResponse.json({ error: "drive-no-disponible" }, { status: 502 });
  }
}
