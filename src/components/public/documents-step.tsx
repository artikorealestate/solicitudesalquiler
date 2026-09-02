"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { interpolate } from "@/i18n";
import type { Operation } from "@/lib/applications/types";

/// Tope por archivo. Los documentos no pasan por nuestro servidor —van
/// directos a Drive— pero un limite razonable evita subidas accidentales de
/// videos o carpetas comprimidas enteras.
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ACCEPTED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/webp",
];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsStep({
  dictionary,
  operation,
  seasonal,
  files,
  onChange,
}: {
  dictionary: Dictionary;
  operation: Operation;
  /// Estancia de temporada: no se le piden nominas ni vida laboral.
  seasonal: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<string[]>([]);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;

    const problems: string[] = [];
    const accepted: File[] = [];

    for (const file of Array.from(incoming)) {
      if (file.size > MAX_FILE_BYTES) {
        problems.push(
          interpolate(dictionary.documents.tooLarge, { name: file.name }),
        );
      } else if (file.type && !ACCEPTED.includes(file.type)) {
        problems.push(
          interpolate(dictionary.documents.wrongType, { name: file.name }),
        );
      } else {
        accepted.push(file);
      }
    }

    setRejected(problems);
    if (accepted.length > 0) onChange([...files, ...accepted]);
  }

  return (
    <div className="space-y-5">
      {operation === "RENT" ? (
        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-sm font-bold text-ink-strong">
            {dictionary.documents.suggestionsRent}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {(seasonal
              ? dictionary.documents.suggestionsSeasonList
              : dictionary.documents.suggestionsRentList
            ).map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-gold-dark">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-card border-2 border-dashed border-line bg-white px-4 py-8 text-center transition-colors hover:border-gold"
        >
          <span className="block font-bold text-ink-strong">
            {dictionary.documents.addFiles}
          </span>
          <span className="mt-1 block text-sm text-ink-muted">
            {dictionary.documents.dropHint}
          </span>
          <span className="mt-2 block text-xs text-ink-faint">
            {dictionary.documents.accepted}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
          className="sr-only"
        />
      </div>

      {rejected.length > 0 ? (
        <ul className="space-y-1.5" role="alert">
          {rejected.map((message) => (
            <li key={message} className="field-error">
              <span aria-hidden="true">⚠</span>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border border-line bg-white px-4 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-ink">
                {file.name}
              </span>
              <span className="shrink-0 text-xs text-ink-muted">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                className="shrink-0 text-xs text-ink-muted underline-offset-2 hover:text-danger hover:underline"
              >
                {dictionary.documents.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
