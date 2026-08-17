import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookmarkletLink } from "@/components/admin/bookmarklet";
import { prisma } from "@/lib/db";
import { regenerateSyncToken } from "@/lib/idealista/actions";

export const dynamic = "force-dynamic";

export default async function SyncSetupPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase() ?? "";

  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { syncToken: true }
  });

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="eyebrow">Catalogo</p>
      <h1 className="heading-xl mt-2">Sincronizar con Idealista</h1>

      <div className="surface mt-8 p-6">
        <h2 className="font-serif text-xl text-ink-strong">
          Por que funciona asi
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Idealista rechaza cualquier peticion automatica, incluso la primera y
          aunque se disfrace de navegador. Por eso la app no puede ir a buscar
          tus anuncios por su cuenta.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          La solucion es al reves: los traes tu. Abres tu pagina de anuncios
          como cualquier dia y pulsas un boton guardado en la barra de
          marcadores. Ese boton lee lo que ya tienes en pantalla y lo envia
          aqui. Para Idealista no ha pasado nada raro, porque no ha pasado nada
          raro: has mirado tus propios anuncios.
        </p>
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-serif text-xl text-ink-strong">
          1. Guarda el boton, una sola vez
        </h2>

        {admin?.syncToken ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              Asegurate de tener la barra de marcadores visible
              (<kbd className="rounded border border-line px-1.5 py-0.5 text-xs">Ctrl</kbd>{" "}
              +{" "}
              <kbd className="rounded border border-line px-1.5 py-0.5 text-xs">
                Mayus
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-line px-1.5 py-0.5 text-xs">B</kbd>{" "}
              en Chrome) y arrastra este boton hasta ella:
            </p>

            <BookmarkletLink token={admin.syncToken} />

            <form action={regenerateSyncToken} className="mt-6 border-t border-line-soft pt-5">
              <p className="text-xs leading-relaxed text-ink-muted">
                Si pierdes el ordenador o alguien deja el equipo, crea un boton
                nuevo: el anterior dejara de funcionar al instante.
              </p>
              <button type="submit" className="btn-secondary mt-3 py-2 text-sm">
                Crear un boton nuevo y anular el anterior
              </button>
            </form>
          </>
        ) : (
          <form action={regenerateSyncToken}>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              Todavia no has creado tu boton de sincronizacion.
            </p>
            <button type="submit" className="btn-primary mt-4">
              Crear mi boton
            </button>
          </form>
        )}
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-serif text-xl text-ink-strong">
          2. Usalo cuando publiques anuncios
        </h2>
        <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink">
          <li>
            <strong>1.</strong> Abre tu listado de anuncios en Idealista.
          </li>
          <li>
            <strong>2.</strong> Espera a que carguen todos y pulsa el marcador.
          </li>
          <li>
            <strong>3.</strong> Aparecera un aviso arriba a la derecha con
            cuantos anuncios se han enviado.
          </li>
          <li>
            <strong>4.</strong> Vuelve aqui, revisa la tabla y confirma. Hasta
            que confirmes no se guarda nada.
          </li>
        </ol>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-line-soft pt-5 text-sm">
          <a
            href="https://www.idealista.com/pro/artiko-real-estate/alquiler-viviendas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dark underline-offset-4 hover:underline"
          >
            Abrir mis anuncios de alquiler ↗
          </a>
          <a
            href="https://www.idealista.com/pro/artiko-real-estate/venta-viviendas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dark underline-offset-4 hover:underline"
          >
            Abrir mis anuncios de venta ↗
          </a>
        </div>
      </div>

      <p className="mt-6 text-sm">
        <Link
          href="/admin/inmuebles"
          className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          ← Volver a inmuebles
        </Link>
      </p>
    </main>
  );
}
