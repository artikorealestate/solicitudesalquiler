import {
  PROPERTY_TITLE_PATTERN,
  parseIdealistaText,
  type ParsedListing
} from "./parse";

/// Interpreta la pagina completa de anuncios de Idealista (la que lista los
/// 19 pisos de golpe), no un anuncio suelto.
///
/// El administrador abre su pagina de Idealista, selecciona todo, copia y
/// pega aqui. Asi el catalogo entero se sincroniza de una vez, sin que
/// ninguna peticion automatica salga hacia Idealista: sus paginas devuelven
/// 403 a cualquier peticion programada, incluso desde una conexion domestica
/// y con cabeceras de navegador.

/// Longitud maxima de un titulo de Idealista. Las descripciones que empiezan
/// igual que un titulo ("Piso en alquiler en la urbanizacion de...") son
/// mucho mas largas.
const MAX_TITLE_LENGTH = 120;

/// Una linea de precio: "1.600€/mes", "295.000€".
const PRICE_LINE = /^[\d.]+\s*(?:€|EUR)/i;

function nextNonEmpty(lines: string[], from: number): string | undefined {
  for (let i = from; i < lines.length; i += 1) {
    if (lines[i]) return lines[i];
  }
  return undefined;
}

/// Cada anuncio de la lista empieza con una linea de tipo
/// "Piso en Calle X, Municipio" SEGUIDA de su precio.
///
/// Exigir el precio a continuacion es lo que distingue un titulo de verdad de
/// una descripcion que casualmente empieza igual. Sin esa comprobacion se
/// creaban inmuebles fantasma a partir del texto descriptivo.
function isTitleLine(line: string, lines: string[], index: number): boolean {
  if (!PROPERTY_TITLE_PATTERN.test(line)) return false;
  if (line.length > MAX_TITLE_LENGTH) return false;

  const following = nextNonEmpty(lines, index + 1);
  return following !== undefined && PRICE_LINE.test(following);
}

function splitIntoListings(text: string): string[] {
  const lines = text.split("\n").map((line) => line.trim());

  const blocks: string[][] = [];
  let current: string[] | null = null;

  lines.forEach((line, index) => {
    if (isTitleLine(line, lines, index)) {
      if (current) blocks.push(current);
      current = [line];
    } else if (current) {
      current.push(line);
    }
  });

  if (current) blocks.push(current);

  return blocks.map((block) => block.join("\n"));
}

export type ParsedPageListing = ParsedListing & {
  /// Posicion en la pagina pegada, para poder mostrarlos en el mismo orden.
  index: number;
};

export function parseIdealistaListingPage(input: string): ParsedPageListing[] {
  if (!input?.trim()) return [];

  return splitIntoListings(input)
    .map((block, index) => ({ ...parseIdealistaText(block), index }))
    // Sin titulo ni precio no hay nada aprovechable: probablemente sea
    // texto de la interfaz de Idealista colado entre anuncios.
    .filter(
      (listing) =>
        listing.title !== undefined &&
        (listing.rentPrice !== undefined || listing.salePrice !== undefined)
    );
}

export type SyncComparison = {
  listing: ParsedPageListing;
  /// "nuevo" se dara de alta; "cambiado" actualizara precio y datos;
  /// "igual" se deja como esta.
  state: "nuevo" | "cambiado" | "igual";
  existingId?: string;
  changes: string[];
};

type ExistingProperty = {
  id: string;
  reference: string;
  title: string;
  rentPrice: number | null;
  salePrice: number | null;
  zone: string | null;
};

/// Compara lo pegado con lo que ya hay en la base de datos para que el
/// administrador vea que va a pasar ANTES de confirmar. Nunca creamos ni
/// modificamos nada a partir de texto interpretado sin que alguien lo valide.
export function compareWithExisting(
  parsed: ParsedPageListing[],
  existing: ExistingProperty[]
): SyncComparison[] {
  const byReference = new Map(existing.map((item) => [item.reference, item]));
  const byTitle = new Map(existing.map((item) => [item.title, item]));

  return parsed.map((listing) => {
    const match =
      (listing.reference ? byReference.get(listing.reference) : undefined) ??
      (listing.title ? byTitle.get(listing.title) : undefined);

    if (!match) {
      return { listing, state: "nuevo" as const, changes: [] };
    }

    const changes: string[] = [];

    if (
      listing.rentPrice !== undefined &&
      listing.rentPrice !== (match.rentPrice ?? undefined)
    ) {
      changes.push(
        `alquiler: ${match.rentPrice ?? "sin precio"} → ${listing.rentPrice}`
      );
    }

    if (
      listing.salePrice !== undefined &&
      listing.salePrice !== (match.salePrice ?? undefined)
    ) {
      changes.push(
        `venta: ${match.salePrice ?? "sin precio"} → ${listing.salePrice}`
      );
    }

    if (listing.zone && listing.zone !== match.zone) {
      changes.push(`zona: ${match.zone ?? "sin zona"} → ${listing.zone}`);
    }

    return {
      listing,
      state: changes.length > 0 ? ("cambiado" as const) : ("igual" as const),
      existingId: match.id,
      changes
    };
  });
}
