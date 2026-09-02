"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArtikoLogo } from "@/components/brand/logo";

const errorMessages: Record<string, string> = {
  AccessDenied:
    "Esa cuenta de Google no tiene acceso al panel. Si crees que deberia tenerlo, pide que te añadan como administrador.",
  Configuration:
    "El acceso con Google no esta bien configurado. Avisa al responsable tecnico.",
  Default: "No hemos podido completar el acceso. Vuelve a intentarlo.",
};

function LoginCard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  return (
    <div className="surface w-full max-w-md p-8 sm:p-10">
      <ArtikoLogo height={44} />

      <p className="eyebrow mt-8">Acceso interno</p>
      <h1 className="heading-lg mt-2">Panel de gestion</h1>

      <p className="mt-4 text-sm leading-relaxed text-ink">
        Entra con la cuenta de Google autorizada para gestionar inmuebles y
        revisar las solicitudes de los interesados.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3.5 py-3 text-sm text-danger"
        >
          <span aria-hidden="true">⚠</span>
          <span>{errorMessages[error] ?? errorMessages.Default}</span>
        </p>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          void signIn("google", { callbackUrl });
        }}
        className="btn-primary mt-8 w-full"
      >
        {loading ? "Conectando…" : "Entrar con Google"}
      </button>

      <p className="mt-6 border-t border-line-soft pt-5 text-xs leading-relaxed text-ink-muted">
        Solo las cuentas autorizadas por Artiko pueden acceder. Los datos de los
        interesados estan protegidos y no son publicos.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <Suspense
        fallback={
          <div className="surface w-full max-w-md p-8 sm:p-10">
            <ArtikoLogo height={44} />
          </div>
        }
      >
        <LoginCard />
      </Suspense>
    </main>
  );
}
