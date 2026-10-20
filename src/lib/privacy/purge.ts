import { prisma } from "@/lib/db";
import { isDriveConfigured } from "@/lib/google/auth";
import { deleteFolderPermanently, trashFolder } from "@/lib/google/drive";
import {
  getFromAddress,
  getInternalRecipients,
  getMailer,
} from "@/lib/mail/transport";
import { applicationRetention, retentionSelect } from "./application-retention";
import {
  CONTRACT_STATUSES,
  WARNING_DAYS,
  daysUntilDeletion,
  isDue,
  isInWarningWindow,
} from "./retention";

/// Aplica el plazo de conservacion: borra lo que ha vencido y avisa a Artiko
/// de lo que va a vencer.
///
/// Se ejecuta una vez al dia. Es idempotente: si se lanzara dos veces seguidas
/// la segunda no haria nada, porque lo vencido ya no existe y los avisos ya
/// estan anotados. Por eso no pasa nada si alguien de fuera llama a la ruta:
/// solo puede provocar lo que de todos modos tocaba hacer ese dia.

export type PurgeReport = {
  checked: number;
  deleted: number;
  warned: number;
  failed: number;
  emailSent: boolean;
};

type Deleted = {
  operation: string;
  propertyReference: string;
  submittedAt: Date;
  documentCount: number;
};

type Upcoming = {
  id: string;
  name: string;
  propertyReference: string;
  deleteAfter: Date;
  days: number;
};

type Failed = { id: string; propertyReference: string; error: string };

const fecha = (date: Date) => date.toLocaleDateString("es-ES");

/// Borra la carpeta de Drive y despues la solicitud.
///
/// En ese orden y con esa condicion: si Drive falla, NO se borra la
/// solicitud. Quedaria una carpeta con el DNI y las nominas de alguien sin
/// nada en la aplicacion que lleve a ella, y ya no se borraria nunca. Mejor
/// dejar las dos cosas, avisar, y reintentarlo al dia siguiente.
async function deleteApplicationData(application: {
  id: string;
  driveFolderId: string | null;
}): Promise<void> {
  if (!application.driveFolderId) return;

  if (!isDriveConfigured()) {
    throw new Error("Drive no esta conectado: no se puede borrar la carpeta.");
  }

  try {
    await deleteFolderPermanently(application.driveFolderId);
  } catch (error) {
    // Plan B: la papelera, que Drive vacia sola a los 30 dias. Sigue siendo
    // un borrado, solo que con un mes de retraso.
    console.warn(
      `[conservacion] Borrado definitivo fallido en ${application.id}, se manda a la papelera:`,
      error,
    );
    await trashFolder(application.driveFolderId);
  }
}

async function sendDigest(
  deleted: Deleted[],
  upcoming: Upcoming[],
  failed: Failed[],
): Promise<boolean> {
  if (deleted.length + upcoming.length + failed.length === 0) return false;

  const recipients = getInternalRecipients();
  if (recipients.length === 0) return false;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://artiko-interesados.vercel.app";

  const lines: string[] = [];

  if (upcoming.length > 0) {
    lines.push(
      `SE BORRARAN EN LOS PROXIMOS ${WARNING_DAYS} DIAS (${upcoming.length})`,
      "",
    );
    for (const item of upcoming) {
      lines.push(
        `· ${item.name} · ref ${item.propertyReference} · el ${fecha(item.deleteAfter)} ` +
          `(${item.days === 1 ? "mañana" : `en ${item.days} dias`})`,
        `  ${appUrl}/admin/solicitudes/${item.id}`,
      );
    }
    lines.push(
      "",
      'Si quieres conservar alguna, abrela y pulsa "Conservar 3 meses mas".',
      "Si hay contrato, marcala como Reservado o Cerrado y no se borrara.",
      "",
    );
  }

  if (deleted.length > 0) {
    // Sin nombres a proposito: copiarlos en un correo seria guardar en otro
    // sitio justo lo que se acaba de borrar.
    lines.push(`BORRADAS HOY POR VENCER SU PLAZO (${deleted.length})`, "");
    for (const item of deleted) {
      lines.push(
        `· ${item.operation === "RENT" ? "Alquiler" : "Compra"} · ref ${item.propertyReference} · ` +
          `recibida el ${fecha(item.submittedAt)} · ${item.documentCount} documento(s)`,
      );
    }
    lines.push("");
  }

  if (failed.length > 0) {
    lines.push(`NO SE HAN PODIDO BORRAR (${failed.length})`, "");
    for (const item of failed) {
      lines.push(`· ref ${item.propertyReference} · ${item.error}`);
      lines.push(`  ${appUrl}/admin/solicitudes/${item.id}`);
    }
    lines.push(
      "",
      "Se reintentara mañana. Si se repite, la causa suele ser que Drive se ha",
      "desconectado: entra en el panel y vuelve a conectarlo.",
      "",
    );
  }

  lines.push(
    "Plazo: 3 meses desde la ultima gestion. Las reservas y operaciones",
    "cerradas no se borran solas.",
  );

  const subjectParts = [
    upcoming.length > 0 && `${upcoming.length} se borrarán pronto`,
    deleted.length > 0 && `${deleted.length} borradas`,
    failed.length > 0 && `${failed.length} con error`,
  ].filter(Boolean);

  await getMailer().sendMail({
    from: getFromAddress(),
    to: recipients,
    subject: `Protección de datos · ${subjectParts.join(" · ")}`,
    text: lines.join("\n"),
  });

  return true;
}

