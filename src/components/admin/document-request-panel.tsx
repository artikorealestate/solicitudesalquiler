"use client";

import { useState } from "react";
import {
  MAX_PEOPLE_PER_REQUEST,
  availableItemsByProfile,
  defaultItemsByProfile,
  profileHints,
  profileLabels,
  roleLabels,
  spanishOfficialName,
  type ApplicantProfile,
  type DocumentKey,
  type PersonRole,
} from "@/lib/applications/document-catalog";
// El panel va en espanol: los nombres salen del diccionario castellano.
import { es } from "@/i18n/dictionaries/es";
import {
  cancelDocumentRequest,
  createDocumentRequest,
} from "@/lib/applications/document-request-actions";

const itemLabels = es.docs.items as Record<string, string>;

function labelFor(key: string): string {
  const label = itemLabels[key] ?? key;
  const spanish = spanishOfficialName[key as DocumentKey];
  return spanish ? `${label} (${spanish})` : label;
}

export type ActivePerson = {
  name: string | null;
  role: PersonRole;
  profile: ApplicantProfile;
  items: string[];
};

export type ActiveRequest = {
  id: string;
  people: ActivePerson[];
  token: string;
  createdAt: Date;
  expiresAt: Date;
};

type DraftPerson = {
  name: string;
  role: PersonRole;
  profile: ApplicantProfile;
  items: string[];
};

function newPerson(
  name: string,
  profile: ApplicantProfile,
  role: PersonRole = "TENANT",
): DraftPerson {
  return { name, role, profile, items: [...defaultItemsByProfile[profile]] };
}

function PersonEditor({
  index,
  person,
  onChange,
  onRemove,
}: {
  index: number;
  person: DraftPerson;
  onChange: (next: DraftPerson) => void;
  onRemove: (() => void) | null;
}) {
  function toggle(key: string) {
    onChange({
      ...person,
      items: person.items.includes(key)
        ? person.items.filter((item) => item !== key)
        : [...person.items, key],
    });
  }

  const hint = profileHints[person.profile];

  return (
    <fieldset className="space-y-3 rounded-md border border-line p-3">
      <div className="flex items-center justify-between">
        <legend className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          Persona {index + 1}
        </legend>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-ink-muted underline-offset-4 hover:text-danger hover:underline"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <input
        value={person.name}
        onChange={(event) => onChange({ ...person, name: event.target.value })}
        placeholder="Nombre y apellidos"
        aria-label={`Nombre de la persona ${index + 1}`}
        className="field-input"
      />

      <div className="flex gap-2">
        <select
          value={person.role}
          onChange={(event) =>
            onChange({ ...person, role: event.target.value as PersonRole })
          }
          aria-label="Papel en el contrato"
          className="field-input w-32 shrink-0"
        >
          {Object.entries(roleLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={person.profile}
          onChange={(event) => {
            // Al cambiar de perfil se recalcula la seleccion: los documentos
            // de un autonomo no le sirven de nada a un asalariado.
            const profile = event.target.value as ApplicantProfile;
            onChange({
              ...person,
              profile,
              items: [...defaultItemsByProfile[profile]],
            });
          }}
          aria-label="Perfil"
          className="field-input min-w-0 flex-1"
        >
          {Object.entries(profileLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {hint ? (
        <p className="rounded-md bg-gold-wash px-3 py-2 text-xs leading-relaxed text-ink">
          {hint}
        </p>
      ) : null}

      <div className="space-y-1.5">
        {availableItemsByProfile[person.profile].map((key) => (
          <label
            key={key}
            className="flex cursor-pointer gap-2.5 rounded-md border border-line px-3 py-2 hover:border-gold"
          >
            <input
              type="checkbox"
              checked={person.items.includes(key)}
              onChange={() => toggle(key)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#CAB269]"
            />
            <span className="text-sm text-ink">{labelFor(key)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DocumentRequestPanel({
  applicationId,
  applicantName,
  suggestedProfile,
  householdSize,
  active,
  appUrl,
}: {
  applicationId: string;
  applicantName: string;
  suggestedProfile: ApplicantProfile;
  /// Lo que contesto en el formulario, para recordar que cada firmante
  /// aporta lo suyo.
  householdSize: string | null;
  active: ActiveRequest | null;
  appUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState<DraftPerson[]>([
    newPerson(applicantName, suggestedProfile),
  ]);
  const [copied, setCopied] = useState(false);

  if (active) {
    const link = `${appUrl}/documentos/${active.token}`;

    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">
          Documentación pedida
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Enviada el {active.createdAt.toLocaleDateString("es-ES")} · caduca el{" "}
          {active.expiresAt.toLocaleDateString("es-ES")}
        </p>

        {active.people.map((person, index) => (
          <div key={index} className="mt-3">
            <p className="text-sm font-bold text-ink-strong">
              {person.name ?? "Documentos"}
              <span className="font-normal text-ink-muted">
                {" "}
                · {roleLabels[person.role]} ·{" "}
                {profileLabels[person.profile] ?? person.profile}
              </span>
            </p>
            <ul className="mt-1 space-y-1">
              {person.items.map((key) => (
                <li key={key} className="text-sm text-ink">
                  · {labelFor(key)}
                </li>
              ))}
            </ul>
          </div>
        ))}

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

  const ready = people.every(
    (person) => person.name.trim() && person.items.length > 0,
  );

  return (
    <section className="surface p-5">
      <h2 className="font-serif text-lg text-ink-strong">
        Pedir documentación
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
        Cada persona que firme el contrato, y el avalista si lo hay, aporta su
        propia documentación según su situación.
        {householdSize
          ? ` En el formulario dijo que vivirían ${householdSize}.`
          : ""}
      </p>

      <form
        action={createDocumentRequest.bind(null, applicationId)}
        className="mt-4 space-y-4"
      >
        <input type="hidden" name="people" value={JSON.stringify(people)} />

        {people.map((person, index) => (
          <PersonEditor
            key={index}
            index={index}
            person={person}
            onChange={(next) =>
              setPeople(people.map((p, i) => (i === index ? next : p)))
            }
            onRemove={
              people.length > 1
                ? () => setPeople(people.filter((_, i) => i !== index))
                : null
            }
          />
        ))}

        {people.length < MAX_PEOPLE_PER_REQUEST ? (
          <button
            type="button"
            onClick={() => setPeople([...people, newPerson("", "SALARIED")])}
            className="btn-secondary w-full py-2 text-sm"
          >
            + Añadir otra persona o avalista
          </button>
        ) : null}

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
            disabled={!ready}
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
        {!ready ? (
          <p className="text-xs text-ink-muted">
            Falta el nombre de alguna persona o no tiene ningún documento
            marcado.
          </p>
        ) : null}
      </form>
    </section>
  );
}
