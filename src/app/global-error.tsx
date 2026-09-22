"use client";

/// Ultimo recurso: se usa cuando falla el propio layout raiz, que es lo unico
/// que los demas error.tsx no pueden capturar.
///
/// Sustituye al documento entero, asi que lleva su propio <html> y no se
/// apoya en las clases de la aplicacion: si esto llega a verse, puede que ni
/// los estilos hayan cargado. Por eso va todo en estilos en linea.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFAF8",
          color: "#334155",
          font: "16px/1.6 system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              font: "700 22px Georgia, serif",
              color: "#343434",
            }}
          >
            Artiko Real Estate
          </p>
          <p style={{ marginTop: 16 }}>
            Ahora mismo no podemos mostrarte esta página. Es un problema
            nuestro. Inténtalo de nuevo en un momento o escríbenos por WhatsApp.
          </p>
          <p style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: "1px solid #CAB269",
                background: "#CAB269",
                color: "#fff",
                borderRadius: 6,
                padding: "10px 20px",
                font: "700 14px system-ui, sans-serif",
                cursor: "pointer",
              }}
            >
              Volver a intentarlo
            </button>
          </p>
          {error.digest ? (
            <p style={{ marginTop: 18, fontSize: 12, color: "#8a8a8a" }}>
              {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
