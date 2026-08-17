"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applicationStatuses } from "@/lib/applications/labels";

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
