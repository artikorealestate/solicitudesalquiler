"use client";

/// Imprimir es la via mas fiable para convertir esto en un PDF: el navegador
/// ofrece "Guardar como PDF" en el mismo dialogo, en Windows, Mac, Android e
/// iOS. Generar el PDF en el servidor exigiria una libreria pesada para
/// obtener un resultado peor.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary py-2 text-sm"
    >
      Imprimir o guardar en PDF
    </button>
  );
}
