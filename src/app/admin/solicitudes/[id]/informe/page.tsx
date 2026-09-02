import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtikoLogo } from "@/components/brand/logo";
import { PrintButton } from "@/components/admin/print-button";
import { prisma } from "@/lib/db";
import { assessSolvency } from "@/lib/applications/types";
import { describeStay, isSeasonalStay } from "@/lib/applications/stay";
import {
  operationLabels,
  questionLabelsFor,
  readableAnswer,
} from "@/lib/applications/labels";

export const dynamic = "force-dynamic";

/// Informe de candidato para enviar al propietario.
///
/// Lo que NO lleva es tan importante como lo que lleva: no incluye el DNI, ni
/// el telefono, ni el correo, ni los documentos adjuntos.
///
/// El propietario no necesita esos datos para decidir; necesita saber si el
/// candidato encaja. Reenviarle nominas y documentos de identidad significa
/// repartir datos personales a alguien que no tiene ninguna obligacion de
/// custodiarlos, y la responsable seguiria siendo Artiko, que es quien
/// recogio el consentimiento. Cuando el propietario elige candidato, ya se le
/// facilita lo que haga falta para el contrato.

/// Preguntas que sí ayudan al propietario a decidir. El resto se queda en el
/// panel.
const RENT_KEYS_FOR_OWNER = [
  "householdSize",
  "relationship",
  "occupation",
  "employmentType",
  "provableIncome",
  "stayPurpose",
  "pets",
  "searchDuration",
];

const SALE_KEYS_FOR_OWNER = [
  "buyerProfile",
  "needsFinancing",
  "financingApproved",
  "needToSell",
  "firstPurchase",
  "occupation",
];

