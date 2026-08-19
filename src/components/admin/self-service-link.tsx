"use client";

import { useState } from "react";

/// El enlace personal del interesado, listo para copiar.
///
/// Cada solicitud lleva el suyo desde el correo de confirmacion, pero la
/// gente pierde correos. Tenerlo aqui permite reenviarlo por WhatsApp sin
/// crear una peticion formal de documentacion.
///
/// A diferencia del enlace de una peticion, este no caduca: es la puerta de
/// esa persona a su propia solicitud mientras el proceso siga vivo.
export function SelfServiceLink({ url }: { url: string | null }) {
  const [copiado, setCopiado] = useState(false);

  if (!url) {
    return (
      <section className="surface p-5">
        <h2 className="font-serif text-lg text-ink-strong">
          Enlace del interesado
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Esta solicitud es anterior al enlace personal, así que no tiene uno.
          Para pedirle documentación, usa la petición de arriba.
        </p>
      </section>
    );
  }

  return (
    <section className="surface p-5">
      <h2 className="font-serif text-lg text-ink-strong">
        Enlace del interesado
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Va en su correo de confirmación. Desde ahí puede añadir documentos a
        esta misma solicitud, sin rellenar el formulario otra vez.
      </p>

      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        }}
        className="btn-secondary mt-3 w-full py-2 text-sm"
      >
        {copiado ? "Enlace copiado" : "Copiar enlace para WhatsApp"}
      </button>
    </section>
  );
}
