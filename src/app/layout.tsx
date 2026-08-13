import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artiko Interesados",
  description: "Gestion de solicitudes de compra y alquiler de Artiko Real Estate"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
