import { ArtikoLogo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/public/site-footer";
import { DocumentRequestForm } from "@/components/public/document-request-form";
import { prisma } from "@/lib/db";
import { resolveDocumentItems } from "@/lib/applications/document-catalog";
import { issueUploadTicket } from "@/lib/applications/upload-ticket";
import { tryEnsureApplicationFolder } from "@/lib/applications/drive-folder";
import { getDictionary, interpolate, type Dictionary } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

/// Pagina donde un candidato preseleccionado sube su documentacion.
///
/// No hay login: el enlace del correo es la credencial. Por eso el token es
/// largo y aleatorio, caduca, y solo permite subir a la carpeta de esa
/// solicitud concreta — nunca leer nada.
///
/// Va en el idioma en que la persona relleno el formulario.

function Shell({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: string;
}) {
  // El mismo pie que el resto de paginas publicas: WhatsApp y la web para
  // hablar con Artiko, e informacion de privacidad a un clic.
  return (
    <main className="mx-auto max-w-form px-4 py-10">
      <div className="flex justify-center">
        <ArtikoLogo height={44} />
      </div>
      <div className="mt-8">{children}</div>
      <SiteFooter dictionary={dictionary} locale={locale} />
    </main>
  );
}

function Unavailable({
  title,
  body,
  dictionary,
  locale,
}: {
  title: string;
  body: string;
  dictionary: Dictionary;
  locale: string;
}) {
  return (
    <Shell dictionary={dictionary} locale={locale}>
      <div className="surface p-7 text-center sm:p-10">
        <h1 className="heading-lg">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">{body}</p>
      </div>
    </Shell>
  );
}

export default async function DocumentRequestPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const request = await prisma.documentRequest.findUnique({
    where: { token },
    include: {
      application: {
        select: {
          id: true,
          firstName: true,
          locale: true,
          driveFolderId: true,
          property: { select: { title: true, zone: true } },
          documents: { select: { fileName: true } },
        },
      },
    },
  });

  // El idioma sale de la solicitud; si el enlace no existe, se cae al
  // castellano para poder dar el mensaje de error igualmente.
  const locale =
    request && isLocale(request.application.locale)
      ? request.application.locale
      : defaultLocale;
  const dictionary: Dictionary = await getDictionary(locale);
  const t = dictionary.docs;

  // Mismo mensaje para enlace inexistente y cancelado: no hay motivo para que
  // un enlace al azar revele si existe o no.
  if (!request || request.status === "CANCELLED") {
    return (
      <Unavailable
        title={t.unavailableTitle}
        body={t.unavailableBody}
        dictionary={dictionary}
        locale={locale}
      />
    );
  }

  if (request.expiresAt < new Date()) {
    return (
      <Unavailable
        title={t.expiredTitle}
        body={t.expiredBody}
        dictionary={dictionary}
        locale={locale}
      />
    );
  }

  if (request.status === "COMPLETED") {
    return (
      <Unavailable
        title={t.completedTitle}
        body={t.completedBody}
        dictionary={dictionary}
        locale={locale}
      />
    );
  }

  // Se crea (o rehace) aqui si falta: si al enviar la solicitud fallo Drive,
  // esta es la ocasion de que los documentos lleguen por fin.
  const folderId = await tryEnsureApplicationFolder(request.application.id);

  if (!folderId) {
    return (
      <Unavailable
        title={t.unavailableTitle}
        body={t.unavailableBody}
        dictionary={dictionary}
        locale={locale}
      />
    );
  }

  const { application } = request;

  return (
    <Shell dictionary={dictionary} locale={locale}>
      <div className="mb-6">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="heading-xl mt-2">
          {interpolate(t.greeting, { name: application.firstName })}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {interpolate(t.intro, { property: application.property.title })}
        </p>
        {request.message ? (
          <p className="mt-4 rounded-md bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
            {request.message}
          </p>
        ) : null}
      </div>

      <DocumentRequestForm
        applicationId={application.id}
        uploadTicket={issueUploadTicket(application.id)}
        items={resolveDocumentItems(request.requestedItems, t.items)}
        alreadyUploaded={application.documents.map((doc) => doc.fileName)}
        dictionary={dictionary}
      />
    </Shell>
  );
}
