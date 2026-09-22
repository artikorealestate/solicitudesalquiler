"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

/// Lo que ve un interesado cuando algo se rompe por dentro.
///
/// Sin esto, Next ensena su pantalla en crudo: "Application error: a
/// server-side exception has occurred" y un numero. Paso en septiembre de
/// 2026, durante casi una semana, en la puerta de entrada de clientes de
/// Artiko. Quien llegaba ahi no tenia forma de saber que hacer ni a quien
/// escribir, y se iba.
///
/// Esta pantalla no depende de NADA que pueda estar roto: ni base de datos,
/// ni diccionarios, ni peticiones. Los textos van aqui dentro, cortos, en los
/// nueve idiomas del formulario, porque el fallo puede ocurrir justo cuando
/// no se puede cargar nada mas.

type ErrorText = {
  title: string;
  body: string;
  retry: string;
  write: string;
};

const TEXTS: Record<string, ErrorText> = {
  es: {
    title: "Ahora mismo no podemos mostrarte esto",
    body: "Es un problema nuestro, no tuyo. Estamos en ello. Si tienes prisa, escríbenos por WhatsApp y te atendemos igual.",
    retry: "Volver a intentarlo",
    write: "Escríbenos por WhatsApp",
  },
  en: {
    title: "We cannot show you this right now",
    body: "This is a problem on our side, not yours. We are on it. If you are in a hurry, message us on WhatsApp and we will help you just the same.",
    retry: "Try again",
    write: "Message us on WhatsApp",
  },
  de: {
    title: "Wir können Ihnen das gerade nicht anzeigen",
    body: "Das liegt an uns, nicht an Ihnen. Wir kümmern uns darum. Wenn es eilt, schreiben Sie uns per WhatsApp – wir helfen Ihnen genauso.",
    retry: "Erneut versuchen",
    write: "Schreiben Sie uns per WhatsApp",
  },
  fr: {
    title: "Nous ne pouvons pas afficher cette page pour le moment",
    body: "Le problème vient de chez nous, pas de vous. Nous y travaillons. Si c'est urgent, écrivez-nous sur WhatsApp : nous vous répondrons de la même façon.",
    retry: "Réessayer",
    write: "Écrivez-nous sur WhatsApp",
  },
  it: {
    title: "In questo momento non possiamo mostrarti questa pagina",
    body: "È un problema nostro, non tuo. Ci stiamo lavorando. Se hai fretta, scrivici su WhatsApp e ti aiutiamo lo stesso.",
    retry: "Riprova",
    write: "Scrivici su WhatsApp",
  },
  pt: {
    title: "Neste momento não conseguimos mostrar-lhe isto",
    body: "O problema é nosso, não seu. Já estamos a tratar disso. Se tiver pressa, escreva-nos pelo WhatsApp e ajudamo-lo na mesma.",
    retry: "Tentar de novo",
    write: "Escreva-nos pelo WhatsApp",
  },
  nl: {
    title: "We kunnen dit nu niet laten zien",
    body: "Dit ligt aan ons, niet aan u. We zijn ermee bezig. Heeft u haast, stuur ons dan een WhatsApp-bericht — we helpen u net zo goed.",
    retry: "Opnieuw proberen",
    write: "Stuur ons een WhatsApp",
  },
  ru: {
    title: "Сейчас мы не можем это показать",
    body: "Это наша проблема, не ваша. Мы уже занимаемся ею. Если вам срочно, напишите нам в WhatsApp — поможем так же.",
    retry: "Попробовать снова",
    write: "Написать в WhatsApp",
  },
  uk: {
    title: "Зараз ми не можемо це показати",
    body: "Це наша проблема, не ваша. Ми вже працюємо над нею. Якщо вам терміново, напишіть нам у WhatsApp — допоможемо так само.",
    retry: "Спробувати ще раз",
    write: "Написати у WhatsApp",
  },
};

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Queda en los registros de Vercel junto al digest que ve la persona.
    console.error(
      "[publico] Fallo mostrado al interesado:",
      error.digest,
      error,
    );
  }, [error]);

  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : "es";
  const t = TEXTS[raw] ?? TEXTS.es;

  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
  const website = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://artikore.com";

  return (
    <main className="mx-auto flex min-h-screen max-w-form flex-col justify-center px-4 py-10">
      <div className="surface p-7 text-center sm:p-10">
        <h1 className="heading-lg">{t.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">{t.body}</p>

        <div className="mt-7 flex flex-col items-center gap-3">
          <button type="button" onClick={reset} className="btn-gold w-full">
            {t.retry}
          </button>

          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {t.write}
            </a>
          ) : null}
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          <a href={website} className="underline-offset-4 hover:underline">
            Artiko Real Estate
          </a>
          {error.digest ? ` · ${error.digest}` : ""}
        </p>
      </div>
    </main>
  );
}
