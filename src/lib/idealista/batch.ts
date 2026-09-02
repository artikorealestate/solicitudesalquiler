import { parseIdealistaText } from "./parse";

/// Un anuncio tal y como lo extrajo el boton de la barra de marcadores.
export type RawListing = {
  idealistaId: string;
  /// Referencia propia de Artiko ("195"), leida de la ficha del anuncio.
  /// Puede faltar: no aparece en el listado, solo en cada ficha.
  reference?: string | null;
  title: string;
  priceText?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  details?: string[];
};

/// El mismo anuncio ya convertido en campos de inmueble.
export type NormalizedListing = {
  idealistaId: string;
  /// Referencia que se usara al crear el inmueble. Si Idealista no la
  /// expone, se cae al identificador interno para no dejarla vacia: es
  /// obligatoria y unica porque da nombre a la carpeta de Drive.
  reference: string;
  hasOwnReference: boolean;
  title: string;
  zone?: string;
  address?: string;
  rentPrice?: number;
  salePrice?: number;
  operationType: "RENT" | "SALE";
  idealistaUrl?: string;
  mainImageUrl?: string;
  description?: string;
};

/// Reutilizamos el interprete de texto: el titulo y el precio vienen en el
/// mismo formato que en la pagina, asi que las reglas de separacion de zona
/// y de lectura de importes ya estan probadas.
export function normalizeListing(raw: RawListing): NormalizedListing {
  const parsed = parseIdealistaText(
    [raw.title, raw.priceText ?? ""].filter(Boolean).join("\n"),
  );

  const ownReference = raw.reference?.trim();

  return {
    idealistaId: raw.idealistaId,
    reference: ownReference || raw.idealistaId,
    hasOwnReference: Boolean(ownReference),
    title: raw.title,
    zone: parsed.zone,
    address: parsed.address,
    rentPrice: parsed.rentPrice,
    salePrice: parsed.salePrice,
    // Sin marca de mensualidad lo tratamos como venta; si no hay precio
    // legible dejamos alquiler, que es el caso mayoritario de Artiko.
    operationType: parsed.salePrice !== undefined ? "SALE" : "RENT",
    idealistaUrl: raw.url ?? undefined,
    mainImageUrl: raw.imageUrl ?? undefined,
    description: raw.description ?? undefined,
  };
}

export type ExistingProperty = {
  id: string;
  idealistaId: string | null;
  reference: string;
  title: string;
  rentPrice: number | null;
  salePrice: number | null;
  zone: string | null;
  mainImageUrl: string | null;
};

export type BatchRow = {
  listing: NormalizedListing;
  state: "nuevo" | "cambiado" | "igual";
  existingId?: string;
  existingReference?: string;
  changes: string[];
};

function describeChange(
  label: string,
  before: number | string | null,
  after: number | string,
): string {
  return `${label}: ${before ?? "sin dato"} → ${after}`;
}

/// Compara el lote con la base de datos para que el administrador vea que va
/// a pasar antes de confirmar. El emparejamiento va por identificador de
/// Idealista, no por titulo: los titulos se reescriben a menudo.
export function buildBatchRows(
  raw: RawListing[],
  existing: ExistingProperty[],
): BatchRow[] {
  const byIdealistaId = new Map(
    existing
      .filter((item) => item.idealistaId)
      .map((item) => [item.idealistaId as string, item]),
  );

  return raw.map((rawListing) => {
    const listing = normalizeListing(rawListing);
    const match = byIdealistaId.get(listing.idealistaId);

    if (!match) {
      return { listing, state: "nuevo" as const, changes: [] };
    }

    const changes: string[] = [];

    if (
      listing.rentPrice !== undefined &&
      listing.rentPrice !== (match.rentPrice ?? undefined)
    ) {
      changes.push(
        describeChange("alquiler", match.rentPrice, listing.rentPrice),
      );
    }

    if (
      listing.salePrice !== undefined &&
      listing.salePrice !== (match.salePrice ?? undefined)
    ) {
      changes.push(describeChange("venta", match.salePrice, listing.salePrice));
    }

    if (listing.title !== match.title) {
      changes.push("titulo actualizado");
    }

    if (listing.zone && listing.zone !== match.zone) {
      changes.push(describeChange("zona", match.zone, listing.zone));
    }

    if (listing.mainImageUrl && listing.mainImageUrl !== match.mainImageUrl) {
      changes.push("foto actualizada");
    }

    return {
      listing,
      state: changes.length > 0 ? ("cambiado" as const) : ("igual" as const),
      existingId: match.id,
      existingReference: match.reference,
      changes,
    };
  });
}

export function summarizeBatch(rows: BatchRow[]) {
  return {
    nuevos: rows.filter((row) => row.state === "nuevo").length,
    cambiados: rows.filter((row) => row.state === "cambiado").length,
    iguales: rows.filter((row) => row.state === "igual").length,
  };
}
