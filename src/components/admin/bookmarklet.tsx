"use client";

import { useEffect, useRef, useState } from "react";

/// Direcciones que solo existen en el ordenador de quien las abre.
///
/// Un marcador creado desde una de ellas deja de funcionar en cuanto la app
/// no esta abierta en ese ordenador. Paso exactamente eso: el boton se creo
/// durante las pruebas en localhost, la app salio a produccion, y el boton
/// siguio llamando al ordenador de pruebas durante semanas sin que nada lo
/// dijera.
function isLocalOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === "localhost" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
    );
  } catch {
    return false;
  }
}

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

    // El aviso de error dice a que direccion intento llamar el boton. Sin
    // eso, "no se ha podido cargar" no distingue entre un marcador viejo que
    // apunta a otro sitio y cualquier otro fallo.
    const code =
      `javascript:(function(){var s=document.createElement('script');` +
      `s.src='${appOrigin}/idealista-sync.js?t=${encodeURIComponent(token)}&_='+Date.now();` +
      `s.onerror=function(){alert('No se ha podido cargar el sincronizador de Artiko desde ${appOrigin}. ` +
      `Si esa no es la direccion de la app, vuelve a crear el boton desde el panel.')};` +
      `document.body.appendChild(s);})();`;

    if (ref.current) {
      ref.current.setAttribute("href", code);
    }
  }, [token]);

  const local = origin ? isLocalOrigin(origin) : false;

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

      {local ? (
        <p
          role="alert"
          className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-xs leading-relaxed text-danger"
        >
          Estas en una direccion local (
          <span className="font-mono">{origin}</span>). Un boton creado desde
          aqui solo funciona mientras la app este abierta en este ordenador.
          Para el uso normal, crealo desde la app publicada.
        </p>
      ) : null}

      {/* El marcador guarda dentro la direccion desde la que se creo. Mostrar
          la direccion evita la confusion meses despues. */}
      {origin ? (
        <p className="mt-3 rounded-md bg-cream px-3 py-2 text-xs leading-relaxed text-ink-muted">
          Este boton enviara los anuncios a{" "}
          <span className="font-mono text-ink">{origin}</span>. Si cambias de
          direccion —al poner un dominio propio, por ejemplo— vuelve a esta
          pantalla y arrastralo de nuevo, sustituyendo el anterior. La
          credencial no cambia.
        </p>
      ) : null}
    </div>
  );
}
