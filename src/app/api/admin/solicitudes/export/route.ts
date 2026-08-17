import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  buildApplicationsCsv,
  exportFileName,
  type ExportableApplication
} from "@/lib/applications/export-csv";
import { buildApplicationWhere } from "@/lib/applications/filters";

/// Descarga en CSV las solicitudes que cumplen los filtros actuales.
///
/// El middleware protege /admin pero no /api, asi que la sesion se comprueba
/// aqui: esto devuelve datos personales de los interesados.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const where = buildApplicationWhere({
    q: params.get("q") ?? undefined,
    operacion: params.get("operacion") ?? undefined,
    estado: params.get("estado") ?? undefined,
    inmueble: params.get("inmueble") ?? undefined
  });

  const applications = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    include: {
      property: { select: { reference: true, title: true, zone: true } },
      _count: { select: { documents: true } }
    }
  });

  const rows: ExportableApplication[] = applications.map((application) => ({
    submittedAt: application.submittedAt,
    status: application.status,
    operation: application.operation,
    locale: application.locale,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    nationality: application.nationality,
    idDocument: application.idDocument,
    comment: application.comment,
    answers: (application.answers ?? {}) as Record<string, string>,
    driveFolderUrl: application.driveFolderUrl,
    documentCount: application._count.documents,
    property: application.property
  }));

  console.info(
    `[export] ${session.user.email} descargo ${rows.length} solicitudes`
  );

  return new NextResponse(buildApplicationsCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${exportFileName()}"`,
      // Datos personales: que ningun intermediario los guarde en cache.
      "Cache-Control": "no-store, private"
    }
  });
}
