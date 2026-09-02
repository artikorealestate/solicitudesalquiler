import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/nav";
import { DriveBanner } from "@/components/admin/drive-banner";
import { ArtikoLogo } from "@/components/brand/logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // La pantalla de login comparte este layout pero no debe mostrar la
  // cabecera: alli todavia no hay sesion.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3">
          <Link
            href="/admin"
            className="shrink-0"
            aria-label="Inicio del panel"
          >
            <ArtikoLogo height={28} />
          </Link>

          <AdminNav />

          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="hidden text-ink-muted sm:inline">
              {session.user?.email}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Salir
            </Link>
          </div>
        </div>
      </header>

      <DriveBanner />

      {children}
    </div>
  );
}
