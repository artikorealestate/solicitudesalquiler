import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setStatusForAll } from "@/lib/properties/actions";
import {
  PropertyCard,
  type PropertyCardData
} from "@/components/admin/property-card";

export const dynamic = "force-dynamic";

const filters = [
  { key: "activos", label: "Activos", status: "ACTIVE" },
  { key: "pausados", label: "Pausados", status: "PAUSED" },
  { key: "archivados", label: "Archivados", status: "ARCHIVED" },
  { key: "todos", label: "Todos", status: null }
] as const;

export default async function PropertiesPage({
  searchParams
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const session = await getServerSession(authOptions);

  const activeFilter =
    filters.find((filter) => filter.key === estado) ?? filters[0];

  const [properties, counts, pendingBatch] = await Promise.all([
    prisma.property.findMany({
      where: activeFilter.status
        ? { status: activeFilter.status as never }
        : undefined,
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { applications: true } } }
    }),
    prisma.property.groupBy({ by: ["status"], _count: true }),
    prisma.importBatch.findFirst({
      where: {
        status: "PENDING",
        createdByEmail: session?.user?.email?.toLowerCase() ?? ""
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, itemCount: true, createdAt: true }
    })
  ]);

  const countFor = (status: string | null) =>
    status === null
      ? counts.reduce((total, group) => total + group._count, 0)
      : (counts.find((group) => group.status === status)?._count ?? 0);

  const cards: PropertyCardData[] = properties.map((property) => ({
    id: property.id,
    reference: property.reference,
    title: property.title,
    zone: property.zone,
    operationType: property.operationType,
    status: property.status,
    rentPrice: property.rentPrice,
    salePrice: property.salePrice,
    mainImageUrl: property.mainImageUrl,
    idealistaUrl: property.idealistaUrl,
    applicationCount: property._count.applications
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h1 className="heading-xl mt-2">Inmuebles</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/inmuebles/sincronizar" className="btn-secondary">
            Sincronizar con Idealista
          </Link>
          <Link href="/admin/inmuebles/nuevo" className="btn-primary">
            Nuevo inmueble
          </Link>
        </div>
      </div>

      {pendingBatch ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-gold/40 bg-gold-wash px-5 py-4">
          <p className="text-sm text-ink">
            Tienes <strong>{pendingBatch.itemCount} anuncios</strong> de Idealista
            esperando revision, traidos el{" "}
            {pendingBatch.createdAt.toLocaleDateString("es-ES")}.
          </p>
          <Link
            href={`/admin/inmuebles/sincronizar/${pendingBatch.id}`}
            className="btn-gold py-2 text-sm"
          >
            Revisar ahora
          </Link>
        </div>
      ) : null}

      {/* Filtros por estado, con el recuento a la vista para no tener que
          entrar en cada uno para saber si hay algo. */}
      <div className="mt-7 flex flex-wrap gap-2 border-b border-line pb-3">
        {filters.map((filter) => {
          const total = countFor(filter.status);
          const isActive = filter.key === activeFilter.key;

          return (
            <Link
              key={filter.key}
              href={`/admin/inmuebles?estado=${filter.key}`}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-ink-strong font-bold text-white"
                  : "text-ink hover:bg-cream-deep"
              }`}
            >
              {filter.label}
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? "text-white/70" : "text-ink-muted"
                }`}
              >
                {total}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Accion en bloque: tras sincronizar entran treinta y pico inmuebles
          pausados y activarlos de uno en uno no tiene sentido. */}
      {activeFilter.key === "pausados" && cards.length > 1 ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white px-5 py-4">
          <p className="text-sm text-ink">
            Activar un inmueble hace que aparezca en el formulario publico y
            puedas recibir solicitudes de el.
          </p>
          <form action={setStatusForAll.bind(null, "PAUSED", "ACTIVE")}>
            <button type="submit" className="btn-gold py-2 text-sm">
              Activar los {cards.length}
            </button>
          </form>
        </div>
      ) : null}

      {activeFilter.key === "activos" && cards.length > 1 ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white px-5 py-4">
          <p className="text-sm text-ink-muted">
            Estos {cards.length} inmuebles aparecen ahora mismo en el formulario
            publico.
          </p>
          <form action={setStatusForAll.bind(null, "ACTIVE", "PAUSED")}>
            <button type="submit" className="btn-secondary py-2 text-sm">
              Pausar todos
            </button>
          </form>
        </div>
      ) : null}

      {cards.length === 0 ? (
        <div className="surface mt-8 px-6 py-16 text-center">
          <p className="font-serif text-xl text-ink-strong">
            {activeFilter.status === null
              ? "Todavia no hay inmuebles"
              : `No hay inmuebles ${activeFilter.label.toLowerCase()}`}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            Puedes darlos de alta uno a uno, o traerlos de golpe desde tus
            anuncios de Idealista.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/admin/inmuebles/sincronizar" className="btn-primary">
              Traer desde Idealista
            </Link>
            <Link href="/admin/inmuebles/nuevo" className="btn-secondary">
              Crear a mano
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
