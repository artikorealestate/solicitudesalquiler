"use client";

import { useEffect } from "react";

/// El panel lo ve Artiko, no un cliente: aqui interesa el dato tecnico.
///
/// El digest es lo unico que permite encontrar el fallo concreto en los
/// registros de Vercel, asi que se muestra a la vista.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] Fallo en el panel:", error.digest, error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="surface p-7">
        <h1 className="heading-lg">El panel no ha podido cargar esta página</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Lo más probable es que la base de datos no esté respondiendo.
          Compruébalo abriendo{" "}
          <a
            href="/api/health"
            className="text-gold-dark underline-offset-4 hover:underline"
          >
            /api/health
          </a>
          : si contesta <span className="font-mono">ok: false</span>, el
          problema es la base de datos y no esta pantalla.
        </p>

        {error.digest ? (
          <p className="mt-4 rounded-md bg-cream px-4 py-3 font-mono text-xs text-ink">
            digest: {error.digest}
          </p>
        ) : null}

        <button type="button" onClick={reset} className="btn-gold mt-6">
          Volver a intentarlo
        </button>
      </div>
    </main>
  );
}
