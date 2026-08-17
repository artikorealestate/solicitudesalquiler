"use client";

import { useState } from "react";
import {
  availableItemsByProfile,
  defaultItemsByProfile,
  profileLabels,
  spanishOfficialName,
  type ApplicantProfile,
  type DocumentKey
} from "@/lib/applications/document-catalog";
// El panel va en espanol: los nombres salen del diccionario castellano.
import { es } from "@/i18n/dictionaries/es";

const itemLabels = es.docs.items as Record<string, string>;

function labelFor(key: string): string {
  const label = itemLabels[key] ?? key;
  const spanish = spanishOfficialName[key as DocumentKey];
  return spanish ? `${label} (${spanish})` : label;
}
import {
  cancelDocumentRequest,
  createDocumentRequest
} from "@/lib/applications/document-request-actions";

export type ActiveRequest = {
  id: string;
  profile: string;
  requestedItems: string[];
  token: string;
  createdAt: Date;
  expiresAt: Date;
};

export function DocumentRequestPanel({
  applicationId,
  suggestedProfile,
  active,
  appUrl
}: {
  applicationId: string;
  suggestedProfile: ApplicantProfile;
  active: ActiveRequest | null;
  appUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ApplicantProfile>(suggestedProfile);
  const [selected, setSelected] = useState<string[]>([
    ...defaultItemsByProfile[suggestedProfile]
  ]);
  const [copied, setCopied] = useState(false);

  function changeProfile(next: ApplicantProfile) {
    setProfile(next);
    // Al cambiar de perfil se recalcula la seleccion: los documentos de un
    // autonomo no le sirven de nada a un asalariado.
    setSelected(defaultItemsByProfile[next]);
  }

  function toggle(key: string) {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  }

  if (active) {
    const link = `${appUrl}/documentos/${active.token}`;

    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">
          Documentación pedida
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Perfil: {profileLabels[active.profile as ApplicantProfile]} ·
          enviada el {active.createdAt.toLocaleDateString("es-ES")} · caduca el{" "}
          {active.expiresAt.toLocaleDateString("es-ES")}
        </p>

        <ul className="mt-3 space-y-1">
          {active.requestedItems.map((key) => (
            <li key={key} className="text-sm text-ink">
              · {labelFor(key)}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="btn-secondary mt-4 w-full py-2 text-sm"
        >
          {copied ? "Enlace copiado" : "Copiar enlace para WhatsApp"}
        </button>

        <form
          action={cancelDocumentRequest.bind(null, active.id, applicationId)}
          className="mt-2"
        >
          <button
            type="submit"
            className="w-full text-xs text-ink-muted underline-offset-4 hover:text-danger hover:underline"
          >
            Anular esta petición
          </button>
        </form>
      </section>
    );
  }

  if (!open) {
    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">Documentación</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          Pídele solo lo que corresponde a su perfil. Recibirá un enlace propio
          para subirlo a su carpeta.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary mt-4 w-full py-2.5 text-sm"
        >
          Pedir documentación
        </button>
      </section>
    );
  }

  return (
    <section className="surface p-5">
      <h2 className="font-serif text-lg text-ink-strong">Pedir documentación</h2>

      <form
        action={createDocumentRequest.bind(null, applicationId)}
        className="mt-4 space-y-4"
      >
        <div>
          <label htmlFor="profile" className="field-label">
            Perfil
          </label>
          <select
            id="profile"
            name="profile"
            value={profile}
            onChange={(event) =>
              changeProfile(event.target.value as ApplicantProfile)
            }
            className="field-input"
          >
            {Object.entries(profileLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="field-label">Documentos</legend>
          <div className="space-y-1.5">
            {availableItemsByProfile[profile].map((key) => (
              <label
                key={key}
                className="flex cursor-pointer gap-2.5 rounded-md border border-line px-3 py-2 hover:border-gold"
              >
                <input
                  type="checkbox"
                  name="items"
                  value={key}
                  checked={selected.includes(key)}
                  onChange={() => toggle(key)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#CAB269]"
                />
                <span className="text-sm text-ink">{labelFor(key)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="message" className="field-label">
            Mensaje para el candidato
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Opcional. Se incluye en el correo."
            className="field-input resize-y"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={selected.length === 0}
            className="btn-primary flex-1 py-2.5 text-sm"
          >
            Enviar petición
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-secondary py-2.5 text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
