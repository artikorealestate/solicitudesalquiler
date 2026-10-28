import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  ensureApplicantFolder,
  ensurePropertyFolder,
  folderUrl,
  isUsableFolder,
  listFolderFiles,
  moveToFolder,
  trashFolder,
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
  const application = await loadApplication(applicationId);

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

  await writeSummary(application, applicantFolderId);

  return { folderId: applicantFolderId, folderUrl: url };
}

const applicationSelect = {
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
} satisfies Prisma.ApplicationSelect;

type LoadedApplication = Prisma.ApplicationGetPayload<{
  select: typeof applicationSelect;
}>;

function loadApplication(applicationId: string): Promise<LoadedApplication> {
  return prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: applicationSelect,
  });
}

/// Escribe el documento "Resumen - Nombre" en la carpeta del interesado, con
/// los datos que hay ahora en la base de datos.
async function writeSummary(
  application: LoadedApplication,
  folderId: string,
): Promise<void> {
  const { property } = application;
  const isRent = application.operation === "RENT";

  await uploadSummaryDocument({
    name: `Resumen - ${application.firstName} ${application.lastName}`,
    parentFolderId: folderId,
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
}

/// Pasa una solicitud a otro inmueble: cuando el interesado eligio el que no
/// era, o Artiko le ofrece otro que le encaja mejor.
///
/// Hace las tres cosas que tienen que ir juntas, o el panel y Drive dejarian
/// de coincidir:
///   1. Cambia el inmueble en la base de datos (y lo anota en la ficha).
///   2. Mueve su carpeta de Drive, con todos sus documentos, a la del
///      inmueble nuevo. Mover y no copiar: los enlaces siguen valiendo.
///   3. Rehace el resumen, que nombraba el inmueble anterior. El viejo va a
///      la papelera, no se borra.
///
/// Solo entre inmuebles de la misma operacion: una solicitud de alquiler
/// lleva preguntas y documentos de alquiler, y no sirve para una compra.
export async function moveApplicationToProperty(
  applicationId: string,
  propertyId: string,
  adminEmail: string,
): Promise<{ from: string; to: string }> {
  const before = await loadApplication(applicationId);
  if (before.property.id === propertyId) {
    return { from: before.property.reference, to: before.property.reference };
  }

  const target = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
    select: {
      id: true,
      reference: true,
      title: true,
      operationType: true,
      driveRentFolderId: true,
      driveSaleFolderId: true,
    },
  });

  const isRent = before.operation === "RENT";
  const sameOperation =
    target.operationType === "BOTH" ||
    target.operationType === (isRent ? "RENT" : "SALE");
  if (!sameOperation) {
    throw new Error(
      `El inmueble ${target.reference} no admite solicitudes de ${isRent ? "alquiler" : "compra"}.`,
    );
  }

  // Drive primero: si falla, la solicitud sigue entera donde estaba y se
  // puede reintentar. Al reves, el panel diria un inmueble y Drive otro.
  if (before.driveFolderId && (await isUsableFolder(before.driveFolderId))) {
    const cached = isRent ? target.driveRentFolderId : target.driveSaleFolderId;
    const targetFolderId = await ensurePropertyFolder({
      operation: before.operation,
      propertyReference: target.reference,
      propertyTitle: target.title,
      cachedPropertyFolderId: cached,
    });

    await moveToFolder(before.driveFolderId, targetFolderId);

    if (targetFolderId !== cached) {
      await prisma.property.update({
        where: { id: target.id },
        data: isRent
          ? { driveRentFolderId: targetFolderId }
          : { driveSaleFolderId: targetFolderId },
      });
    }
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { propertyId: target.id, lastActivityAt: new Date() },
    }),
    prisma.note.create({
      data: {
        applicationId,
        authorEmail: adminEmail,
        body: `Cambiada de inmueble: de ${before.property.reference} (${before.property.title}) a ${target.reference} (${target.title}).`,
      },
    }),
  ]);

  // El resumen al final, ya con el inmueble nuevo. Si esto fallase, el
  // cambio ya esta hecho y solo quedaria un resumen desactualizado.
  if (before.driveFolderId) {
    try {
      const files = await listFolderFiles(before.driveFolderId);
      for (const file of files) {
        if (file.name.startsWith("Resumen - ")) await trashFolder(file.id);
      }
      await writeSummary(
        await loadApplication(applicationId),
        before.driveFolderId,
      );
    } catch (error) {
      console.error(
        `[drive] Cambio de inmueble hecho, pero no se pudo rehacer el resumen de ${applicationId}:`,
        error,
      );
    }
  }

  return { from: before.property.reference, to: target.reference };
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
