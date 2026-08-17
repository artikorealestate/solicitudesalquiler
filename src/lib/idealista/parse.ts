/// Interpreta el texto que un administrador copia desde su anuncio de
/// Idealista y lo convierte en campos del formulario de alta.
///
/// No hacemos peticiones a Idealista: sus paginas estan protegidas con
/// deteccion de robots y sus condiciones prohiben la extraccion automatica.
/// Aqui solo interpretamos texto que una persona ha copiado a mano.
///
/// El resultado es SIEMPRE una sugerencia: el administrador revisa y corrige
/// antes de guardar. Por eso preferimos no adivinar cuando hay ambiguedad.

export type ParsedListing = {
  title?: string;
  address?: string;
  zone?: string;
  rentPrice?: number;
  salePrice?: number;
  idealistaUrl?: string;
  reference?: string;
  rooms?: number;
  sizeM2?: number;
  description?: string;
};

/// Tipos de inmueble con los que Idealista empieza sus titulos.
///
/// El tipo admite calificativos antes del "en": los anuncios reales de Artiko
/// incluyen "Chalet adosado en Antigua Moreria" y "Casa pareada en...", no
/// solo el tipo a secas.
export const PROPERTY_TITLE_PATTERN =
  /^(Piso|Ático|Atico|Casa|Chalet|Dúplex|Duplex|Estudio|Apartamento|Loft|Finca|Bajo)(?:\s+[a-záéíóúüñ]+)*\s+en\s+/i;

/// Idealista titula distinto segun donde se mire:
///
///   listado: "Piso en Calle Flor del Taronger, Canet d'En Berenguer"
///   ficha:   "Alquiler de piso en Calle Flor del Taronger"
///            "Canet d'En Berenguer  Ver mapa"   <- la zona va en la linea siguiente
///
/// El administrador puede copiar de cualquiera de los dos, asi que hay que
/// entender ambos formatos.
/// El tipo tiene que ser un tipo de inmueble de verdad. Sin esa restriccion,
/// una descripcion como "Alquiler de temporada en Gran Canet, disponible de
/// septiembre..." se tomaria por un titulo y el inmueble se llamaria
/// "Temporada en Gran Canet".
const DETAIL_TITLE_PATTERN =
  /^(Alquiler|Venta|Compra|Traspaso)\s+de\s+((?:piso|ático|atico|casa|chalet|dúplex|duplex|estudio|apartamento|loft|finca|bajo|local|nave|terreno)(?:\s+[a-záéíóúüñ]+)*?)\s+en\s+(.+)$/i;

/// Longitud maxima de un titulo de ficha. Las descripciones que empiezan
/// igual son mucho mas largas.
const MAX_DETAIL_TITLE_LENGTH = 120;

/// "Canet d'En Berenguer  Ver mapa" -> "Canet d'En Berenguer"
function cleanZoneLine(line: string): string {
  return line
    .replace(/\s*Ver mapa\s*$/i, "")
    .replace(/\s*Ver en el mapa\s*$/i, "")
    .trim();
}

/// Idealista escribe los importes al modo espanol: el punto separa millares
/// ("1.600", "295.000"). Un "1.600" mal leido como 1,6 seria un desastre.
function parseSpanishNumber(raw: string): number | undefined {
  const digits = raw.replace(/\./g, "").replace(/\s/g, "").replace(",", ".");
  const value = Number(digits);
  return Number.isFinite(value) ? Math.round(value) : undefined;
}

function findTitleLine(lines: string[]): string | undefined {
  return lines.find((line) => PROPERTY_TITLE_PATTERN.test(line));
}

/// "Piso en Calle Flor del Taronger, Canet d'En Berenguer"
///   -> direccion: "Calle Flor del Taronger", zona: "Canet d'En Berenguer"
function splitLocation(titleLine: string): { address?: string; zone?: string } {
  const afterType = titleLine.replace(/^[^,]*?\s+en\s+/i, "");
  const parts = afterType.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts.length === 0) return {};
  if (parts.length === 1) return { zone: parts[0] };

  return {
    address: parts.slice(0, -1).join(", "),
    zone: parts[parts.length - 1]
  };
}

