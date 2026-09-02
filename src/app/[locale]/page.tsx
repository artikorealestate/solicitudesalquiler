import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/public/application-form";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import type { PublicProperty } from "@/lib/applications/types";

export const dynamic = "force-dynamic";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  // Solo los inmuebles activos, y solo los campos que puede ver cualquiera:
  // las notas internas y el estado no salen del servidor.
  const properties = await prisma.property.findMany({
    where: { status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      reference: true,
      title: true,
      zone: true,
      operationType: true,
      rentPrice: true,
      salePrice: true,
      mainImageUrl: true,
      idealistaUrl: true,
    },
  });

  return (
    <ApplicationForm
      dictionary={dictionary}
      locale={locale}
      properties={properties as PublicProperty[]}
    />
  );
}
