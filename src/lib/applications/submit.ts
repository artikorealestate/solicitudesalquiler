"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  DUPLICATE_WINDOW_MINUTES,
  checkRate,
  checkSubmissionShape,
  clientIpFrom,
  hashIp
} from "@/lib/security/spam-guard";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { isDriveConfigured } from "@/lib/google/auth";
import {
  ensureApplicantFolder,
  folderUrl,
  uploadSummaryDocument
} from "@/lib/google/drive";
import { buildSummaryHtml } from "@/lib/applications/summary-html";
import { issueUploadTicket } from "@/lib/applications/upload-ticket";
import { sendApplicationEmails } from "@/lib/mail/send-application-emails";

/// Recepcion de una solicitud del formulario publico.
///
/// Este endpoint es anonimo por diseno —el interesado no inicia sesion— asi
/// que todo lo que llega se valida aqui: el navegador no es de fiar.

const submissionSchema = z.object({
  locale: z.string().refine(isLocale, "Idioma no soportado"),
  operation: z.enum(["RENT", "SALE"]),
  propertyId: z.string().min(1),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  // Obligatorios: hacen falta para el contrato y para el estudio de solvencia.
  nationality: z.string().trim().min(2).max(120),
  idDocument: z.string().trim().min(4).max(60),
  comment: z.string().trim().max(4000).optional(),
  answers: z.record(z.string(), z.string().max(2000)),
  consentGdpr: z.literal(true),
  consentOwner: z.literal(true),
  /// Cuantos archivos va a subir el navegador despues. Solo informativo, para
  /// el aviso interno: la subida real ocurre cuando este endpoint ya ha
  /// respondido.
  declaredDocumentCount: z.number().int().min(0).max(50).optional(),

  /// Campo trampa. Está oculto en el formulario: una persona no lo ve, así
  /// que solo llega relleno desde un programa automático.
  website: z.string().max(200).optional(),
  /// Momento en que se cargó el formulario, para medir cuánto se ha tardado.
  startedAt: z.number().optional()
});

export type SubmitResult =
  | {
      ok: true;
      applicationId: string;
      uploadTicket: string;
      /// false cuando Drive no esta disponible: el formulario no debe intentar
      /// subir archivos y perder el tiempo de la persona.
      canUploadDocuments: boolean;
    }
  | { ok: false; error: string };

/// Respuesta que se le da a un envio automatico: la misma cara que un exito,
/// pero sin billete de subida y sin haber guardado nada. Decirle a un programa
/// por que ha fallado solo le ayuda a afinar el siguiente intento.
const SILENT_DISCARD: SubmitResult = {
  ok: true,
  applicationId: "",
  uploadTicket: "",
  canUploadDocuments: false
};

