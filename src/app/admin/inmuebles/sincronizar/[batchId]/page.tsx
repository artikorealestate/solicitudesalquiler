import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { applyBatch, discardBatch } from "@/lib/idealista/actions";
import {
  buildBatchRows,
  summarizeBatch,
  type RawListing,
} from "@/lib/idealista/batch";

export const dynamic = "force-dynamic";

const stateStyles: Record<string, string> = {
  nuevo: "bg-success/10 text-success",
  cambiado: "bg-gold-wash text-gold-dark",
  igual: "bg-cream-deep text-ink-muted",
};

function formatPrice(listing: { rentPrice?: number; salePrice?: number }) {
  if (listing.rentPrice !== undefined) {
    return `${listing.rentPrice.toLocaleString("es-ES")} €/mes`;
  }
  if (listing.salePrice !== undefined) {
    return `${listing.salePrice.toLocaleString("es-ES")} €`;
  }
  return "sin precio";
}

export default async function ReviewBatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;

  const batch = await prisma.importBatch.findUnique({
    where: { id: batchId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      itemCount: true,
      payload: true,
    },
  });

  if (!batch) notFound();

  const payload = batch.payload as {
    listings?: RawListing[];
    hasMorePages?: boolean;
  } | null;

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

  const rows = buildBatchRows(payload?.listings ?? [], existing);
  const summary = summarizeBatch(rows);
  const actionable = rows.filter((row) => row.state !== "igual");

  if (batch.status !== "PENDING") {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="heading-xl">Este lote ya se reviso</h1>
        <p className="mt-3 text-sm text-ink">
          Se marco como {batch.status === "APPLIED" ? "aplicado" : "descartado"}
          . Vuelve a pulsar el marcador en Idealista si quieres sincronizar de
          nuevo.
        </p>
        <Link href="/admin/inmuebles" className="btn-primary mt-6">
          Volver a inmuebles
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="eyebrow">Sincronizacion</p>
      <h1 className="heading-xl mt-2">Revisar anuncios de Idealista</h1>
      <p className="mt-3 text-sm text-ink">
        {batch.itemCount} anuncios recibidos el{" "}
        {batch.createdAt.toLocaleString("es-ES")}.{" "}
        <strong>{summary.nuevos} nuevos</strong>, {summary.cambiados} con
        cambios y {summary.iguales} sin novedades.
      </p>

      {payload?.hasMorePages ? (
        <p className="mt-4 rounded-md border border-gold/40 bg-gold-wash px-4 py-3 text-sm text-ink">
          ⚠ Idealista tenia mas paginas de anuncios. Esto es solo la primera:
          pasa a la siguiente y vuelve a pulsar el marcador para traer el resto.
        </p>
      ) : null}

      {actionable.length === 0 ? (
        <div className="surface mt-8 px-6 py-12 text-center">
          <p className="font-serif text-xl text-ink-strong">
            No hay nada que cambiar
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Tus inmuebles ya coinciden con lo publicado en Idealista.
          </p>
          <form action={discardBatch.bind(null, batch.id)}>
            <button type="submit" className="btn-secondary mt-6">
              Cerrar esta sincronizacion
            </button>
          </form>
        </div>
      ) : (
        <form action={applyBatch.bind(null, batch.id)} className="mt-8">
          <div className="surface overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="w-12 px-5 py-3 font-normal">
                    <span className="sr-only">Aplicar</span>
                  </th>
                  <th className="px-5 py-3 font-normal">Anuncio</th>
                  <th className="px-5 py-3 font-normal">Precio</th>
                  <th className="px-5 py-3 font-normal">Que va a pasar</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const disabled = row.state === "igual";
                  return (
                    <tr
                      key={row.listing.idealistaId}
                      className={`border-b border-line-soft last:border-0 ${
                        disabled ? "opacity-55" : ""
                      }`}
                    >
                      <td className="px-5 py-3 align-top">
                        <input
                          type="checkbox"
                          name="apply"
                          value={row.listing.idealistaId}
                          defaultChecked={!disabled}
                          disabled={disabled}
                          aria-label={`Aplicar ${row.listing.title}`}
                          className="mt-1 h-4 w-4 accent-[#CAB269]"
                        />
                      </td>
                      <td className="px-5 py-3 align-top">
                        <span className="font-bold text-ink-strong">
                          {row.listing.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {row.existingReference
                            ? `Referencia ${row.existingReference}`
                            : `Se creara con referencia ${row.listing.reference}`}
                          {!row.existingReference &&
                          !row.listing.hasOwnReference ? (
                            <span className="text-danger">
                              {" "}
                              · Idealista no expone tu referencia para este
                              anuncio, se usa su identificador
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-5 py-3 align-top whitespace-nowrap">
                        {formatPrice(row.listing)}
                      </td>
                      <td className="px-5 py-3 align-top">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs ${
                            stateStyles[row.state]
                          }`}
                        >
                          {row.state}
                        </span>
                        {row.changes.length > 0 ? (
                          <ul className="mt-1.5 space-y-0.5 text-xs text-ink-muted">
                            {row.changes.map((change) => (
                              <li key={change}>{change}</li>
                            ))}
                          </ul>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Los inmuebles nuevos entran <strong>pausados</strong>: que un
            anuncio este en Idealista no significa que quieras recibir
            solicitudes por el formulario todavia. Los actualizados conservan su
            referencia, su estado y sus notas internas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Aplicar los seleccionados
            </button>
            <Link href="/admin/inmuebles" className="btn-secondary">
              Ahora no
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
