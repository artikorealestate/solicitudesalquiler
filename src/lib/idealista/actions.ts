"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildBatchRows, type RawListing } from "@/lib/idealista/batch";

async function requireAdminEmail(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("No autorizado");
  return session.user.email.toLowerCase();
}

/// Genera (o regenera) la credencial del boton de la barra de marcadores.
/// Al regenerarla, el marcador anterior deja de funcionar: es la forma de
/// revocarlo si un equipo se pierde o alguien deja la empresa.
export async function regenerateSyncToken() {
  const email = await requireAdminEmail();

  const token = randomBytes(24).toString("base64url");

  await prisma.adminUser.update({
    where: { email },
    data: { syncToken: token },
  });

  revalidatePath("/admin/inmuebles/sincronizar");
}

export async function discardBatch(batchId: string) {
  await requireAdminEmail();

  await prisma.importBatch.update({
    where: { id: batchId },
    data: { status: "DISCARDED", reviewedAt: new Date() },
  });

  revalidatePath("/admin/inmuebles");
  redirect("/admin/inmuebles");
}

/// Aplica el lote: crea los inmuebles nuevos y actualiza los que han
/// cambiado, solo para los anuncios que el administrador haya dejado
/// marcados.
///
/// Nunca toca los campos internos de un inmueble existente (referencia,
/// estado, notas): esos son de Artiko, no de Idealista.
export async function applyBatch(batchId: string, formData: FormData) {
  const email = await requireAdminEmail();

  const selected = new Set(formData.getAll("apply").map(String));

  const batch = await prisma.importBatch.findUnique({
    where: { id: batchId },
    select: { payload: true, status: true },
  });

  if (!batch || batch.status !== "PENDING") {
    throw new Error("Ese lote ya no esta pendiente de revision");
  }

  const payload = batch.payload as { listings?: RawListing[] } | null;
  const listings = payload?.listings ?? [];

  const existing = await prisma.property.findMany({
    select: {
      id: true,
      idealistaId: true,
      reference: true,
      title: true,
      rentPrice: true,
      salePrice: true,
      zone: true,
      mainImageUrl: true,
    },
  });

  const rows = buildBatchRows(listings, existing).filter((row) =>
    selected.has(row.listing.idealistaId),
  );

  const usedReferences = new Set(existing.map((item) => item.reference));

  for (const row of rows) {
    const { listing } = row;

    if (row.state === "nuevo") {
      // Usamos la referencia que Artiko puso en Idealista ("195"). Si el
      // anuncio no la expone, caemos al identificador interno para no
      // dejarla vacia: es obligatoria y unica porque da nombre a la carpeta
      // de Drive. Cambiarla despues no rompe nada, porque el emparejamiento
      // entre sincronizaciones va por idealistaId.
      let reference = listing.reference;
      let suffix = 2;
      while (usedReferences.has(reference)) {
        reference = `${listing.reference}-${suffix}`;
        suffix += 1;
      }
      usedReferences.add(reference);

      await prisma.property.create({
        data: {
          reference,
          title: listing.title,
          operationType: listing.operationType,
          zone: listing.zone,
          address: listing.address,
          rentPrice: listing.rentPrice,
          salePrice: listing.salePrice,
          idealistaUrl: listing.idealistaUrl,
          idealistaId: listing.idealistaId,
          mainImageUrl: listing.mainImageUrl,
          description: listing.description,
          // Entran pausados a proposito: que un anuncio aparezca en Idealista
          // no significa que Artiko quiera recibir solicitudes por el
          // formulario todavia.
          status: "PAUSED",
        },
      });
    } else if (row.existingId) {
      await prisma.property.update({
        where: { id: row.existingId },
        data: {
          title: listing.title,
          zone: listing.zone,
          address: listing.address,
          rentPrice: listing.rentPrice,
          salePrice: listing.salePrice,
          idealistaUrl: listing.idealistaUrl,
          mainImageUrl: listing.mainImageUrl,
          description: listing.description,
        },
      });
    }
  }

  await prisma.importBatch.update({
    where: { id: batchId },
    data: { status: "APPLIED", reviewedAt: new Date() },
  });

  console.info(
    `[idealista] ${email} aplico ${rows.length} anuncios del lote ${batchId}`,
  );

  revalidatePath("/admin/inmuebles");
  revalidatePath("/admin");
  redirect("/admin/inmuebles");
}
