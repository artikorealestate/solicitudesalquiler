import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

// Las mismas dos familias que usa artikore.com.
//
// Playfair Display se carga tambien con el juego cirilico: el formulario se
// ofrece en ruso y ucraniano, y sin el los titulares de esos idiomas caerian
// a una fuente del sistema y romperian la coherencia de marca.
const serif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

// Lato no tiene cirilico. En ruso y ucraniano el texto corriente usara la
// tipografia del sistema, que en esos idiomas se lee perfectamente; forzar
// una familia sin sus glifos daria cuadros vacios.
const sans = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artiko Real Estate",
  description: "Solicitudes de alquiler y compra de Artiko Real Estate",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
