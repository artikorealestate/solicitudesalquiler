import { prisma } from "@/lib/db";
import {
  ensureApplicantFolder,
  folderUrl,
  isUsableFolder,
  uploadSummaryDocument,
} from "@/lib/google/drive";
import { buildSummaryHtml } from "@/lib/applications/summary-html";

/// Garantiza que una solicitud tiene su carpeta en Drive, con el resumen
/// dentro, y devuelve su identificador.
///
/// Es la misma operacion que hace el formulario al enviar, pero sacada aparte
/// para poder repetirla: si en el momento del envio falla Drive, la solicitud
/// se queda sin carpeta y el navegador del interesado no sube sus documentos.
/// Antes eso no tenia arreglo. Ahora se vuelve a intentar cuando el
/// interesado abre su enlace personal, cuando abre una peticion de
/// documentacion, o cuando Artiko pulsa "Crear carpeta" en el panel.
///
/// Todo lo que necesita sale de la base de datos, no del formulario, para
/// poder ejecutarse en cualquier momento posterior.
///
/// Si la carpeta ya existe y sigue en su sitio, no hace nada: se puede llamar
/// sin miedo a duplicar.
export async function ensureApplicationFolder(
  applicationId: string,
): Promise<{ folderId: string; folderUrl: string }> {
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: {
      id: true,
      operation: true,
      locale: true,
      submittedAt: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      nationality: true,
      idDocument: true,
      comment: true,
      answers: true,
      driveFolderId: true,
      driveFolderUrl: true,
      consents: {
        select: { type: true, textVersion: true, textSnapshot: true },
        orderBy: { acceptedAt: "asc" },
      },
      property: {
        select: {
          id: true,
          reference: true,
          title: true,
          zone: true,
          rentPrice: true,
          salePrice: true,
          idealistaUrl: true,
          driveRentFolderId: true,
          driveSaleFolderId: true,
        },
      },
    },
  });

  if (
    application.driveFolderId &&
    (await isUsableFolder(application.driveFolderId))
  ) {
    return {
      folderId: application.driveFolderId,
      folderUrl:
        application.driveFolderUrl ?? folderUrl(application.driveFolderId),
    };
  }

  const { property } = application;
  const isRent = application.operation === "RENT";
  const cached = isRent
    ? property.driveRentFolderId
    : property.driveSaleFolderId;

  const { applicantFolderId, propertyFolderId } = await ensureApplicantFolder({
    operation: application.operation,
    propertyReference: property.reference,
    propertyTitle: property.title,
    cachedPropertyFolderId: cached,
    submittedAt: application.submittedAt,
    firstName: application.firstName,
    lastName: application.lastName,
  });

  const url = folderUrl(applicantFolderId);

  await prisma.application.update({
    where: { id: application.id },
    data: { driveFolderId: applicantFolderId, driveFolderUrl: url },
  });

  // Si la carpeta del inmueble se ha tenido que rehacer, se guarda la nueva:
  // la vieja ya no existe y fallaria otra vez con el siguiente interesado.
  if (propertyFolderId !== cached) {
    await prisma.property.update({
      where: { id: property.id },
      data: isRent
        ? { driveRentFolderId: propertyFolderId }
        : { driveSaleFolderId: propertyFolderId },
    });
  }

  await uploadSummaryDocument({
    name: `Resumen - ${application.firstName} ${application.lastName}`,
    parentFolderId: applicantFolderId,
    html: buildSummaryHtml({
      operation: application.operation,
      locale: application.locale,
      submittedAt: application.submittedAt,
      property: {
        reference: property.reference,
        title: property.title,
        zone: property.zone,
        price: isRent ? property.rentPrice : property.salePrice,
        idealistaUrl: property.idealistaUrl,
      },
      applicant: {
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        nationality: application.nationality,
        idDocument: application.idDocument,
        comment: application.comment,
      },
      answers: (application.answers ?? {}) as Record<string, string>,
      consents: application.consents.map((consent) => ({
        label:
          consent.type === "PRIVACY_NOTICE"
            ? "Informacion de proteccion de datos mostrada y leida"
            : consent.type,
        version: consent.textVersion,
        text: consent.textSnapshot,
      })),
    }),
  });

  return { folderId: applicantFolderId, folderUrl: url };
}

/// Igual, pero sin lanzar: para las paginas publicas, donde un fallo de
/// Drive no puede romper la pagina del interesado.
export async function tryEnsureApplicationFolder(
  applicationId: string,
): Promise<string | null> {
  try {
    return (await ensureApplicationFolder(applicationId)).folderId;
  } catch (error) {
    console.error(
      `[drive] No se ha podido preparar la carpeta de ${applicationId}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
