"use client";

import { useRef, useState } from "react";
import { uploadDocuments } from "@/lib/applications/upload-client";
import type { ResolvedDocumentItem } from "@/lib/applications/document-catalog";
import type { Dictionary } from "@/i18n";
import { interpolate } from "@/i18n";

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

export function DocumentRequestForm({
  applicationId,
  uploadTicket,
  items,
  alreadyUploaded,
  dictionary,
}: {
  applicationId: string;
  uploadTicket: string;
  items: ResolvedDocumentItem[];
  alreadyUploaded: string[];
  dictionary: Dictionary;
}) {
  const t = dictionary.docs;

  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [percent, setPercent] = useState<number | null>(null);
  const [done, setDone] = useState<{ uploaded: number; failed: number } | null>(
    null,
  );
  const [expired, setExpired] = useState(false);

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
    if (accepted.length > 0) setFiles((current) => [...current, ...accepted]);
  }

  async function send() {
    if (files.length === 0) return;

    setPercent(0);
    setExpired(false);

    const outcome = await uploadDocuments(
      files,
      applicationId,
      uploadTicket,
      (progress) => setPercent(progress.percent),
    );

    setPercent(null);

    // El permiso de subida dura media hora. Si alguien deja la pagina abierta
    // mientras busca sus papeles, hay que decirle que recargue en lugar de
    // dejarle pensar que ha subido algo.
    if (outcome.failed.some((f) => f.reason.includes("permiso-caducado"))) {
      setExpired(true);
      return;
    }

    setDone({ uploaded: outcome.uploaded, failed: outcome.failed.length });
    setFiles([]);
  }

  if (done) {
    return (
      <div className="surface p-7 text-center sm:p-10">
        <p className="text-3xl" aria-hidden="true">
          ✓
        </p>
        <h2 className="heading-lg mt-3">{t.successTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">{t.successBody}</p>
        {done.failed > 0 ? (
          <p className="mt-4 rounded-md bg-gold-wash px-4 py-3 text-sm text-ink">
            {interpolate(t.successPartial, { count: done.failed })}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setRejected([]);
          }}
          className="btn-secondary mt-6"
        >
          {t.uploadMore}
        </button>
      </div>
    );
  }

  const hayResumen = items.length > 0 || alreadyUploaded.length > 0;

  return (
    <div className="space-y-6">
      {hayResumen ? (
        <section className="surface p-5 sm:p-6">
          {items.length > 0 ? (
            <>
              <h2 className="font-serif text-xl text-ink-strong">{t.weNeed}</h2>

              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3">
                    <span aria-hidden="true" className="mt-0.5 text-gold-dark">
                      ·
                    </span>
                    <p className="text-sm text-ink-strong">
                      {item.label}
                      {item.spanishName ? (
                        <span className="text-ink-muted">
                          {" "}
                          ({t.spanishNameLabel} {item.spanishName})
                        </span>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Buena parte de los interesados de Artiko viene de fuera de
                Espana y no tiene los documentos con estos nombres. Decirselo
                aqui evita que abandonen pensando que no pueden aportar lo que
                se les pide. */}
              <p className="mt-5 rounded-md bg-gold-wash px-4 py-3 text-sm leading-relaxed text-ink">
                {t.abroadNote}
              </p>
            </>
          ) : null}

          {alreadyUploaded.length > 0 ? (
            <div
              className={`rounded-md bg-cream p-4 ${items.length > 0 ? "mt-4" : ""}`}
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {t.alreadySent}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {alreadyUploaded.map((name) => (
                  <li key={name} className="text-sm text-ink-strong">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="surface p-5 sm:p-6">
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
              {t.addFiles}
            </span>
            <span className="mt-1 block text-sm text-ink-muted">
              {t.dropHint}
            </span>
            <span className="mt-2 block text-xs text-ink-faint">
              {t.accepted}
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
          <ul className="mt-4 space-y-1.5" role="alert">
            {rejected.map((message) => (
              <li key={message} className="field-error">
                <span aria-hidden="true">⚠</span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {files.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-md border border-line px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-ink-muted">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="shrink-0 text-xs text-ink-muted underline-offset-2 hover:text-danger hover:underline"
                >
                  {t.remove}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {percent !== null ? (
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-ink">{t.sending}</p>
              <p className="font-serif text-lg text-gold-dark">{percent}%</p>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-gold transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : null}

        {expired ? (
          <p className="field-error mt-4" role="alert">
            <span aria-hidden="true">⚠</span>
            <span>{t.sessionExpired}</span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={send}
          disabled={files.length === 0 || percent !== null}
          className="btn-gold mt-6 w-full"
        >
          {percent !== null ? t.sending : t.send}
        </button>
      </section>
    </div>
  );
}
