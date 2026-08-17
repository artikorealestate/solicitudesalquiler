"use client";

import { useId } from "react";

/// Campos del formulario publico.
///
/// Dos reglas que se respetan en todos ellos:
///   - Cada campo tiene su <label> de verdad, no solo un texto de ejemplo
///     dentro del recuadro: el placeholder desaparece al escribir y deja a la
///     persona sin saber que estaba rellenando.
///   - Los errores se marcan con icono y texto ademas de con color, porque
///     quien no distingue el rojo no veria el borde rojo.

function ErrorText({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="field-error" role="alert">
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </p>
  );
}

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  required?: boolean;
};

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  inputMode,
  autoComplete,
  required = false,
  optionalLabel
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {!required && optionalLabel ? (
          <span className="ml-1.5 font-normal text-ink-muted">
            ({optionalLabel})
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
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
      {error ? <ErrorText id={errorId} message={error} /> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  rows = 3,
  required = false,
  optionalLabel
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {!required && optionalLabel ? (
          <span className="ml-1.5 font-normal text-ink-muted">
            ({optionalLabel})
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`field-input resize-y ${error ? "field-input-invalid" : ""}`}
      />
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <ErrorText id={errorId} message={error} /> : null}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  hint,
  required = false,
  optionalLabel
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  placeholder: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {!required && optionalLabel ? (
          <span className="ml-1.5 font-normal text-ink-muted">
            ({optionalLabel})
          </span>
        ) : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`field-input ${error ? "field-input-invalid" : ""} ${
          value === "" ? "text-ink-faint" : ""
        }`}
      >
        <option value="">{placeholder}</option>
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key} className="text-ink">
            {text}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <ErrorText id={errorId} message={error} /> : null}
    </div>
  );
}

/// Sí / No como dos botones grandes. En movil es mucho mas comodo que un
/// desplegable de dos opciones, que obliga a abrir y elegir.
export function YesNoField({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
  error,
  hint
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  yesLabel: string;
  noLabel: string;
}) {
  const name = useId();

  return (
    <fieldset>
      <legend className="field-label">{label}</legend>
      <div className="flex gap-2.5">
        {[
          { key: "yes", text: yesLabel },
          { key: "no", text: noLabel }
        ].map((option) => (
          <label
            key={option.key}
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border px-4 py-2.5 text-sm transition-colors ${
              value === option.key
                ? "border-gold bg-gold-wash font-bold text-ink-strong"
                : "border-line bg-white text-ink hover:border-gold"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.key}
              checked={value === option.key}
              onChange={() => onChange(option.key)}
              className="sr-only"
            />
            {option.text}
          </label>
        ))}
      </div>
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <ErrorText id={`${name}-error`} message={error} /> : null}
    </fieldset>
  );
}

export function CheckboxField({
  checked,
  onChange,
  children,
  error
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors ${
          error ? "border-danger bg-danger/5" : "border-line bg-white hover:border-gold"
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#CAB269]"
        />
        <span className="text-sm leading-relaxed text-ink">{children}</span>
      </label>
      {error ? <ErrorText id={errorId} message={error} /> : null}
    </div>
  );
}
