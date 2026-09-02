"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { parseIdealistaText } from "@/lib/idealista/parse";
import { saveProperty, type FormState } from "@/lib/properties/actions";
import { operationLabels, statusLabels } from "@/lib/properties/schema";

type PropertyFields = {
  reference: string;
  title: string;
  operationType: string;
  zone: string;
  address: string;
  rentPrice: string;
  salePrice: string;
  idealistaUrl: string;
  mainImageUrl: string;
  status: string;
  internalNotes: string;
};

const emptyFields: PropertyFields = {
  reference: "",
  title: "",
  operationType: "RENT",
  zone: "",
  address: "",
  rentPrice: "",
  salePrice: "",
  idealistaUrl: "",
  mainImageUrl: "",
  status: "ACTIVE",
  internalNotes: "",
};

export function PropertyForm({
  propertyId = null,
  initial,
}: {
  propertyId?: string | null;
  initial?: Partial<PropertyFields>;
}) {
  const [fields, setFields] = useState<PropertyFields>({
    ...emptyFields,
    ...initial,
  });
  const [pasted, setPasted] = useState("");
  const [filledNotice, setFilledNotice] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveProperty.bind(null, propertyId),
    {},
  );

  const set = (key: keyof PropertyFields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  function applyPastedListing() {
    const parsed = parseIdealistaText(pasted);
    const filled: string[] = [];

    setFields((current) => {
      const next = { ...current };

      if (parsed.reference) {
        next.reference = parsed.reference;
        filled.push("referencia");
      }
      if (parsed.title) {
        next.title = parsed.title;
        filled.push("titulo");
      }
      if (parsed.zone) {
        next.zone = parsed.zone;
        filled.push("zona");
      }
      if (parsed.address) {
        next.address = parsed.address;
        filled.push("direccion");
      }
      if (parsed.rentPrice !== undefined) {
        next.rentPrice = String(parsed.rentPrice);
        next.operationType = "RENT";
        filled.push("precio de alquiler");
      }
      if (parsed.salePrice !== undefined) {
        next.salePrice = String(parsed.salePrice);
        next.operationType = "SALE";
        filled.push("precio de venta");
      }
      if (parsed.idealistaUrl) {
        next.idealistaUrl = parsed.idealistaUrl;
        filled.push("enlace de Idealista");
      }

      return next;
    });

    setFilledNotice(
      filled.length > 0
        ? `Rellenado: ${filled.join(", ")}. Revisa que sea correcto antes de guardar.`
        : "No he reconocido ningun dato. Asegurate de haber copiado el texto de la " +
            "pagina del anuncio, incluyendo el titulo y el precio de arriba. " +
            "Tambien puedes rellenar los campos a mano.",
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-8">
      {/* --- Pegado desde Idealista --- */}
      <section className="surface p-5 sm:p-6">
        <h2 className="font-serif text-xl text-ink-strong">
          Rellenar desde Idealista
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          Abre tu anuncio en Idealista, selecciona todo el texto (Ctrl+A),
          copialo (Ctrl+C) y pegalo aqui. Sirve tanto la ficha de un anuncio
          como el listado. Rellenare los campos que reconozca.
        </p>
        <p className="mt-1.5 text-xs text-ink-muted">
          Para traer muchos inmuebles de una vez es mas comodo{" "}
          <a
            href="/admin/inmuebles/sincronizar"
            className="text-gold-dark underline-offset-4 hover:underline"
          >
            sincronizar con Idealista
          </a>
          .
        </p>

        <textarea
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          rows={4}
          placeholder="Pega aqui el texto del anuncio…"
          className="field-input mt-3 resize-y font-mono text-xs"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={applyPastedListing}
            disabled={!pasted.trim()}
            className="btn-secondary py-2 text-sm"
          >
            Rellenar campos
          </button>
          {filledNotice ? (
            <p className="text-sm text-ink-muted">{filledNotice}</p>
          ) : null}
        </div>
      </section>

      {/* --- Datos del inmueble --- */}
      <section className="surface space-y-5 p-5 sm:p-6">
        <h2 className="font-serif text-xl text-ink-strong">
          Datos del inmueble
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="reference"
            label="Referencia interna"
            required
            hint="Identifica la carpeta del inmueble en Google Drive"
            value={fields.reference}
            onChange={set("reference")}
            error={state.errors?.reference}
          />
          <Select
            name="operationType"
            label="Tipo de operacion"
            value={fields.operationType}
            onChange={set("operationType")}
            options={operationLabels}
            error={state.errors?.operationType}
          />
        </div>

        <Field
          name="title"
          label="Titulo"
          required
          value={fields.title}
          onChange={set("title")}
          error={state.errors?.title}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="zone"
            label="Zona"
            value={fields.zone}
            onChange={set("zone")}
            error={state.errors?.zone}
          />
          <Field
            name="address"
            label="Calle o direccion aproximada"
            value={fields.address}
            onChange={set("address")}
            error={state.errors?.address}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="rentPrice"
            label="Precio de alquiler (€/mes)"
            inputMode="numeric"
            value={fields.rentPrice}
            onChange={set("rentPrice")}
            error={state.errors?.rentPrice}
          />
          <Field
            name="salePrice"
            label="Precio de venta (€)"
            inputMode="numeric"
            value={fields.salePrice}
            onChange={set("salePrice")}
            error={state.errors?.salePrice}
          />
        </div>

        <Field
          name="idealistaUrl"
          label="Enlace de Idealista"
          type="url"
          value={fields.idealistaUrl}
          onChange={set("idealistaUrl")}
          error={state.errors?.idealistaUrl}
        />

        <Field
          name="mainImageUrl"
          label="Imagen principal (direccion web)"
          type="url"
          hint="Se muestra al interesado al elegir el inmueble"
          value={fields.mainImageUrl}
          onChange={set("mainImageUrl")}
          error={state.errors?.mainImageUrl}
        />
      </section>

      {/* --- Gestion interna --- */}
      <section className="surface space-y-5 p-5 sm:p-6">
        <h2 className="font-serif text-xl text-ink-strong">Gestion interna</h2>

        <Select
          name="status"
          label="Estado"
          value={fields.status}
          onChange={set("status")}
          options={statusLabels}
          hint="Solo los inmuebles activos aparecen en el formulario publico"
          error={state.errors?.status}
        />

        <div>
          <label htmlFor="internalNotes" className="field-label">
            Notas internas
          </label>
          <textarea
            id="internalNotes"
            name="internalNotes"
            rows={3}
            value={fields.internalNotes}
            onChange={(event) => set("internalNotes")(event.target.value)}
            className="field-input resize-y"
          />
          <p className="mt-1.5 text-xs text-ink-muted">
            No se muestran al interesado.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando…" : "Guardar inmueble"}
        </button>
        <Link href="/admin/inmuebles" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  type = "text",
  inputMode,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  inputMode?: "numeric" | "text";
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {required ? <span className="ml-1 text-gold-dark">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`field-input ${error ? "field-input-invalid" : ""}`}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function Select({
  name,
  label,
  value,
  onChange,
  options,
  error,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`field-input ${error ? "field-input-invalid" : ""}`}
      >
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
      {error ? (
        <p className="field-error">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