export async function submitApplication(input: unknown): Promise<SubmitResult> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const data = parsed.data;
  const locale = data.locale as Locale;

  // --- Defensas frente a envios automaticos ---------------------------
  const shape = checkSubmissionShape({
    honeypot: data.website,
    startedAt: data.startedAt
  });

  if (!shape.allow) {
    console.warn(`[spam] Envio descartado (${shape.reason})`);
    return shape.pretendSuccess ? SILENT_DISCARD : { ok: false, error: "spam" };
  }

  const requestHeaders = await headers();
  const ipHash = hashIp(clientIpFrom(requestHeaders));

  if (ipHash) {
    const now = Date.now();
    const [lastHour, lastDay] = await Promise.all([
      prisma.application.count({
        where: { ipHash, submittedAt: { gte: new Date(now - 60 * 60 * 1000) } }
      }),
      prisma.application.count({
        where: {
          ipHash,
          submittedAt: { gte: new Date(now - 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    const rate = checkRate({ lastHour, lastDay });
    if (!rate.allow) {
      console.warn(`[spam] Limite alcanzado (${rate.reason})`);
      return { ok: false, error: "demasiados-envios" };
    }
  }

  // Doble envio de la misma persona al mismo inmueble: casi siempre es un
  // doble clic o un "no se si se ha mandado". Devolvemos la solicitud que ya
  // existe en lugar de crear un duplicado que ensucie el panel.
  const recentDuplicate = await prisma.application.findFirst({
    where: {
      email: data.email.toLowerCase(),
      propertyId: data.propertyId,
      submittedAt: {
        gte: new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000)
      }
    },
    select: { id: true, driveFolderId: true }
  });

  if (recentDuplicate) {
    console.info(`[spam] Envio duplicado de ${data.email}, se reutiliza`);
    return {
      ok: true,
      applicationId: recentDuplicate.id,
      uploadTicket: issueUploadTicket(recentDuplicate.id),
      canUploadDocuments: Boolean(recentDuplicate.driveFolderId)
    };
  }

  // El inmueble tiene que estar activo y admitir la operacion elegida. Sin
  // esta comprobacion, alguien podria enviar solicitudes de un inmueble
  // pausado manipulando el identificador.
  const property = await prisma.property.findFirst({
    where: {
      id: data.propertyId,
      status: "ACTIVE",
      operationType:
        data.operation === "RENT"
          ? { in: ["RENT", "BOTH"] }
          : { in: ["SALE", "BOTH"] }
    },
    select: {
      id: true,
      reference: true,
      title: true,
      zone: true,
      rentPrice: true,
      salePrice: true,
      driveRentFolderId: true,
      driveSaleFolderId: true
    }
  });

  if (!property) return { ok: false, error: "property-unavailable" };

  // Guardamos el texto legal exacto que se le mostro, en su idioma: si algun
  // dia hay que demostrar que consintio, el texto de hoy puede no ser el que
  // vio entonces.
  const dictionary = await getDictionary(locale);

  const application = await prisma.application.create({
    data: {
      operation: data.operation,
      locale,
      propertyId: property.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      nationality: data.nationality,
      idDocument: data.idDocument,
      comment: data.comment || null,
      answers: data.answers,
      ipHash,
      consents: {
        create: [
          {
            type: "GDPR",
            textVersion: dictionary.consent.gdprVersion,
            textSnapshot: dictionary.consent.gdprText,
            locale
          },
          {
            type: "OWNER_SHARING",
            textVersion: dictionary.consent.ownerVersion,
            textSnapshot: dictionary.consent.ownerText,
            locale
          }
        ]
      }
    },
    select: { id: true, submittedAt: true }
  });

  // --- Drive -------------------------------------------------------------
  // A partir de aqui la solicitud YA esta guardada. Si Drive falla no se
  // pierde nada: se registra el fallo y el administrador puede crear la
  // carpeta despues. Perder la solicitud de un cliente porque Google tenga
  // un mal dia seria mucho peor.
  let canUploadDocuments = false;
  let driveFolderUrl: string | null = null;

  if (isDriveConfigured()) {
    try {
      const cached =
        data.operation === "RENT"
          ? property.driveRentFolderId
          : property.driveSaleFolderId;

      const { applicantFolderId, propertyFolderId } = await ensureApplicantFolder({
        operation: data.operation,
        propertyReference: property.reference,
        propertyTitle: property.title,
        cachedPropertyFolderId: cached,
        submittedAt: application.submittedAt,
        firstName: data.firstName,
        lastName: data.lastName
      });

      driveFolderUrl = folderUrl(applicantFolderId);

      await prisma.application.update({
        where: { id: application.id },
        data: { driveFolderId: applicantFolderId, driveFolderUrl }
      });

      // Cacheamos la carpeta del inmueble para que las siguientes solicitudes
      // no repitan las tres busquedas del arbol.
      if (!cached) {
        await prisma.property.update({
          where: { id: property.id },
          data:
            data.operation === "RENT"
              ? { driveRentFolderId: propertyFolderId }
              : { driveSaleFolderId: propertyFolderId }
        });
      }

      await uploadSummaryDocument({
        name: `Resumen - ${data.firstName} ${data.lastName}`,
        parentFolderId: applicantFolderId,
        html: buildSummaryHtml({
          dictionary,
          operation: data.operation,
          locale,
          submittedAt: application.submittedAt,
          property: {
            reference: property.reference,
            title: property.title,
            zone: property.zone
          },
          applicant: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            nationality: data.nationality,
            idDocument: data.idDocument,
            comment: data.comment
          },
          answers: data.answers,
          consents: [
            {
              label: "Proteccion de datos (RGPD)",
              version: dictionary.consent.gdprVersion,
              text: dictionary.consent.gdprText
            },
            {
              label: "Autorizacion para compartir con la propiedad",
              version: dictionary.consent.ownerVersion,
              text: dictionary.consent.ownerText
            }
          ]
        })
      });

      canUploadDocuments = true;
    } catch (error) {
      console.error(
        `[drive] Fallo preparando la carpeta de la solicitud ${application.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  // --- Correos --------------------------------------------------------
  // Igual que con Drive: la solicitud ya esta guardada. Si el correo falla se
  // registra, pero el interesado no se queda sin solicitud por eso.
  const price =
    data.operation === "RENT"
      ? property.rentPrice !== null
        ? `${property.rentPrice.toLocaleString("es-ES")} €/mes`
        : ""
      : property.salePrice !== null
        ? `${property.salePrice.toLocaleString("es-ES")} €`
        : "";

  await sendApplicationEmails({
    dictionary,
    applicationId: application.id,
    operation: data.operation,
    locale,
    applicant: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone
    },
    property: {
      reference: property.reference,
      title: property.title,
      zone: property.zone
    },
    price,
    answers: data.answers,
    documentCount: data.declaredDocumentCount ?? 0,
    driveUrl: driveFolderUrl
  });

  return {
    ok: true,
    applicationId: application.id,
    uploadTicket: issueUploadTicket(application.id),
    canUploadDocuments
  };
}
