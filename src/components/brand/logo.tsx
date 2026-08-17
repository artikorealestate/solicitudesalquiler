/* eslint-disable @next/next/no-img-element */

/// Logotipo oficial de Artiko. Se sirve como SVG desde /public para que se vea
/// nitido a cualquier tamano; no usamos next/image porque un SVG plano no
/// necesita optimizacion y asi evitamos el parpadeo de carga.
export function ArtikoLogo({
  height = 40,
  className = ""
}: {
  height?: number;
  className?: string;
}) {
  return (
    <img
      src="/brand/artiko-logo.svg"
      alt="Artiko Real Estate"
      height={height}
      style={{ height }}
      className={`w-auto ${className}`}
    />
  );
}
