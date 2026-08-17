"use client";

import { useEffect, useRef, useState } from "react";

/// El enlace del marcador lleva un href "javascript:", que React se niega a
/// renderizar por seguridad (es la via clasica de inyeccion). Aqui es
/// legitimo y controlado: el codigo es nuestro y solo carga nuestro script,
/// asi que lo asignamos directamente sobre el nodo despues de montarlo.
export function BookmarkletLink({ token }: { token: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    // Tomamos el origen del navegador para que el mismo marcador funcione
    // tanto en pruebas locales como en produccion.
    const appOrigin = window.location.origin;
    setOrigin(appOrigin);

    const code =
      `javascript:(function(){var s=document.createElement('script');` +
      `s.src='${appOrigin}/idealista-sync.js?t=${encodeURIComponent(token)}&_='+Date.now();` +
      `s.onerror=function(){alert('No se ha podido cargar el sincronizador de Artiko.')};` +
      `document.body.appendChild(s);})();`;

    if (ref.current) {
      ref.current.setAttribute("href", code);
    }
  }, [token]);

  return (
    <div className="mt-4">
      <a
        ref={ref}
        draggable
        onClick={(event) => event.preventDefault()}
        className="inline-flex cursor-grab items-center gap-2 rounded-md border border-gold bg-gold-wash px-5 py-3 font-bold text-gold-dark active:cursor-grabbing"
      >
        <span aria-hidden="true">⌂</span>
        Sincronizar con Artiko
      </a>
      <p className="mt-2 text-xs text-ink-muted">
        {origin
          ? "Arrastra este boton a tu barra de marcadores. Pulsarlo aqui no hace nada."
          : "Preparando…"}
      </p>

      {/* El marcador guarda dentro la direccion desde la que se creo. Un
          marcador hecho en local seguiria enviando los anuncios al ordenador
          de quien lo creo, en silencio. Mostrar la direccion evita esa
          confusion meses despues. */}
      {origin ? (
        <p className="mt-3 rounded-md bg-cream px-3 py-2 text-xs leading-relaxed text-ink-muted">
          Este boton enviara los anuncios a{" "}
          <span className="font-mono text-ink">{origin}</span>. Si cambias de
          direccion —al pasar a produccion o al poner un dominio propio— vuelve
          a esta pantalla y arrastralo de nuevo, sustituyendo el anterior. La
          credencial no cambia.
        </p>
      ) : null}
    </div>
  );
}
