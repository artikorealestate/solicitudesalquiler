"use client";

import { useState } from "react";
import { deleteApplication } from "@/lib/applications/actions";

/// Borrado de una solicitud, con confirmacion en dos pasos.
///
/// Un solo boton en una barra lateral se pulsa sin querer, y esto no tiene
/// deshacer en la base de datos. El segundo paso obliga a leer lo que se va a
/// perder antes de confirmar.
export function DeleteApplication({
  applicationId,
  applicantName,
  documentCount,
}: {
  applicationId: string;
  applicantName: string;
  documentCount: number;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">Eliminar</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          Borra la solicitud y su documentación. Sirve también cuando alguien
          pide que eliminemos sus datos.
        </p>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 w-full rounded-md border border-line py-2.5 text-sm font-bold text-ink-muted transition-colors hover:border-danger hover:text-danger"
        >
          Eliminar solicitud
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-card border border-danger/30 bg-danger/5 p-5">
      <h2 className="font-serif text-lg text-danger">
        ¿Eliminar esta solicitud?
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-ink">
        Se borrará todo lo de <strong>{applicantName}</strong>:
      </p>

      <ul className="mt-2 space-y-1 text-sm text-ink">
        <li>· Sus datos y respuestas</li>
        <li>
          ·{" "}
          {documentCount === 0
            ? "No hay documentos"
            : `${documentCount} documento${documentCount === 1 ? "" : "s"}`}
        </li>
        <li>· Los consentimientos que aceptó</li>
        <li>· Las notas internas</li>
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Su carpeta de Drive irá a la papelera, donde Drive la conserva 30 días
        por si te arrepientes. Lo del panel no se puede recuperar.
      </p>

      <form
        action={deleteApplication.bind(null, applicationId)}
        className="mt-4"
      >
        <button
          type="submit"
          className="w-full rounded-md bg-danger py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Sí, eliminar definitivamente
        </button>
      </form>

      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="mt-2 w-full py-1.5 text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        Cancelar
      </button>
    </section>
  );
}
