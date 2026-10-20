import type { Prisma } from "@prisma/client";
import { retentionFor, type Retention } from "./retention";

/// Lo que hay que leer de una solicitud para saber cuando se borra.
///
/// El panel (que enseña la fecha) y el proceso diario (que borra) usan esta
/// misma consulta y esta misma funcion. Si cada uno calculase a su manera, el
/// panel podria anunciar un dia y el borrado ocurrir otro.
export const retentionSelect = {
  status: true,
  lastActivityAt: true,
  candidatePool: true,
  documents: {
    select: { uploadedAt: true },
    orderBy: { uploadedAt: "desc" },
    take: 1,
  },
  notes: {
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 1,
  },
  documentRequests: {
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 1,
  },
} satisfies Prisma.ApplicationSelect;

export type RetentionFields = Prisma.ApplicationGetPayload<{
  select: typeof retentionSelect;
}>;

export function applicationRetention(application: RetentionFields): Retention {
  return retentionFor({
    status: application.status,
    lastActivityAt: application.lastActivityAt,
    candidatePool: application.candidatePool,
    activity: [
      application.documents[0]?.uploadedAt,
      application.notes[0]?.createdAt,
      application.documentRequests[0]?.createdAt,
    ],
  });
}