export function parseIdealistaText(input: string): ParsedListing {
  if (!input?.trim()) return {};

  const text = input.replace(/ /g, " ");
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result: ParsedListing = {};

  // --- Titulo, direccion y zona ---
  // Se prueba primero el formato de la ficha: si el texto viene de ahi, la
  // linea del listado no existe y al reves.
  const detailIndex = lines.findIndex(
    (line) =>
      line.length <= MAX_DETAIL_TITLE_LENGTH && DETAIL_TITLE_PATTERN.test(line)
  );

  /// Linea de la que salio el titulo, para no confundirla luego con la
  /// descripcion.
  let titleSourceLine: string | undefined;

  if (detailIndex !== -1) {
    titleSourceLine = lines[detailIndex];
    const match = lines[detailIndex].match(DETAIL_TITLE_PATTERN)!;
    const [, , propertyType, address] = match;

    result.address = address.trim();

    // En la ficha la zona viene en la linea siguiente, no tras una coma.
    const nextLine = lines[detailIndex + 1];
    if (nextLine && !/€|EUR/i.test(nextLine)) {
      const zone = cleanZoneLine(nextLine);
      if (zone) result.zone = zone;
    }

    // Reconstruimos el titulo con el formato del listado para que un mismo
    // inmueble se llame igual venga de donde venga.
    const typeLabel =
      propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase();
    result.title = result.zone
      ? `${typeLabel} en ${result.address}, ${result.zone}`
      : `${typeLabel} en ${result.address}`;
  } else {
    const listTitleLine = findTitleLine(lines);
    if (listTitleLine) {
      titleSourceLine = listTitleLine;
      result.title = listTitleLine;
      Object.assign(result, splitLocation(listTitleLine));
    }
  }

  // --- Precios ---
  // El "/mes" (o "al mes") es lo que distingue un alquiler de una venta.
  const rentMatch = text.match(
    /([\d.]+(?:,\d+)?)\s*(?:€|EUR|eur)\s*(?:\/\s*mes|al mes)/i
  );
  if (rentMatch) {
    result.rentPrice = parseSpanishNumber(rentMatch[1]);
  }

  if (!rentMatch) {
    // Sin marca de mensualidad lo tratamos como venta, pero solo si el
    // importe es lo bastante grande para no confundirlo con una comunidad
    // o una fianza sueltas en la descripcion.
    const saleMatch = text.match(/([\d.]{5,}(?:,\d+)?)\s*(?:€|EUR|eur)/i);
    if (saleMatch) {
      const value = parseSpanishNumber(saleMatch[1]);
      if (value !== undefined && value >= 10000) {
        result.salePrice = value;
      }
    }
  }

  // --- Enlace y referencia ---
  const urlMatch = text.match(
    /https?:\/\/(?:www\.)?idealista\.com\/[^\s"'<>]+/i
  );
  if (urlMatch) {
    result.idealistaUrl = urlMatch[0].replace(/[.,;)]+$/, "");
  }

  // Preferimos la referencia declarada por Artiko; si no la hay, el
  // identificador que Idealista pone en la direccion del anuncio.
  //
  // En la ficha aparece como "Referencia del anuncio 195", con palabras de
  // por medio, asi que se busca esa forma antes que la generica.
  const declaredRef =
    text.match(/Referencia del anuncio\s*:?\s*([A-Za-z0-9\-_/]{1,40})/i) ??
    text.match(/referencia[^\dA-Za-z]{0,12}([A-Za-z0-9-]{3,})/i);
  const urlRef = result.idealistaUrl?.match(/\/inmueble\/(\d+)/);

  if (declaredRef) {
    result.reference = declaredRef[1];
  } else if (urlRef) {
    result.reference = urlRef[1];
  }

  // --- Caracteristicas ---
  const roomsMatch = text.match(/(\d+)\s*hab\b/i);
  if (roomsMatch) result.rooms = Number(roomsMatch[1]);

  const sizeMatch = text.match(/(\d+)\s*m²/);
  if (sizeMatch) result.sizeM2 = Number(sizeMatch[1]);

  // --- Descripcion ---
  // La damos por empezada en la primera linea larga que no sea el titulo:
  // las lineas cortas son etiquetas sueltas ("Contactar", "2 hab.").
  const descriptionLine = lines.find(
    (line) => line !== titleSourceLine && line.length > 80
  );
  if (descriptionLine) result.description = descriptionLine;

  return result;
}