export async function runRetention(
  now: Date = new Date(),
): Promise<PurgeReport> {
  const applications = await prisma.application.findMany({
    where: { status: { notIn: [...CONTRACT_STATUSES] } },
    select: {
      ...retentionSelect,
      id: true,
      operation: true,
      firstName: true,
      lastName: true,
      submittedAt: true,
      driveFolderId: true,
      property: { select: { reference: true } },
      _count: { select: { documents: true } },
      retentionWarning: { select: { deleteAfter: true } },
    },
  });

  const deleted: Deleted[] = [];
  const upcoming: Upcoming[] = [];
  const failed: Failed[] = [];

  for (const application of applications) {
    const retention = applicationRetention(application);
    if (retention.kind !== "scheduled") continue;

    if (isDue(retention, now)) {
      try {
        await deleteApplicationData(application);

        await prisma.$transaction([
          prisma.deletionLog.create({
            data: {
              reason: "RETENTION",
              operation: application.operation,
              propertyReference: application.property.reference,
              submittedAt: application.submittedAt,
              lastActivityAt: retention.lastActivity,
              documentCount: application._count.documents,
            },
          }),
          prisma.application.delete({ where: { id: application.id } }),
        ]);

        deleted.push({
          operation: application.operation,
          propertyReference: application.property.reference,
          submittedAt: application.submittedAt,
          documentCount: application._count.documents,
        });
      } catch (error) {
        console.error(
          `[conservacion] No se ha podido borrar ${application.id}:`,
          error,
        );
        failed.push({
          id: application.id,
          propertyReference: application.property.reference,
          error: String(error).slice(0, 200),
        });
      }
      continue;
    }

    // Se avisa una vez por fecha: si la fecha cambia (alguien pidio
    // conservarla y luego volvio a quedar parada), se avisa otra vez.
    const alreadyWarned =
      application.retentionWarning?.deleteAfter.getTime() ===
      retention.deleteAfter.getTime();

    if (isInWarningWindow(retention, now) && !alreadyWarned) {
      upcoming.push({
        id: application.id,
        name: `${application.firstName} ${application.lastName}`,
        propertyReference: application.property.reference,
        deleteAfter: retention.deleteAfter,
        days: daysUntilDeletion(retention, now) ?? 0,
      });
    }
  }

  let emailSent = false;
  try {
    emailSent = await sendDigest(deleted, upcoming, failed);
  } catch (error) {
    console.error("[conservacion] No se ha podido enviar el resumen:", error);
  }

  // Los avisos solo se anotan si el correo salio: si no, se reintenta mañana.
  if (emailSent) {
    for (const item of upcoming) {
      await prisma.retentionWarning.upsert({
        where: { applicationId: item.id },
        create: { applicationId: item.id, deleteAfter: item.deleteAfter },
        update: { deleteAfter: item.deleteAfter, sentAt: now },
      });
    }
  }

  return {
    checked: applications.length,
    deleted: deleted.length,
    warned: emailSent ? upcoming.length : 0,
    failed: failed.length,
    emailSent,
  };
}
