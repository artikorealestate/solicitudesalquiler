"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import {
  MAX_PEOPLE_PER_REQUEST,
  availableItemsByProfile,
  isDocumentKey,
  profileLabels,
  resolvePeopleGroups,
  type ApplicantProfile,
  type DocumentKey,
  type RequestPerson,
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

const peopleSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1).max(80),
      role: z.enum(["TENANT", "GUARANTOR"]),
      profile: z.enum(
        Object.keys(profileLabels) as [ApplicantProfile, ...ApplicantProfile[]],
      ),
      items: z.array(z.string().max(40)).max(30),
    }),
  )
  .min(1)
  .max(MAX_PEOPLE_PER_REQUEST);

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

  const parsed = peopleSchema.safeParse(
    JSON.parse(String(formData.get("people") ?? "[]")),
  );
  if (!parsed.success) throw new Error("Personas no validas");

  // Solo se aceptan claves del catalogo del perfil de cada persona: el
  // formulario viene del navegador y no es de fiar.
  const people: RequestPerson[] = parsed.data
    .map((person) => {
      const allowed = new Set<string>(availableItemsByProfile[person.profile]);
      return {
        ...person,
        name: person.name.trim(),
        items: person.items.filter(
          (key): key is DocumentKey => allowed.has(key) && isDocumentKey(key),
        ),
      };
    })
    .filter((person) => person.items.length > 0);

  if (people.length === 0) {
    throw new Error("Hay que pedir al menos un documento");
  }

  const profile = people[0].profile;
  const requestedItems = [...new Set(people.flatMap((person) => person.items))];

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
      people,
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
      groups: resolvePeopleGroups(people, dictionary.docs.items),
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
