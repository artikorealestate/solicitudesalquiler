/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { setPropertyStatus } from "@/lib/properties/actions";
import { operationLabels, statusLabels } from "@/lib/properties/schema";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-success/12 text-success",
  PAUSED: "bg-gold-wash text-gold-dark",
  ARCHIVED: "bg-cream-deep text-ink-muted"
};

export type PropertyCardData = {
  id: string;
  reference: string;
  title: string;
  zone: string | null;
  operationType: string;
  status: string;
  rentPrice: number | null;
  salePrice: number | null;
  mainImageUrl: string | null;
  idealistaUrl: string | null;
  applicationCount: number;
};

function priceLabel(property: PropertyCardData): string {
  const parts: string[] = [];
  if (property.rentPrice !== null) {
    parts.push(`${property.rentPrice.toLocaleString("es-ES")} €/mes`);
  }
  if (property.salePrice !== null) {
    parts.push(`${property.salePrice.toLocaleString("es-ES")} €`);
  }
  return parts.join(" · ") || "Sin precio";
}

export function PropertyCard({ property }: { property: PropertyCardData }) {
  return (
    <article
      className={`surface group overflow-hidden transition-shadow hover:shadow-lift ${
        property.status === "ARCHIVED" ? "opacity-60" : ""
      }`}
    >
      <Link href={`/admin/inmuebles/${property.id}`} className="block">
        <div className="relative aspect-[4/3] bg-cream-deep">
          {property.mainImageUrl ? (
            <img
              src={property.mainImageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-serif text-3xl text-line">Artiko</span>
            </div>
          )}

          <span
            className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-bold ${
              statusStyles[property.status] ?? statusStyles.ARCHIVED
            } bg-white/95`}
          >
            {statusLabels[property.status]}
          </span>

          {property.applicationCount > 0 ? (
            <span className="absolute right-3 top-3 rounded bg-ink-strong/90 px-2 py-0.5 text-xs font-bold text-white">
              {property.applicationCount}{" "}
              {property.applicationCount === 1 ? "solicitud" : "solicitudes"}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <p className="font-mono text-xs text-ink-muted">{property.reference}</p>

        <h2 className="mt-1 leading-snug">
          <Link
            href={`/admin/inmuebles/${property.id}`}
            className="font-bold text-ink-strong transition-colors hover:text-gold-dark"
          >
            {property.title}
          </Link>
        </h2>

        {property.zone ? (
          <p className="mt-0.5 text-sm text-ink-muted">{property.zone}</p>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-line-soft pt-3">
          <p className="font-serif text-lg leading-none text-gold-dark">
            {priceLabel(property)}
          </p>
          <p className="text-xs text-ink-muted">
            {operationLabels[property.operationType]}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {property.idealistaUrl ? (
            <a
              href={property.idealistaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-muted underline-offset-4 hover:text-gold-dark hover:underline"
            >
              Ver en Idealista ↗
            </a>
          ) : (
            <span />
          )}

          {/* Interruptor rapido: activar es lo que hace que el inmueble
              aparezca en el formulario publico. */}
          {property.status !== "ARCHIVED" ? (
            <form
              action={setPropertyStatus.bind(
                null,
                property.id,
                property.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
              )}
            >
              <button
                type="submit"
                className={`rounded-md border px-3 py-1 text-xs font-bold transition-colors ${
                  property.status === "ACTIVE"
                    ? "border-line text-ink-muted hover:border-ink-muted hover:text-ink"
                    : "border-gold bg-gold-wash text-gold-dark hover:bg-gold hover:text-white"
                }`}
              >
                {property.status === "ACTIVE" ? "Pausar" : "Activar"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </article>
  );
}
