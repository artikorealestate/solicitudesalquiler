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
  formData: FormData
) {
  const email = await requireAdminEmail();
  const status = String(formData.get("status") ?? "");

  if (!(applicationStatuses as readonly string[]).includes(status)) {
    throw new Error("Estado desconocido");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as never }
  });

  console.info(
    `[solicitudes] ${email} cambio la solicitud ${applicationId} a ${status}`
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
      driveFolderId: true,
      _count: { select: { documents: true } }
    }
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
        error
      );
    }
  }

  await prisma.application.delete({ where: { id: applicationId } });

  console.info(
    `[solicitudes] ${email} elimino la solicitud de ${application.firstName} ` +
      `${application.lastName} (${application._count.documents} documentos)`
  );

  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin");
  redirect("/admin/solicitudes");
}

export async function addApplicationNote(
  applicationId: string,
  formData: FormData
) {
  const email = await requireAdminEmail();
  const body = String(formData.get("body") ?? "").trim();

  if (!body) return;

  await prisma.note.create({
    data: { applicationId, authorEmail: email, body: body.slice(0, 4000) }
  });

  revalidatePath(`/admin/solicitudes/${applicationId}`);
}
