import { ArtikoLogo } from "@/components/brand/logo";
import { DocumentRequestForm } from "@/components/public/document-request-form";
import { SiteFooter } from "@/components/public/site-footer";
import { prisma } from "@/lib/db";
import { resolveDocumentItems } from "@/lib/applications/document-catalog";
import { issueUploadTicket } from "@/lib/applications/upload-ticket";
import { getDictionary, interpolate, type Dictionary } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

/// La solicitud propia del interesado, a la que vuelve desde el enlace de su
/// correo de confirmacion.
///
/// Resuelve el caso mas frecuente despues de enviar: "se me olvido una
/// nomina". Sin esto la unica salida era rellenar el formulario entero otra
/// vez, lo que genera un duplicado en el panel y confunde a todos.
///
/// Es el mismo formulario que reciben cuando Artiko les pide documentacion
/// concreta: misma pagina, mismo circuito de subida, misma carpeta de Drive.
/// La diferencia es que aqui no hay una lista de lo que falta, porque no la
/// ha pedido nadie — salvo que Artiko ya se la haya mandado, en cuyo caso se
/// muestra tambien aqui.
///
/// Deliberadamente NO muestra el estado interno de la solicitud ni las notas
/// de Artiko. Solo lo que la propia persona envio y la posibilidad de anadir.

function Shell({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
}) {
  return (
    <main className="mx-auto max-w-form px-4 py-10">
      <div className="flex justify-center">
        <ArtikoLogo height={44} />
      </div>
      <div className="mt-8">{children}</div>
      <SiteFooter dictionary={dictionary} />
    </main>
  );
}

export default async function SelfServicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const application = await prisma.application.findUnique({
    where: { accessToken: token },
    select: {
      id: true,
      firstName: true,
      locale: true,
      submittedAt: true,
      status: true,
      driveFolderId: true,
      property: { select: { title: true } },
      documents: {
        select: { fileName: true },
        orderBy: { uploadedAt: "asc" },
      },
      // Si Artiko ya le ha pedido papeles concretos, esa lista manda: es mas
      // util que dejarle adivinar que subir.
      documentRequests: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { requestedItems: true },
      },
    },
  });

  const locale =
    application && isLocale(application.locale)
      ? application.locale
      : defaultLocale;
  const dictionary = await getDictionary(locale);
  const t = dictionary.docs;

  if (!application) {
    return (
      <Shell dictionary={dictionary}>
        <div className="surface p-7 text-center sm:p-10">
          <h1 className="heading-lg">{t.unavailableTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {t.unavailableBody}
          </p>
        </div>
      </Shell>
    );
  }

  // Una vez cerrada o descartada, el enlace deja de admitir documentos: no
  // tiene sentido seguir recibiendo papeles de un proceso terminado, y
  // acumularlos va en contra de guardar solo lo necesario.
  const terminada =
    application.status === "CLOSED" || application.status === "DISCARDED";

  const pendiente = application.documentRequests[0];

  return (
    <Shell dictionary={dictionary}>
      <div className="mb-6">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="heading-xl mt-2">
          {interpolate(t.greeting, { name: application.firstName })}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {interpolate(t.selfServiceHere, {
            property: application.property.title,
            date: application.submittedAt.toLocaleDateString(locale),
          })}
        </p>
      </div>

      {terminada || !application.driveFolderId ? (
        <div className="surface p-7 text-center">
          <h2 className="heading-lg">{t.completedTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {t.completedBody}
          </p>
        </div>
      ) : (
        <DocumentRequestForm
          applicationId={application.id}
          uploadTicket={issueUploadTicket(application.id)}
          items={
            pendiente
              ? resolveDocumentItems(pendiente.requestedItems, t.items)
              : []
          }
          alreadyUploaded={application.documents.map((doc) => doc.fileName)}
          dictionary={dictionary}
        />
      )}
    </Shell>
  );
}
