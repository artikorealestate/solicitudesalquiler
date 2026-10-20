"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applicationStatuses } from "@/lib/applications/labels";
import { isDriveConfigured } from "@/lib/google/auth";
import { trashFolder } from "@/lib/google/drive";

async function requireAdminEmail(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("No autorizado");
  return session.user.email.toLowerCase();
}

export async function changeApplicationStatus(
  applicationId: string,
  formData: FormData,
) {
  const email = await requireAdminEmail();
  const status = String(formData.get("status") ?? "");

  if (!(applicationStatuses as readonly string[]).includes(status)) {
    throw new Error("Estado desconocido");
  }

  // Cambiar el estado es una gestion: reinicia el plazo de conservacion.
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as never, lastActivityAt: new Date() },
  });

  console.info(
    `[solicitudes] ${email} cambio la solicitud ${applicationId} a ${status}`,
  );

  revalidatePath(`/admin/solicitudes/${applicationId}`);
  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin");
}

/// Borra una solicitud y toda su documentacion.
///
/// Es tambien el mecanismo de "derecho al olvido" del RGPD: si un interesado
/// pide que se eliminen sus datos, esto los elimina de verdad.
///
/// Se lleva por delante, en cascada, sus documentos, consentimientos, notas y
/// peticiones de documentacion. La carpeta de Drive va a la papelera, donde
/// Drive la conserva 30 dias por si el borrado fue un error.
export async function deleteApplication(applicationId: string) {
  const email = await requireAdminEmail();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      firstName: true,
      lastName: true,
      operation: true,
      submittedAt: true,
      lastActivityAt: true,
      driveFolderId: true,
      property: { select: { reference: true } },
      _count: { select: { documents: true } },
    },
  });

  if (!application) redirect("/admin/solicitudes");

  // Primero Drive: si falla, la solicitud sigue en el panel y se puede
  // reintentar. Al reves quedaria una carpeta huerfana sin forma de
  // encontrarla desde la aplicacion.
  if (application.driveFolderId && isDriveConfigured()) {
    try {
      await trashFolder(application.driveFolderId);
    } catch (error) {
      console.error(
        `[solicitudes] No se ha podido mandar a la papelera la carpeta de ${applicationId}:`,
        error,
      );
    }
  }

  // Constancia del borrado sin datos personales: permite acreditar que se
  // atendio una supresion sin conservar lo suprimido.
  await prisma.$transaction([
    prisma.deletionLog.create({
      data: {
        reason: "MANUAL",
        operation: application.operation,
        propertyReference: application.property.reference,
        submittedAt: application.submittedAt,
        lastActivityAt: application.lastActivityAt,
        documentCount: application._count.documents,
        deletedBy: email,
      },
    }),
    prisma.application.delete({ where: { id: applicationId } }),
  ]);

  console.info(
    `[solicitudes] ${email} elimino la solicitud de ${application.firstName} ` +
      `${application.lastName} (${application._count.documents} documentos)`,
  );

  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin");
  redirect("/admin/solicitudes");
}

/// "Conservar 3 meses mas": reinicia el plazo de conservacion.
///
/// Para el candidato que encaja pero con el que no se ha avanzado todavia.
/// Es una decision consciente de alguien de Artiko, y queda anotada en la
/// ficha con quien y cuando: si se usara para guardar datos sin motivo, que
/// se vea.
export async function keepApplication(applicationId: string) {
  const email = await requireAdminEmail();

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { lastActivityAt: new Date() },
    }),
    prisma.note.create({
      data: {
        applicationId,
        authorEmail: email,
        body: "Conservada 3 meses más desde el panel.",
      },
    }),
    // El aviso anterior ya no vale: la fecha de borrado ha cambiado.
    prisma.retentionWarning.deleteMany({ where: { applicationId } }),
  ]);

  revalidatePath(`/admin/solicitudes/${applicationId}`);
  revalidatePath("/admin/solicitudes");
}

export async function addApplicationNote(
  applicationId: string,
  formData: FormData,
) {
  const email = await requireAdminEmail();
  const body = String(formData.get("body") ?? "").trim();

  if (!body) return;

  await prisma.note.create({
    data: { applicationId, authorEmail: email, body: body.slice(0, 4000) },
  });

  revalidatePath(`/admin/solicitudes/${applicationId}`);
}
