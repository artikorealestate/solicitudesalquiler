import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  addApplicationNote,
  changeApplicationStatus
} from "@/lib/applications/actions";
import { SolvencyBadge } from "@/components/admin/solvency-badge";
import { BuyerBadge } from "@/components/admin/buyer-badge";
import { assessBuyerReadiness } from "@/lib/applications/buyer-readiness";
import { DocumentRequestPanel } from "@/components/admin/document-request-panel";
import { DeleteApplication } from "@/components/admin/delete-application";
import { assessSolvency } from "@/lib/applications/types";
import { guessProfile } from "@/lib/applications/document-catalog";
import {
  applicationStatuses,
  localeLabels,
  operationLabels,
  questionLabelsFor,
  readableAnswer,
  statusLabels,
  statusStyles,
  type ApplicationStatus
} from "@/lib/applications/labels";

export const dynamic = "force-dynamic";

function Section({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif text-xl text-ink-strong">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DataRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line-soft py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-sm text-ink-muted sm:w-64 sm:shrink-0">{label}</dt>
      <dd className="text-sm text-ink-strong">{children}</dd>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      property: true,
      documents: { orderBy: { uploadedAt: "asc" } },
      consents: { orderBy: { acceptedAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
      documentRequests: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!application) notFound();

  const status = application.status as ApplicationStatus;
  const questionLabels = questionLabelsFor(application.operation);
  const answers = (application.answers ?? {}) as Record<string, string>;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        href="/admin/solicitudes"
        className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        ← Solicitudes
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            {operationLabels[application.operation]} ·{" "}
            {application.property.reference}
          </p>
          <h1 className="heading-xl mt-2">
            {application.firstName} {application.lastName}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Recibida el {application.submittedAt.toLocaleString("es-ES")} ·
            formulario en {localeLabels[application.locale] ?? application.locale}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className={`rounded px-3 py-1 text-sm font-bold ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>
          <Link
            href={`/admin/solicitudes/${application.id}/informe`}
            className="btn-secondary py-2 text-sm"
          >
            Informe para el propietario
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <Section title="Datos de contacto">
            <dl>
              <DataRow label="Nombre completo">
                {application.firstName} {application.lastName}
              </DataRow>
              <DataRow label="Email">
                <a
                  href={`mailto:${application.email}`}
                  className="text-gold-dark underline-offset-4 hover:underline"
                >
                  {application.email}
                </a>
              </DataRow>
              <DataRow label="Telefono">
                <a
                  href={`tel:${application.phone.replace(/\s/g, "")}`}
                  className="text-gold-dark underline-offset-4 hover:underline"
                >
                  {application.phone}
                </a>
              </DataRow>
              {application.nationality ? (
                <DataRow label="Nacionalidad">{application.nationality}</DataRow>
              ) : null}
              {application.idDocument ? (
                <DataRow label="Documento de identidad">
                  {application.idDocument}
                </DataRow>
              ) : null}
            </dl>
          </Section>

          <Section
            title="Inmueble"
            action={
              <Link
                href={`/admin/inmuebles/${application.property.id}`}
                className="text-sm text-gold-dark underline-offset-4 hover:underline"
              >
                Ver inmueble
              </Link>
            }
          >
            <dl>
              <DataRow label="Referencia">
                {application.property.reference}
              </DataRow>
              <DataRow label="Titulo">{application.property.title}</DataRow>
              {application.property.zone ? (
                <DataRow label="Zona">{application.property.zone}</DataRow>
              ) : null}
              {application.operation === "RENT" &&
              application.property.rentPrice !== null ? (
                <DataRow label="Precio de alquiler">
                  {application.property.rentPrice.toLocaleString("es-ES")} €/mes
                </DataRow>
              ) : null}
              {application.operation === "SALE" &&
              application.property.salePrice !== null ? (
                <DataRow label="Precio de venta">
                  {application.property.salePrice.toLocaleString("es-ES")} €
                </DataRow>
              ) : null}
            </dl>
          </Section>

          <Section title="Respuestas">
            <dl>
              {Object.entries(questionLabels).map(([key, label]) => {
                const value = answers[key];
                if (!value) return null;
                return (
                  <DataRow key={key} label={label}>
                    {readableAnswer(value)}
                  </DataRow>
                );
              })}
            </dl>

            {application.comment ? (
              <div className="mt-5 rounded-md bg-cream p-4">
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Comentario adicional
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-strong">
                  {application.comment}
                </p>
              </div>
            ) : null}
          </Section>

          <Section
            title="Documentacion"
            action={
              application.driveFolderUrl ? (
                <a
                  href={application.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-dark underline-offset-4 hover:underline"
                >
                  Abrir carpeta en Drive ↗
                </a>
              ) : null
            }
          >
            {application.documents.length === 0 ? (
              <p className="text-sm text-ink-muted">
                {application.driveFolderId
                  ? "El interesado no adjunto ningun documento."
                  : "No se creo carpeta en Drive para esta solicitud."}
              </p>
            ) : (
              <ul className="space-y-2">
                {application.documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex items-center gap-3 rounded-md border border-line px-4 py-2.5"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-strong">
                      {document.fileName}
                    </span>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {Math.round(document.sizeBytes / 1024)} KB
                    </span>
                    <a
                      href={document.driveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-gold-dark underline-offset-4 hover:underline"
                    >
                      Abrir ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Consentimientos">
            <ul className="space-y-3">
              {application.consents.map((consent) => (
                <li key={consent.id} className="rounded-md bg-cream p-4">
                  <p className="text-sm font-bold text-ink-strong">
                    {consent.type === "GDPR"
                      ? "Proteccion de datos (RGPD)"
                      : "Autorizacion para compartir con la propiedad"}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Aceptado el {consent.acceptedAt.toLocaleString("es-ES")} ·
                    version {consent.textVersion} · idioma {consent.locale}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink">
                    {consent.textSnapshot}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Columna de gestion: lo que Artiko hace con la solicitud. */}
        <aside className="space-y-5">
          {application.operation === "RENT" ? (
            <section>
              <h2 className="mb-2 font-serif text-lg text-ink-strong">
                Solvencia
              </h2>
              <SolvencyBadge
                assessment={assessSolvency(
                  application.property.rentPrice,
                  answers.monthlyIncome
                )}
              />
            </section>
          ) : (
            <section>
              <h2 className="mb-2 font-serif text-lg text-ink-strong">
                Perfil de comprador
              </h2>
              <BuyerBadge readiness={assessBuyerReadiness(answers)} />
            </section>
          )}

          <DocumentRequestPanel
            applicationId={application.id}
            suggestedProfile={guessProfile(answers)}
            active={application.documentRequests[0] ?? null}
            appUrl={process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}
          />

          <section className="surface p-5">
            <h2 className="font-serif text-lg text-ink-strong">Estado</h2>
            <form
              action={changeApplicationStatus.bind(null, application.id)}
              className="mt-3 space-y-3"
            >
              <label htmlFor="status" className="sr-only">
                Estado de la solicitud
              </label>
              <select
                id="status"
                name="status"
                defaultValue={application.status}
                className="field-input"
              >
                {applicationStatuses.map((value) => (
                  <option key={value} value={value}>
                    {statusLabels[value]}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary w-full py-2.5 text-sm">
                Guardar estado
              </button>
            </form>
          </section>

          <section className="surface p-5">
            <h2 className="font-serif text-lg text-ink-strong">Notas internas</h2>
            <p className="mt-1 text-xs text-ink-muted">
              No se muestran al interesado.
            </p>

            <form
              action={addApplicationNote.bind(null, application.id)}
              className="mt-3 space-y-3"
            >
              <label htmlFor="body" className="sr-only">
                Nueva nota
              </label>
              <textarea
                id="body"
                name="body"
                rows={3}
                placeholder="Escribe una nota…"
                className="field-input resize-y"
              />
              <button
                type="submit"
                className="btn-secondary w-full py-2.5 text-sm"
              >
                Anadir nota
              </button>
            </form>

            {application.notes.length > 0 ? (
              <ul className="mt-5 space-y-3 border-t border-line-soft pt-4">
                {application.notes.map((note) => (
                  <li key={note.id}>
                    <p className="whitespace-pre-wrap text-sm text-ink-strong">
                      {note.body}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {note.authorEmail} ·{" "}
                      {note.createdAt.toLocaleString("es-ES")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {/* Al final del todo, separado del resto: lo destructivo no debe
              quedar al lado de lo que se usa a diario. */}
          <DeleteApplication
            applicationId={application.id}
            applicantName={`${application.firstName} ${application.lastName}`}
            documentCount={application.documents.length}
          />
        </aside>
      </div>
    </main>
  );
}
