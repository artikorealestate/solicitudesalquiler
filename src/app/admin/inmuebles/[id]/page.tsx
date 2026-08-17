import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">Catalogo</p>
      <h1 className="heading-xl mt-2">{property.title}</h1>

      {property.idealistaId ? (
        <p className="mt-2 text-sm text-ink-muted">
          Vinculado al anuncio {property.idealistaId} de Idealista. Las
          sincronizaciones futuras actualizaran titulo, precio y foto; la
          referencia, el estado y las notas se quedan como los dejes aqui.
        </p>
      ) : null}

      <PropertyForm
        propertyId={property.id}
        initial={{
          reference: property.reference,
          title: property.title,
          operationType: property.operationType,
          zone: property.zone ?? "",
          address: property.address ?? "",
          rentPrice: property.rentPrice?.toString() ?? "",
          salePrice: property.salePrice?.toString() ?? "",
          idealistaUrl: property.idealistaUrl ?? "",
          mainImageUrl: property.mainImageUrl ?? "",
          status: property.status,
          internalNotes: property.internalNotes ?? ""
        }}
      />
    </main>
  );
}
