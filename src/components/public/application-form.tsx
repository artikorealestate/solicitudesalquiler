"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArtikoLogo } from "@/components/brand/logo";
import {
  CheckboxField,
  TextAreaField,
  TextField
} from "@/components/public/fields";
import { DocumentsStep } from "@/components/public/documents-step";
import { PropertyPicker } from "@/components/public/property-picker";
import { RentQuestions, SaleQuestions } from "@/components/public/question-steps";
import { SiteFooter } from "@/components/public/site-footer";
import type { Dictionary } from "@/i18n";
import { interpolate } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { submitApplication } from "@/lib/applications/submit";
import { uploadDocuments } from "@/lib/applications/upload-client";
import {
  emptyDraft,
  type ApplicationDraft,
  type Operation,
  type PublicProperty
} from "@/lib/applications/types";

type StepId =
  | "operation"
  | "property"
  | "personal"
  | "questions"
  | "documents"
  | "consent"
  | "review";

const STEP_ORDER: StepId[] = [
  "operation",
  "property",
  "personal",
  "questions",
  "documents",
  "consent",
  "review"
];

function storageKey(locale: Locale) {
  return `artiko-solicitud-${locale}`;
}

export function ApplicationForm({
  dictionary,
  locale,
  properties
}: {
  dictionary: Dictionary;
  locale: Locale;
  properties: PublicProperty[];
}) {
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);
  const [files, setFiles] = useState<File[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // --- Defensas antirrobot, invisibles para una persona -------------------
  // El campo trampa vive en el estado del formulario pero se dibuja oculto:
  // nadie lo ve, así que solo lo rellena un programa que completa todo lo que
  // encuentra. El instante de carga sirve para medir cuánto se ha tardado.
  const [honeypot, setHoneypot] = useState("");

  // Se fija al montar, no al crear la referencia: Date.now() durante el
  // renderizado en servidor daria una hora distinta de la del navegador, y
  // ese tipo de discrepancias es lo que provoca los avisos de hidratacion.
  const startedAtRef = useRef<number>(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [sentTo, setSentTo] = useState<{
    email: string;
    property: string;
    notice: string | null;
  } | null>(null);

  const step = STEP_ORDER[stepIndex];
  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === draft.propertyId),
    [properties, draft.propertyId]
  );

  // --- Persistencia local -------------------------------------------------
  // Rellenar esto lleva varios minutos. Si alguien cierra la pestana sin
  // querer o se le va la conexion, no puede perder todo lo escrito.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey(locale));
      if (saved) setDraft({ ...emptyDraft, ...JSON.parse(saved) });
    } catch {
      // Un borrador corrupto no debe impedir usar el formulario.
    }
    setRestored(true);
  }, [locale]);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(storageKey(locale), JSON.stringify(draft));
    } catch {
      // Modo incognito o almacenamiento lleno: seguimos sin guardar.
    }
  }, [draft, locale, restored]);

  // --- Actualizacion ------------------------------------------------------

  function update<K extends keyof ApplicationDraft>(
    key: K,
    value: ApplicationDraft[K]
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }

  function setAnswer(key: string, value: string) {
    setDraft((current) => ({
      ...current,
      answers: { ...current.answers, [key]: value }
    }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  // --- Validacion ---------------------------------------------------------

  function validateStep(): Record<string, string> {
    const found: Record<string, string> = {};
    const e = dictionary.errors;

    if (step === "operation" && !draft.operation) {
      found.operation = e.selectOperation;
    }

    if (step === "property" && !draft.propertyId) {
      found.propertyId = e.selectProperty;
    }

    if (step === "personal") {
      if (!draft.firstName.trim()) found.firstName = e.required;
      if (!draft.lastName.trim()) found.lastName = e.required;
      if (!draft.email.trim()) found.email = e.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) {
        found.email = e.invalidEmail;
      }
      if (!draft.phone.trim()) found.phone = e.required;
      else if (draft.phone.replace(/\D/g, "").length < 6) {
        found.phone = e.invalidPhone;
      }
      // Nacionalidad y documento de identidad son obligatorios: hacen falta
      // para preparar el contrato y para el estudio de solvencia, y pedirlos
      // despues obliga a perseguir al interesado por telefono.
      if (!draft.nationality.trim()) found.nationality = e.required;
      if (!draft.idDocument.trim()) found.idDocument = e.required;
    }

    if (step === "questions") {
      const required =
        draft.operation === "RENT"
          ? [
              "householdSize",
              "relationship",
              "moveInDate",
              "occupation",
              "employmentType",
              "provableIncome",
              "monthlyIncome",
              "pets",
              "searchDuration",
              "visitedOthers",
              "documentsReady"
            ]
          : [
              "buyerProfile",
              "searchDuration",
              "propertiesVisited",
              "madeOffer",
              "needToSell",
              "needsFinancing",
              "firstPurchase",
              "occupation"
            ];

      for (const key of required) {
        if (!draft.answers[key]?.trim()) found[key] = e.required;
      }

      if (
        draft.answers.monthlyIncome &&
        !/^\d[\d.\s]*$/.test(draft.answers.monthlyIncome)
      ) {
        found.monthlyIncome = e.invalidNumber;
      }
    }

    if (step === "consent") {
      if (!draft.consentGdpr) found.consentGdpr = dictionary.consent.requiredError;
      if (!draft.consentOwner) found.consentOwner = dictionary.consent.requiredError;
    }

    return found;
  }

  function goNext() {
    const found = validateStep();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Llevamos el foco al primer error para que en movil no quede fuera de
      // pantalla sin que la persona sepa por que no avanza.
      document
        .querySelector('[aria-invalid="true"], [role="alert"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStepIndex((current) => Math.min(current + 1, STEP_ORDER.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStepIndex((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitApplication({
        locale,
        operation: draft.operation,
        propertyId: draft.propertyId,
        firstName: draft.firstName,
        lastName: draft.lastName,
        email: draft.email,
        phone: draft.phone,
        nationality: draft.nationality || undefined,
        idDocument: draft.idDocument || undefined,
        comment: draft.comment || undefined,
        answers: draft.answers,
        consentGdpr: draft.consentGdpr,
        consentOwner: draft.consentOwner,
        declaredDocumentCount: files.length,
        website: honeypot,
        // Un cero significa que el navegador no llego a ejecutar el efecto;
        // se envia sin marca en lugar de una que pareceria manipulada.
        startedAt: startedAtRef.current || undefined
      });

      if (!result.ok) {
        setSubmitError(
          result.error === "demasiados-envios"
            ? dictionary.errors.tooManySubmissions
            : dictionary.errors.submitFailed
        );
        return;
      }

      // La solicitud ya esta guardada. Los documentos se suben despues, y si
      // fallan NO se pierde la solicitud: se avisa y Artiko los pedira luego.
      let notice: string | null = null;

      if (files.length > 0) {
        if (!result.canUploadDocuments) {
          notice = dictionary.documents.uploadUnavailable;
        } else {
          const outcome = await uploadDocuments(
            files,
            result.applicationId,
            result.uploadTicket,
            (progress) => {
              setUploadPercent(progress.percent);
              setUploadStatus(
                interpolate(dictionary.documents.uploading, {
                  current: Math.min(progress.filesDone + 1, progress.totalFiles),
                  total: progress.totalFiles
                })
              );
            }
          );

          if (outcome.failed.length > 0) {
            notice = interpolate(dictionary.documents.uploadPartial, {
              count: outcome.failed.length
            });
          }
        }
      }

      setUploadStatus(null);
      setUploadPercent(null);

      // Enviada: el borrador ya no hace falta y no conviene dejar datos
      // personales en el navegador de una persona que quiza use un equipo
      // compartido.
      window.localStorage.removeItem(storageKey(locale));
      setSentTo({
        email: draft.email,
        property: selectedProperty?.title ?? "",
        notice
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(dictionary.errors.submitFailed);
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <div className="mx-auto max-w-form px-4 py-12">
        <div className="flex justify-center">
          <ArtikoLogo height={44} />
        </div>
        <div className="surface mt-8 p-7 text-center sm:p-10">
          <p className="text-3xl" aria-hidden="true">
            ✓
          </p>
          <h1 className="heading-lg mt-3">{dictionary.success.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink">
            {interpolate(dictionary.success.body, {
              property: sentTo.property
            })}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {interpolate(dictionary.success.emailSent, { email: sentTo.email })}
          </p>
          {sentTo.notice ? (
            <p className="mt-5 rounded-md bg-gold-wash px-4 py-3 text-sm leading-relaxed text-ink">
              {sentTo.notice}
            </p>
          ) : null}
          <p className="mt-7 font-serif text-lg text-gold-dark">
            {dictionary.success.signature}
          </p>
        </div>
        <SiteFooter dictionary={dictionary} />
      </div>
    );
  }

  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="mx-auto max-w-form px-4 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <ArtikoLogo height={36} />
        <Link
          href="/"
          className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {dictionary.common.changeLanguage}
        </Link>
      </header>

      {/* Progreso: siempre visible, para que se sepa cuanto queda. */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">{dictionary.steps[step]}</p>
          <p className="text-xs text-ink-muted">
            {interpolate(dictionary.common.stepOf, {
              current: stepIndex + 1,
              total: STEP_ORDER.length
            })}
          </p>
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEP_ORDER.length}
        >
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="surface mt-6 p-5 sm:p-8">
        {step === "operation" ? (
          <StepShell
            title={dictionary.operation.title}
            subtitle={dictionary.operation.subtitle}
          >
            <div className="space-y-3">
              {(
                [
                  ["RENT", dictionary.operation.rent],
                  ["SALE", dictionary.operation.sale]
                ] as const
              ).map(([key, option]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer flex-col rounded-card border p-4 transition-colors ${
                    draft.operation === key
                      ? "border-gold bg-gold-wash"
                      : "border-line bg-white hover:border-gold"
                  }`}
                >
                  <input
                    type="radio"
                    name="operation"
                    checked={draft.operation === key}
                    onChange={() => {
                      update("operation", key as Operation);
                      // Cambiar de operacion invalida el inmueble elegido.
                      update("propertyId", "");
                    }}
                    className="sr-only"
                  />
                  <span className="font-serif text-xl text-ink-strong">
                    {option.label}
                  </span>
                  <span className="mt-1 text-sm text-ink-muted">
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
            {errors.operation ? (
              <p className="field-error mt-3" role="alert">
                <span aria-hidden="true">⚠</span>
                <span>{errors.operation}</span>
              </p>
            ) : null}
          </StepShell>
        ) : null}

        {step === "property" ? (
          <StepShell
            title={dictionary.property.title}
            subtitle={dictionary.property.subtitle}
          >
            <PropertyPicker
              dictionary={dictionary}
              properties={properties}
              operation={(draft.operation || "RENT") as Operation}
              selectedId={draft.propertyId}
              onSelect={(id) => update("propertyId", id)}
              error={errors.propertyId}
            />
          </StepShell>
        ) : null}

        {step === "personal" ? (
          <StepShell
            title={dictionary.personal.title}
            subtitle={dictionary.personal.subtitle}
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label={dictionary.personal.firstName}
                  value={draft.firstName}
                  onChange={(value) => update("firstName", value)}
                  autoComplete="given-name"
                  error={errors.firstName}
                  required
                />
                <TextField
                  label={dictionary.personal.lastName}
                  value={draft.lastName}
                  onChange={(value) => update("lastName", value)}
                  autoComplete="family-name"
                  error={errors.lastName}
                  required
                />
              </div>
              <TextField
                label={dictionary.personal.email}
                type="email"
                inputMode="email"
                value={draft.email}
                onChange={(value) => update("email", value)}
                autoComplete="email"
                error={errors.email}
                required
              />
              <TextField
                label={dictionary.personal.phone}
                type="tel"
                inputMode="tel"
                value={draft.phone}
                onChange={(value) => update("phone", value)}
                autoComplete="tel"
                error={errors.phone}
                required
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label={dictionary.personal.nationality}
                  value={draft.nationality}
                  onChange={(value) => update("nationality", value)}
                  error={errors.nationality}
                  required
                />
                <TextField
                  label={dictionary.personal.idDocument}
                  value={draft.idDocument}
                  onChange={(value) => update("idDocument", value)}
                  hint={dictionary.personal.idDocumentHint}
                  error={errors.idDocument}
                  required
                />
              </div>
            </div>
          </StepShell>
        ) : null}

        {step === "questions" ? (
          <StepShell
            title={
              draft.operation === "SALE"
                ? dictionary.saleQuestions.title
                : dictionary.rentQuestions.title
            }
            subtitle={
              draft.operation === "SALE"
                ? dictionary.saleQuestions.subtitle
                : dictionary.rentQuestions.subtitle
            }
          >
            {draft.operation === "SALE" ? (
              <SaleQuestions
                dictionary={dictionary}
                answers={draft.answers}
                setAnswer={setAnswer}
                errors={errors}
              />
            ) : (
              <RentQuestions
                dictionary={dictionary}
                answers={draft.answers}
                setAnswer={setAnswer}
                errors={errors}
                property={selectedProperty}
              />
            )}
          </StepShell>
        ) : null}

        {step === "documents" ? (
          <StepShell
            title={dictionary.documents.title}
            subtitle={
              draft.operation === "SALE"
                ? dictionary.documents.subtitleSale
                : dictionary.documents.subtitleRent
            }
          >
            <DocumentsStep
              dictionary={dictionary}
              operation={(draft.operation || "RENT") as Operation}
              files={files}
              onChange={setFiles}
            />
          </StepShell>
        ) : null}

        {step === "consent" ? (
          <StepShell
            title={dictionary.consent.title}
            subtitle={dictionary.consent.subtitle}
          >
            <div className="space-y-4">
              <TextAreaField
                label={dictionary.comment.label}
                value={draft.comment}
                onChange={(value) => update("comment", value)}
                placeholder={dictionary.comment.placeholder}
                optionalLabel={dictionary.common.optional}
                rows={3}
              />
              <CheckboxField
                checked={draft.consentGdpr}
                onChange={(checked) => update("consentGdpr", checked)}
                error={errors.consentGdpr}
              >
                {dictionary.consent.gdprText}
              </CheckboxField>
              <CheckboxField
                checked={draft.consentOwner}
                onChange={(checked) => update("consentOwner", checked)}
                error={errors.consentOwner}
              >
                {dictionary.consent.ownerText}
              </CheckboxField>
            </div>
          </StepShell>
        ) : null}

        {step === "review" ? (
          <StepShell
            title={dictionary.review.title}
            subtitle={dictionary.review.subtitle}
          >
            <ReviewSummary
              dictionary={dictionary}
              draft={draft}
              property={selectedProperty}
              fileCount={files.length}
              onEdit={(target) => setStepIndex(STEP_ORDER.indexOf(target))}
            />

            {/* Avisar ANTES de pulsar, no solo durante: si la persona no
                espera una espera, cierra la pestaña al ver que tarda. */}
            {files.length > 0 ? (
              <p className="mt-5 rounded-md bg-gold-wash px-4 py-3 text-sm leading-relaxed text-ink">
                {dictionary.documents.uploadWait}
              </p>
            ) : null}
          </StepShell>
        ) : null}
      </div>

      {/*
        Campo trampa. Se esconde con posición absoluta fuera de la pantalla y
        no con display:none, porque algunos programas automáticos saltan los
        campos ocultos de la forma evidente. aria-hidden y tabIndex -1 lo
        mantienen fuera del alcance de un lector de pantalla y del tabulador,
        así que ninguna persona llega a él ni por accidente.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }}
      >
        <label htmlFor="website-url">No rellenes este campo</label>
        <input
          id="website-url"
          name="website-url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {/* Subir documentos por una conexion movil tarda. Una barra que se mueve
          es lo que evita que la persona crea que se ha colgado y recargue la
          pagina a medias. */}
      {uploadPercent !== null ? (
        <div className="mt-5 rounded-card border border-line bg-white p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-ink">{uploadStatus}</p>
            <p className="font-serif text-lg text-gold-dark">{uploadPercent}%</p>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={uploadPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gold transition-[width] duration-300"
              style={{ width: `${uploadPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {dictionary.documents.uploadWait}
          </p>
        </div>
      ) : null}

      {submitError ? (
        <p className="field-error mt-4" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>{submitError}</span>
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="btn-secondary"
          >
            {dictionary.common.back}
          </button>
        ) : (
          <span />
        )}

        {step === "review" ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-gold"
          >
            {submitting ? dictionary.common.sending : dictionary.common.submit}
          </button>
        ) : (
          <button type="button" onClick={goNext} className="btn-primary">
            {dictionary.common.next}
          </button>
        )}
      </div>

      <SiteFooter dictionary={dictionary} />
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="heading-lg">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ReviewSummary({
  dictionary,
  draft,
  property,
  fileCount,
  onEdit
}: {
  dictionary: Dictionary;
  draft: ApplicationDraft;
  property: PublicProperty | undefined;
  fileCount: number;
  onEdit: (step: StepId) => void;
}) {
  const rows: Array<{ step: StepId; label: string; value: string }> = [
    {
      step: "operation",
      label: dictionary.review.sectionOperation,
      value:
        draft.operation === "SALE"
          ? dictionary.operation.sale.label
          : dictionary.operation.rent.label
    },
    {
      step: "property",
      label: dictionary.review.sectionProperty,
      value: property?.title ?? "—"
    },
    {
      step: "personal",
      label: dictionary.review.sectionPersonal,
      value: [
        `${draft.firstName} ${draft.lastName}`.trim(),
        draft.email,
        draft.phone
      ]
        .filter(Boolean)
        .join(" · ")
    },
    {
      step: "documents",
      label: dictionary.review.sectionDocuments,
      value:
        fileCount > 0
          ? interpolate(dictionary.review.documentCount, { count: fileCount })
          : dictionary.review.noDocuments
    }
  ];

  return (
    <dl className="divide-y divide-line-soft">
      {rows.map((row) => (
        <div key={row.step} className="flex gap-4 py-3.5 first:pt-0">
          <div className="min-w-0 flex-1">
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {row.label}
            </dt>
            <dd className="mt-0.5 break-words text-sm text-ink-strong">
              {row.value || "—"}
            </dd>
          </div>
          <button
            type="button"
            onClick={() => onEdit(row.step)}
            className="shrink-0 self-start text-xs text-gold-dark underline-offset-4 hover:underline"
          >
            {dictionary.review.edit}
          </button>
        </div>
      ))}
    </dl>
  );
}
