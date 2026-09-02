import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyUploadTicket } from "@/lib/applications/upload-ticket";
import { getFileLink } from "@/lib/google/drive";

/// Registra en la base de datos un documento que el navegador ya ha subido a
/// Drive, para que el panel pueda enlazarlo.
///
/// El identificador del archivo lo aporta el navegador, asi que se confirma
/// contra Drive antes de guardarlo: si no existe, la llamada falla.

const schema = z.object({
  applicationId: z.string().min(1).max(60),
  ticket: z.string().min(10).max(400),
  driveFileId: z.string().min(1).max(120),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive(),
  kind: z.string().max(60).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "peticion-invalida" }, { status: 400 });
  }

  const data = parsed.data;

  if (!verifyUploadTicket(data.ticket, data.applicationId)) {
    return NextResponse.json({ error: "permiso-caducado" }, { status: 403 });
  }

  const application = await prisma.application.findUnique({
    where: { id: data.applicationId },
    select: { id: true },
  });

  if (!application) {
    return NextResponse.json(
      { error: "solicitud-inexistente" },
      { status: 404 },
    );
  }

  let driveViewUrl: string;
  try {
    driveViewUrl = await getFileLink(data.driveFileId);
  } catch (error) {
    console.error("[drive] El archivo declarado no existe:", error);
    return NextResponse.json(
      { error: "archivo-no-encontrado" },
      { status: 400 },
    );
  }

  await prisma.document.create({
    data: {
      applicationId: application.id,
      kind: data.kind ?? null,
      fileName: data.fileName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      driveFileId: data.driveFileId,
      driveViewUrl,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
