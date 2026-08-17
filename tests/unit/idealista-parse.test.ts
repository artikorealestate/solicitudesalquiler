import { describe, expect, it } from "vitest";
import { parseIdealistaText } from "../../src/lib/idealista/parse";

// Textos calcados de los anuncios reales de Artiko en Idealista.
const rentalListing = `
Piso en Calle de la Flor del Taronger, Canet d'En Berenguer
1.600€/mes
Garaje incluido 2 hab. 116 m² 2ª planta exterior con ascensor

Alquiler de temporada en Gran Canet, disponible de septiembre a mayo por 1.600 EUR al mes. La vivienda se sitúa en la segunda planta y dispone de 116 m² construidos, 105 m² útiles y una terraza de 45 m² que rodea la vivienda.

https://www.idealista.com/pro/artiko-real-estate/inmueble/105799303/
Contactar
`;

const saleListing = `
Piso en Calle Mayor, Sagunto
295.000€
3 hab. 140 m² 4ª planta exterior con ascensor

Magnífica vivienda reformada en el centro de Sagunto, con acabados de primera calidad y orientación sur que garantiza luz durante todo el día.

Referencia: ART-114
https://www.idealista.com/pro/artiko-real-estate/inmueble/104112233/
`;

/// Texto copiado de la FICHA de un anuncio, que Idealista titula distinto
/// que el listado: el tipo va precedido de la operacion y la zona baja a la
/// linea siguiente.
const detailPageText = `
Vídeo
Mapa
Alquiler de piso en Calle de la Flor del Taronger
Canet d'En Berenguer  Ver mapa
1.600 €/mes
116 m²
2 hab.
2ª planta exterior con ascensor
Garaje incluido
Alquiler de temporada

Este piso combina lujo, confort y ubicación privilegiada, ideal para quienes buscan disfrutar del mar y de todas las comodidades de un residencial de alto nivel.

Referencia del anuncio 195
`;

const saleDetailPageText = `
Venta de casa o chalet independiente en Almardà
Sagunto/Sagunt  Ver mapa
775.000 €
310 m²
5 hab.

Espectacular chalet independiente a pocos metros de la playa.

Referencia del anuncio ART-88
`;

describe("texto copiado de la ficha del anuncio", () => {
  const parsed = parseIdealistaText(detailPageText);

  it("reconoce el titulo aunque empiece por la operacion", () => {
    // "Alquiler de piso en..." en vez de "Piso en...".
    expect(parsed.address).toBe("Calle de la Flor del Taronger");
  });

  it("coge la zona de la linea siguiente y le quita 'Ver mapa'", () => {
    expect(parsed.zone).toBe("Canet d'En Berenguer");
  });

  it("reconstruye el titulo con el formato del listado", () => {
    // Asi el mismo inmueble se llama igual venga del listado o de la ficha.
    expect(parsed.title).toBe(
      "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer"
    );
  });

  it("lee el precio de alquiler", () => {
    expect(parsed.rentPrice).toBe(1600);
    expect(parsed.salePrice).toBeUndefined();
  });

  it("lee la referencia de Artiko escrita con palabras de por medio", () => {
    expect(parsed.reference).toBe("195");
  });

  it("funciona igual con una ficha de venta", () => {
    const venta = parseIdealistaText(saleDetailPageText);

    expect(venta.salePrice).toBe(775000);
    expect(venta.rentPrice).toBeUndefined();
    expect(venta.zone).toBe("Sagunto/Sagunt");
    expect(venta.address).toBe("Almardà");
    expect(venta.reference).toBe("ART-88");
    expect(venta.title).toBe(
      "Casa o chalet independiente en Almardà, Sagunto/Sagunt"
    );
  });

  it("no confunde la zona con el precio si falta la linea de zona", () => {
    const sinZona = parseIdealistaText(
      "Alquiler de piso en Calle Nueva\n1.200 €/mes"
    );
    expect(sinZona.zone).toBeUndefined();
    expect(sinZona.rentPrice).toBe(1200);
  });
});

describe("parseIdealistaText", () => {
  it("no devuelve nada con texto vacio", () => {
    expect(parseIdealistaText("")).toEqual({});
    expect(parseIdealistaText("   \n  ")).toEqual({});
  });

  describe("anuncio de alquiler", () => {
    const parsed = parseIdealistaText(rentalListing);

    it("saca el titulo completo", () => {
      expect(parsed.title).toBe(
        "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer"
      );
    });

    it("separa direccion y zona", () => {
      expect(parsed.address).toBe("Calle de la Flor del Taronger");
      expect(parsed.zone).toBe("Canet d'En Berenguer");
    });

    it("lee el precio como alquiler, no como venta", () => {
      expect(parsed.rentPrice).toBe(1600);
      expect(parsed.salePrice).toBeUndefined();
    });

    it("interpreta el punto como separador de millares", () => {
      // Un "1.600" leido como 1,6 seria un error grave.
      expect(parsed.rentPrice).toBeGreaterThan(1000);
    });

    it("recoge enlace y referencia del anuncio", () => {
      expect(parsed.idealistaUrl).toBe(
        "https://www.idealista.com/pro/artiko-real-estate/inmueble/105799303/"
      );
      expect(parsed.reference).toBe("105799303");
    });

    it("recoge habitaciones y superficie", () => {
      expect(parsed.rooms).toBe(2);
      expect(parsed.sizeM2).toBe(116);
    });

    it("coge la descripcion larga, no las etiquetas sueltas", () => {
      expect(parsed.description).toContain("Alquiler de temporada en Gran Canet");
      expect(parsed.description).not.toBe("Contactar");
    });
  });

  describe("anuncio de venta", () => {
    const parsed = parseIdealistaText(saleListing);

    it("lee el precio como venta", () => {
      expect(parsed.salePrice).toBe(295000);
      expect(parsed.rentPrice).toBeUndefined();
    });

    it("prefiere la referencia declarada sobre la de la direccion web", () => {
      expect(parsed.reference).toBe("ART-114");
    });

    it("separa direccion y zona", () => {
      expect(parsed.address).toBe("Calle Mayor");
      expect(parsed.zone).toBe("Sagunto");
    });
  });

  describe("casos que no deben confundirlo", () => {
    it("no confunde la cuota de comunidad con un precio de venta", () => {
      const parsed = parseIdealistaText(
        "Piso en Calle Nueva, Valencia\nGastos de comunidad: 60€\n2 hab."
      );
      expect(parsed.salePrice).toBeUndefined();
    });

    it("acepta el formato 'EUR al mes'", () => {
      const parsed = parseIdealistaText(
        "Piso en Calle Nueva, Valencia\nSe alquila por 950 EUR al mes."
      );
      expect(parsed.rentPrice).toBe(950);
    });

    it("tolera texto sin titulo reconocible", () => {
      const parsed = parseIdealistaText("Algo pegado a medias 1.200€/mes");
      expect(parsed.title).toBeUndefined();
      expect(parsed.rentPrice).toBe(1200);
    });

    it("admite titulos sin calle, solo con zona", () => {
      const parsed = parseIdealistaText("Chalet en Puçol\n480.000€");
      expect(parsed.zone).toBe("Puçol");
      expect(parsed.address).toBeUndefined();
    });
  });
});
