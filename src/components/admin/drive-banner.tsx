import { isDriveConfigured } from "@/lib/google/auth";

/// Aviso persistente mientras Drive no este conectado.
///
/// Va en la cabecera del panel, no en una pantalla concreta: mientras falte,
/// los documentos que adjunten los interesados no se guardan en ningun sitio,
/// y eso no puede pasar desapercibido.
export function DriveBanner() {
  if (isDriveConfigured()) return null;

  return (
    <div className="border-b border-danger/25 bg-danger/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5">
        <p className="text-sm text-ink">
          <strong className="text-danger">Google Drive sin conectar.</strong>{" "}
          Los documentos que adjunten los interesados no se estan guardando.
        </p>
        <a
          href="/api/google/drive/authorize"
          className="ml-auto shrink-0 rounded-md bg-ink-strong px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-ink"
        >
          Conectar ahora
        </a>
      </div>
    </div>
  );
}