export default async function OwnerReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      property: true,
      documents: { select: { fileName: true, mimeType: true } },
    },
  });

  if (!application) notFound();

  const answers = (application.answers ?? {}) as Record<string, string>;
  const labels = questionLabelsFor(application.operation);
  const keys =
    application.operation === "RENT"
      ? RENT_KEYS_FOR_OWNER
      : SALE_KEYS_FOR_OWNER;

  const estancia = describeStay(answers);

  // A una estancia de temporada no se le hace el estudio: ni se le pidieron
  // los ingresos, ni el criterio del 30% le corresponde.
  const temporada = application.operation === "RENT" && isSeasonalStay(answers);

  const solvency =
    application.operation === "RENT" && !temporada
      ? assessSolvency(application.property.rentPrice, answers.monthlyIncome)
      : null;

  return (
    <>
      {/* Barra de acciones: no se imprime. */}
      <div className="border-b border-line bg-white px-5 py-3 print:hidden">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/solicitudes/${application.id}`}
            className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            ← Volver a la solicitud
          </Link>
          <div className="flex items-center gap-3">
            <p className="text-xs text-ink-muted">
              Sin datos de contacto ni documentos adjuntos
            </p>
            <PrintButton />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl bg-white px-8 py-10 print:max-w-none print:px-0 print:py-0">
        <header className="flex items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <ArtikoLogo height={40} />
            <p className="mt-2 text-xs text-ink-muted">
              Informe de candidato ·{" "}
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-ink-muted">
              {application.property.reference}
            </p>
            <p className="text-sm font-bold text-ink-strong">
              {operationLabels[application.operation]}
            </p>
          </div>
        </header>

        <section className="mt-7">
          <p className="eyebrow">Inmueble</p>
          <h1 className="heading-lg mt-1">{application.property.title}</h1>
          {application.property.zone ? (
            <p className="mt-1 text-sm text-ink-muted">
              {application.property.zone}
            </p>
          ) : null}
          {application.operation === "RENT" &&
          application.property.rentPrice !== null ? (
            <p className="mt-2 font-serif text-xl text-gold-dark">
              {application.property.rentPrice.toLocaleString("es-ES")} € al mes
            </p>
          ) : null}
          {application.operation === "SALE" &&
          application.property.salePrice !== null ? (
            <p className="mt-2 font-serif text-xl text-gold-dark">
              {application.property.salePrice.toLocaleString("es-ES")} €
            </p>
          ) : null}
        </section>

        <section className="mt-8">
          <p className="eyebrow">Candidato</p>
          <h2 className="mt-1 font-serif text-2xl text-ink-strong">
            {application.firstName} {application.lastName}
          </h2>
          {application.nationality ? (
            <p className="mt-1 text-sm text-ink-muted">
              Nacionalidad: {application.nationality}
            </p>
          ) : null}

          {/* Para el propietario esto es la primera criba: o las fechas le
              encajan, o el resto del informe le da igual. */}
          {application.operation === "RENT" && estancia ? (
            <p className="mt-3 border-l-2 border-gold pl-3 font-serif text-lg text-ink-strong">
              {estancia}
            </p>
          ) : null}

          <dl className="mt-4 divide-y divide-line-soft border-y border-line-soft">
            {keys.map((key) => {
              const value = answers[key];
              if (!value) return null;
              return (
                <div key={key} className="flex gap-4 py-2.5">
                  <dt className="w-64 shrink-0 text-sm text-ink-muted">
                    {labels[key] ?? key}
                  </dt>
                  <dd className="text-sm text-ink-strong">
                    {readableAnswer(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        {solvency ? (
          <section className="mt-8">
            <p className="eyebrow">Solvencia</p>
            <div className="mt-2 rounded-card border border-line p-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl text-ink-strong">
                    {solvency.ratioPercent}% de sus ingresos
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {solvency.rentPrice.toLocaleString("es-ES")} € de alquiler
                    sobre {solvency.monthlyIncome.toLocaleString("es-ES")} €
                    netos mensuales declarados
                  </p>
                </div>
                <p
                  className={`shrink-0 rounded px-3 py-1 text-sm font-bold ${
                    solvency.band === "holgado"
                      ? "bg-success/12 text-success"
                      : solvency.band === "ajustado"
                        ? "bg-gold-wash text-gold-dark"
                        : "bg-danger/10 text-danger"
                  }`}
                >
                  {solvency.band === "holgado"
                    ? "Cumple"
                    : solvency.band === "ajustado"
                      ? "Ajustado"
                      : "Por debajo"}
                </p>
              </div>
              <p className="mt-3 border-t border-line-soft pt-3 text-xs leading-relaxed text-ink-muted">
                El criterio que aplicamos es que el alquiler no supere el 30% de
                los ingresos netos demostrables del grupo.
              </p>
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <p className="eyebrow">Documentación</p>
          {application.documents.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">Pendiente de recibir.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink">
                Tenemos {application.documents.length} documento
                {application.documents.length === 1 ? "" : "s"} en nuestro
                archivo, verificado
                {application.documents.length === 1 ? "" : "s"} por Artiko:
              </p>
              <ul className="mt-2 space-y-1">
                {application.documents.map((document) => (
                  <li
                    key={document.fileName}
                    className="text-sm text-ink-strong"
                  >
                    · {document.fileName}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                La documentación original se custodia en Artiko conforme a la
                normativa de protección de datos. Se facilitará lo necesario
                para la firma cuando el candidato sea seleccionado.
              </p>
            </>
          )}
        </section>

        {application.comment ? (
          <section className="mt-8">
            <p className="eyebrow">Comentario del candidato</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {application.comment}
            </p>
          </section>
        ) : null}

        <footer className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
          <p className="font-bold text-ink-strong">INMOARTIKO SL · B56527930</p>
          <p>C/ Numancia 6, 2-5, 46500 Sagunto (Valencia)</p>
          <p>info@artikore.com · artikore.com</p>
          <p className="mt-3">
            Documento informativo elaborado por Artiko Real Estate para la
            propiedad del inmueble. Contiene datos facilitados por el candidato
            con su consentimiento expreso para esta finalidad. No difundir.
          </p>
        </footer>
      </main>
    </>
  );
}
