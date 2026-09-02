import Link from "next/link";
import { prisma } from "@/lib/db";
import { isDriveConfigured } from "@/lib/google/auth";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  REVIEWING: "Revisando",
  PENDING_DOCS: "Pendiente de documentacion",
  VALID: "Valido",
  DISCARDED: "Descartado",
  VISIT_PROPOSED: "Visita propuesta",
  VISITED: "Visitado",
  OFFER: "Oferta",
  RESERVED: "Reservado",
  CLOSED: "Cerrado",
};

export default async function AdminDashboardPage() {
  const [activeProperties, totalApplications, newApplications, recent] =
    await Promise.all([
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: "NEW" } }),
      prisma.application.findMany({
        take: 8,
        orderBy: { submittedAt: "desc" },
        include: { property: { select: { reference: true, title: true } } },
      }),
    ]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="eyebrow">Panel interno</p>
      <h1 className="heading-xl mt-2">Resumen</h1>

      {!isDriveConfigured() ? (
        <div className="mt-6 rounded-card border border-danger/30 bg-danger/5 px-5 py-4">
          <p className="text-sm font-bold text-danger">
            Google Drive no esta conectado
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            Las solicitudes se guardan igualmente, pero los documentos que
            adjunten los interesados no se estan almacenando. Conectalo antes de
            publicar el formulario.
          </p>
          <a
            href="/api/google/drive/authorize"
            className="btn-primary mt-4 py-2 text-sm"
          >
            Conectar Google Drive
          </a>
        </div>
      ) : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Inmuebles activos" value={activeProperties} />
        <Stat label="Solicitudes recibidas" value={totalApplications} />
        <Stat label="Sin revisar" value={newApplications} accent />
      </dl>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="heading-lg">Solicitudes recientes</h2>
          <Link
            href="/admin/solicitudes"
            className="text-sm text-gold-dark underline-offset-4 hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="surface mt-4 px-6 py-12 text-center">
            <p className="font-serif text-xl text-ink-strong">
              Todavia no hay solicitudes
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
              Cuando publiques inmuebles y los interesados rellenen el
              formulario, apareceran aqui.
            </p>
            <Link href="/admin/inmuebles" className="btn-secondary mt-6">
              Gestionar inmuebles
            </Link>
          </div>
        ) : (
          <div className="surface mt-4 overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-normal">Interesado</th>
                  <th className="px-5 py-3 font-normal">Inmueble</th>
                  <th className="px-5 py-3 font-normal">Operacion</th>
                  <th className="px-5 py-3 font-normal">Estado</th>
                  <th className="px-5 py-3 font-normal">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((application) => (
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
                        {application.email}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {application.property.reference} ·{" "}
                      {application.property.title}
                    </td>
                    <td className="px-5 py-3">
                      {application.operation === "RENT" ? "Alquiler" : "Compra"}
                    </td>
                    <td className="px-5 py-3">
                      {statusLabels[application.status] ?? application.status}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {application.submittedAt.toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="surface p-5">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd
        className={`mt-1 font-serif text-4xl ${
          accent && value > 0 ? "text-gold-dark" : "text-ink-strong"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
