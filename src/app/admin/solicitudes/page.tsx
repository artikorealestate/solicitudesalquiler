import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  applicationStatuses,
  operationLabels,
  statusLabels,
  statusStyles,
  type ApplicationStatus
} from "@/lib/applications/labels";
import {
  buildApplicationWhere,
  searchToQueryString,
  type ApplicationSearch
} from "@/lib/applications/filters";
import { SolvencyBadge } from "@/components/admin/solvency-badge";
import { BuyerBadge } from "@/components/admin/buyer-badge";
import { assessSolvency } from "@/lib/applications/types";
import { assessBuyerReadiness } from "@/lib/applications/buyer-readiness";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams
}: {
  searchParams: Promise<ApplicationSearch>;
}) {
  const search = await searchParams;
  const where = buildApplicationWhere(search);

  const [applications, properties, statusCounts] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      take: 200,
      include: {
        property: {
          select: { id: true, reference: true, title: true, rentPrice: true }
        },
        _count: { select: { documents: true } }
      }
    }),
    prisma.property.findMany({
      where: { applications: { some: {} } },
      orderBy: { reference: "asc" },
      select: { id: true, reference: true, title: true }
    }),
    prisma.application.groupBy({ by: ["status"], _count: true })
  ]);

  const totalFor = (status: string) =>
    statusCounts.find((group) => group.status === status)?._count ?? 0;

  const hasFilters = Boolean(
    search.q || search.operacion || search.estado || search.inmueble
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Interesados</p>
          <h1 className="heading-xl mt-2">Solicitudes</h1>
        </div>

        {/* La exportacion arrastra los filtros puestos: lo que se descarga es
            exactamente lo que se esta viendo. */}
        <a
          href={`/api/admin/solicitudes/export?${searchToQueryString(search)}`}
          className="btn-secondary"
        >
          Exportar a Excel
        </a>
      </div>

      {/* Filtros en GET, para que cada combinacion tenga su direccion propia y
          se pueda guardar o compartir con un companero. */}
      <form method="get" className="surface mt-7 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="q" className="field-label">
              Buscar
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={search.q ?? ""}
              placeholder="Nombre, email o telefono"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="operacion" className="field-label">
              Operacion
            </label>
            <select
              id="operacion"
              name="operacion"
              defaultValue={search.operacion ?? ""}
              className="field-input"
            >
              <option value="">Todas</option>
              <option value="RENT">Alquiler</option>
              <option value="SALE">Compra</option>
            </select>
          </div>

          <div>
            <label htmlFor="estado" className="field-label">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={search.estado ?? ""}
              className="field-input"
            >
              <option value="">Todos</option>
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]} ({totalFor(status)})
                </option>
              ))}
            </select>
          </div>

          {properties.length > 0 ? (
            <div className="lg:col-span-3">
              <label htmlFor="inmueble" className="field-label">
                Inmueble
              </label>
              <select
                id="inmueble"
                name="inmueble"
                defaultValue={search.inmueble ?? ""}
                className="field-input"
              >
                <option value="">Todos</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.reference} — {property.title}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary py-2.5 text-sm">
              Filtrar
            </button>
            {hasFilters ? (
              <Link
                href="/admin/solicitudes"
                className="btn-secondary py-2.5 text-sm"
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </div>
      </form>

      {applications.length === 0 ? (
        <div className="surface mt-7 px-6 py-16 text-center">
          <p className="font-serif text-xl text-ink-strong">
            {hasFilters
              ? "Ninguna solicitud coincide con el filtro"
              : "Todavia no hay solicitudes"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            {hasFilters
              ? "Prueba a quitar algun filtro."
              : "Apareceran aqui en cuanto los interesados rellenen el formulario publico."}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink-muted">
            {applications.length} solicitud
            {applications.length === 1 ? "" : "es"}
            {applications.length === 200 ? " (mostrando las 200 mas recientes)" : ""}
          </p>

          <div className="surface mt-3 overflow-x-auto">
            <table className="w-full min-w-[54rem] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-normal">Interesado</th>
                  <th className="px-5 py-3 font-normal">Inmueble</th>
                  <th className="px-5 py-3 font-normal">Operacion</th>
                  <th
                    className="px-5 py-3 font-normal"
                    title="En alquiler, el ratio sobre ingresos declarados. En compra, el perfil del comprador."
                  >
                    Perfil
                  </th>
                  <th className="px-5 py-3 font-normal">Docs</th>
                  <th className="px-5 py-3 font-normal">Estado</th>
                  <th className="px-5 py-3 font-normal">Recibida</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-line-soft last:border-0 hover:bg-cream"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/solicitudes/${application.id}`}
                        className="font-bold text-ink-strong hover:text-gold-dark"
                      >
                        {application.firstName} {application.lastName}
                      </Link>
                      <span className="block text-xs text-ink-muted">
                        {application.email} · {application.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-ink-muted">
                        {application.property.reference}
                      </span>
                      <span className="block">{application.property.title}</span>
                    </td>
                    <td className="px-5 py-3">
                      {operationLabels[application.operation]}
                    </td>
                    <td className="px-5 py-3">
                      {application.operation === "RENT" ? (
                        <SolvencyBadge
                          compact
                          assessment={assessSolvency(
                            application.property.rentPrice,
                            (application.answers as Record<string, string>)
                              ?.monthlyIncome
                          )}
                        />
                      ) : (
                        <BuyerBadge
                          compact
                          readiness={assessBuyerReadiness(
                            (application.answers ?? {}) as Record<string, string>
                          )}
                        />
                      )}
                    </td>
                    <td className="px-5 py-3">{application._count.documents}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs ${
                          statusStyles[application.status as ApplicationStatus]
                        }`}
                      >
                        {statusLabels[application.status as ApplicationStatus]}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink-muted">
                      {application.submittedAt.toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
