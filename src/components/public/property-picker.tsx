"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dictionary } from "@/i18n";
import type { Operation, PublicProperty } from "@/lib/applications/types";

/// Seleccion de inmueble. Se muestran solo los activos que admiten la
/// operacion elegida, con foto y precio para que la persona reconozca cual es
/// el que vio anunciado.
export function PropertyPicker({
  dictionary,
  properties,
  operation,
  selectedId,
  onSelect,
  error
}: {
  dictionary: Dictionary;
  properties: PublicProperty[];
  operation: Operation;
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
}) {
  const available = properties.filter(
    (property) =>
      property.operationType === operation || property.operationType === "BOTH"
  );

  if (available.length === 0) {
    return (
      <p className="rounded-md border border-line bg-white px-4 py-6 text-center text-sm leading-relaxed text-ink-muted">
        {dictionary.property.empty}
      </p>
    );
  }

  return (
    <div>
      {error ? (
        <p className="field-error mb-3" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      ) : null}

      <ul className="space-y-3">
        {available.map((property) => {
          const isSelected = property.id === selectedId;
          const price =
            operation === "RENT" ? property.rentPrice : property.salePrice;

          return (
            <li key={property.id}>
              <label
                className={`flex cursor-pointer gap-4 rounded-card border p-3 transition-colors ${
                  isSelected
                    ? "border-gold bg-gold-wash"
                    : "border-line bg-white hover:border-gold"
                }`}
              >
                <input
                  type="radio"
                  name="property"
                  value={property.id}
                  checked={isSelected}
                  onChange={() => onSelect(property.id)}
                  className="sr-only"
                />

                {property.mainImageUrl ? (
                  <img
                    src={property.mainImageUrl}
                    alt=""
                    loading="lazy"
                    className="h-20 w-28 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-20 w-28 shrink-0 rounded-md bg-cream-deep" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-snug text-ink-strong">
                    {property.title}
                  </p>
                  {property.zone ? (
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {property.zone}
                    </p>
                  ) : null}
                  {price !== null ? (
                    <p className="mt-1.5 font-serif text-lg text-gold-dark">
                      {price.toLocaleString("es-ES")} €
                      {operation === "RENT" ? dictionary.property.perMonth : ""}
                    </p>
                  ) : null}
                </div>

                {isSelected ? (
                  <span className="self-start text-xs font-bold uppercase tracking-wide text-gold-dark">
                    {dictionary.property.selected}
                  </span>
                ) : null}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
