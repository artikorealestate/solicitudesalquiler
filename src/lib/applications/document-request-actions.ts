"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  availableItemsByProfile,
  resolveDocumentItems,
  type ApplicantProfile,
} from "@/lib/applications/document-catalog";
import {
  LOGO_ATTACHMENT,
  buildDocumentRequestEmail,
} from "@/lib/mail/templates";
import { getFromAddress, getMailer } from "@/lib/mail/transport";
import { getDictionary } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

/// El enlace vive 30 dias. Suficiente para que alguien reuna su vida laboral
/// y sus nominas sin agobios, y corto para que no quede una puerta abierta a
/// la carpeta de un cliente indefinidamente.
const EXPIRY_DAYS = 30;

async function requireAdminEmail(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("No autorizado");
  return session.user.email.toLowerCase();
}

export async function createDocumentRequest(
  applicationId: string,
  formData: FormData,
) {
  const adminEmail = await requireAdminEmail();

  const profile = String(formData.get("profile") ?? "") as ApplicantProfile;
  if (!(profile in availableItemsByProfile)) {
    throw new Error("Perfil desconocido");
  }

  // Solo se aceptan claves del catalogo del perfil elegido: el formulario
  // viene del navegador y no es de fiar.
  const allowed = new Set<string>(availableItemsByProfile[profile]);
  const requestedItems = formData
    .getAll("items")
    .map(String)
    .filter((key) => allowed.has(key));

  if (requestedItems.length === 0) {
    throw new Error("Hay que pedir al menos un documento");
  }

  const message = String(formData.get("message") ?? "").trim() || null;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      locale: true,
      property: { select: { reference: true, title: true } },
    },
  });

  if (!application) throw new Error("Solicitud inexistente");

  // Una peticion nueva deja sin efecto la anterior: si Artiko se dio cuenta
  // de que pidio lo que no era, el enlace viejo no puede seguir vivo.
  await prisma.documentRequest.updateMany({
    where: { applicationId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });

  const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const request = await prisma.documentRequest.create({
    data: {
      applicationId,
      profile,
      requestedItems,
      message,
      token: randomBytes(32).toString("base64url"),
      createdByEmail: adminEmail,
      expiresAt,
    },
    select: { id: true, token: true },
  });

  // El correo se manda despues de guardar. Si falla, la peticion existe y
  // Artiko puede copiar el enlace a mano desde el panel.
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // El correo va en el idioma en que la persona relleno el formulario.
    const locale = isLocale(application.locale)
      ? application.locale
      : defaultLocale;
    const dictionary = await getDictionary(locale);

    const email = buildDocumentRequestEmail({
      dictionary,
      firstName: application.firstName,
      property: application.property,
      items: resolveDocumentItems(requestedItems, dictionary.docs.items),
      message,
      link: `${appUrl}/documentos/${request.token}`,
      expiresAt,
      locale,
    });

    await getMailer().sendMail({
      from: getFromAddress(),
      to: application.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: [LOGO_ATTACHMENT],
    });
  } catch (error) {
    console.error(
      `[documentos] No se ha podido avisar a ${application.email}:`,
      error,
    );
  }

  revalidatePath(`/admin/solicitudes/${applicationId}`);
}

export async function cancelDocumentRequest(
  requestId: string,
  applicationId: string,
) {
  await requireAdminEmail();

  await prisma.documentRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
  });

  revalidatePath(`/admin/solicitudes/${applicationId}`);
}
