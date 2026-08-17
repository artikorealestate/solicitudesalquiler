import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyUploadTicket } from "@/lib/applications/upload-ticket";
import { listFolderFiles } from "@/lib/google/drive";

/// Red de seguridad de la subida de documentos.
///
/// El navegador sube el archivo directamente a Drive y despues nos dice que
/// identificador le ha tocado. Ese aviso puede perderse: basta con que la
/// persona cierre la pestana, se le vaya la cobertura, o que el navegador no
/// pueda leer la respuesta de Google por las reglas de origen cruzado.
///
/// Cuando eso pasa, el documento esta en Drive pero el panel dice "sin
/// documentacion", que es la peor combinacion posible: Artiko cree que falta
/// algo que en realidad tiene.
///
/// Este endpoint compara la carpeta de Drive con lo registrado y da de alta
/// lo que falte. Se llama al terminar las subidas, y es idempotente: llamarlo
/// dos veces no duplica nada.

const schema = z.object({
  applicationId: z.string().min(1).max(60),
  ticket: z.string().min(10).max(400)
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "peticion-invalida" }, { status: 400 });
  }

  const { applicationId, ticket } = parsed.data;

  if (!verifyUploadTicket(ticket, applicationId)) {
    return NextResponse.json({ error: "permiso-caducado" }, { status: 403 });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      driveFolderId: true,
      documents: { select: { driveFileId: true } }
    }
  });

  if (!application?.driveFolderId) {
    return NextResponse.json({ error: "sin-carpeta" }, { status: 409 });
  }

  let files;
  try {
    files = await listFolderFiles(application.driveFolderId);
  } catch (error) {
    console.error("[drive] No se ha podido revisar la carpeta:", error);
    return NextResponse.json({ error: "drive-no-disponible" }, { status: 502 });
  }

  const known = new Set(application.documents.map((doc) => doc.driveFileId));

  // El resumen lo genera la propia app; no es documentacion del interesado.
  const pending = files.filter(
    (file) =>
      !known.has(file.id) &&
      file.mimeType !== "application/vnd.google-apps.document" &&
      file.mimeType !== "application/vnd.google-apps.folder"
  );

  for (const file of pending) {
    await prisma.document.create({
      data: {
        applicationId: application.id,
        fileName: file.name,
        mimeType: file.mimeType,
        sizeBytes: Number(file.size ?? 0),
        driveFileId: file.id,
        driveViewUrl:
          file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`
      }
    });
  }

  if (pending.length > 0) {
    console.info(
      `[drive] Recuperados ${pending.length} documentos de la solicitud ${applicationId} ` +
        "que estaban en Drive sin registrar."
    );
  }

  return NextResponse.json({ recovered: pending.length });
}
