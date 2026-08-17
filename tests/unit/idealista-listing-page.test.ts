import { describe, expect, it } from "vitest";
import {
  compareWithExisting,
  parseIdealistaListingPage
} from "../../src/lib/idealista/parse-listing-page";

/// Extracto literal de la pagina de anuncios de alquiler de Artiko en
/// Idealista, copiada tal cual (contadores de fotos, etiquetas y todo).
/// Si Idealista cambia el formato, este test avisara antes que un usuario.
const realListingPage = `
1/
43
Ubicación aproximada.
Piso en Calle de la Flor del Taronger, Canet d'En Berenguer
1.600€/mes
Garaje incluido 2 hab. 116 m² 2ª planta exterior con ascensor

Alquiler de temporada en Gran Canet, disponible de septiembre a mayo por 1.600 EUR al mes. Para junio, julio y agosto, consulta disponibilidad y precio. La vivienda se sitúa en la segunda planta y dispone de 116 m² construidos.

Alquiler de temporada
Contactar
Ver teléfono
1/
23
Piso en Calle Flor de Taronger, Canet d'En Berenguer
2.200€/mes
Garaje incluido 3 hab. 127 m² 15ª planta exterior con ascensor

Piso en alquiler en la urbanización de Gran Canet. DISPONIBILIDAD 2026: * Julio completo: 6.000 €/mes. * Agosto completo: 6.000 €/mes. * Septiembre completo: 3.500 €/mes.

Vistas al mar
Contactar
Ver teléfono
1/
32
Piso en Calle del Marquès de Dos Aigües, Sant Francesc, València
3.000€/mes
3 hab. 171 m² 1ª planta exterior con ascensor 08 ago

Vivienda reformada y amueblada en pleno centro histórico de Valencia. Dispone de 171 m² construidos y 154 m² útiles, distribuidos en tres dormitorios.

Lujo
Contactar
Ver teléfono
1/
34
Chalet adosado en Antigua Moreria, Sagunto/Sagunt
4.500€/mes
Garaje incluido 8 hab. 316 m²

Edificio completo en alquiler para empresas, equipos desplazados y grupos profesionales en Sagunto. El inmueble dispone de 316 m² construidos distribuidos en tres plantas.

Alquiler de temporada
Contactar
Ver teléfono
1/
8
Estudio en Calle Illa de Còrsega, Las Islas, Puerto de Sagunto
900€/mes
52 m² Bajo exterior sin ascensor

Estudio cerca de la playa en Puerto de Sagunto, con posibilidad de alquiler de larga temporada o alquiler por temporada.

Contactar
Ver teléfono
1/
24
Piso en Flor Del Taronger De La, Canet d'En Berenguer
1.600€/mes
Garaje incluido 2 hab. 100 m² 2ª planta exterior con ascensor

¡Disponible todo el mes de junio! 2.200 €/mes Piso en alquiler de temporada de septiembre a junio. Esta es la disponibilidad: 01/06 al 30/06 2.200 €/mes 01/09 al 30/05 1.600 €/mes

Alquiler de temporada
Contactar
Ver teléfono
`;

describe("parseIdealistaListingPage", () => {
  const listings = parseIdealistaListingPage(realListingPage);

  it("separa cada anuncio de la pagina", () => {
    expect(listings).toHaveLength(6);
  });

  it("reconoce los chalets adosados, no solo los pisos", () => {
    const chalet = listings.find((item) =>
      item.title?.startsWith("Chalet adosado")
    );
    expect(chalet).toBeDefined();
    expect(chalet?.rentPrice).toBe(4500);
    expect(chalet?.zone).toBe("Sagunto/Sagunt");
  });

  it("reconoce los estudios", () => {
    const estudio = listings.find((item) => item.title?.startsWith("Estudio"));
    expect(estudio?.rentPrice).toBe(900);
    expect(estudio?.zone).toBe("Puerto de Sagunto");
  });

  it("coge el precio del titular, no los que aparecen en la descripcion", () => {
    // Este anuncio menciona 6.000 €/mes de temporada alta en el texto,
    // pero su precio publicado son 2.200 €/mes.
    const conTemporadaAlta = listings.find((item) =>
      item.title?.includes("Calle Flor de Taronger,")
    );
    expect(conTemporadaAlta?.rentPrice).toBe(2200);

    // Y este menciona 2.200 €/mes para junio, pero se publica a 1.600.
    const conJunio = listings.find((item) =>
      item.title?.includes("Flor Del Taronger De La")
    );
    expect(conJunio?.rentPrice).toBe(1600);
  });

  it("separa direccion y zona en titulos con varias comas", () => {
    const valencia = listings.find((item) => item.zone === "València");
    expect(valencia?.address).toBe(
      "Calle del Marquès de Dos Aigües, Sant Francesc"
    );
  });

  it("los interpreta todos como alquiler", () => {
    expect(listings.every((item) => item.rentPrice !== undefined)).toBe(true);
    expect(listings.every((item) => item.salePrice === undefined)).toBe(true);
  });

  it("descarta el ruido de la interfaz de Idealista", () => {
    // "Ubicación aproximada.", "Contactar", "1/", "43"... nada de eso
    // puede colarse como si fuera un inmueble.
    expect(
      listings.every((item) => item.title && item.title.length > 15)
    ).toBe(true);
  });
});

describe("compareWithExisting", () => {
  const parsed = parseIdealistaListingPage(realListingPage);

  it("marca como nuevo lo que no esta en la base de datos", () => {
    const result = compareWithExisting(parsed, []);
    expect(result).toHaveLength(6);
    expect(result.every((item) => item.state === "nuevo")).toBe(true);
  });

  it("detecta una bajada de precio y la describe", () => {
    const chalet = parsed.find((item) =>
      item.title?.startsWith("Chalet adosado")
    )!;

    const result = compareWithExisting(
      [chalet],
      [
        {
          id: "abc",
          reference: "ART-1",
          title: chalet.title!,
          rentPrice: 5000,
          salePrice: null,
          zone: "Sagunto/Sagunt"
        }
      ]
    );

    expect(result[0].state).toBe("cambiado");
    expect(result[0].existingId).toBe("abc");
    expect(result[0].changes[0]).toContain("5000 → 4500");
  });

  it("no toca lo que no ha cambiado", () => {
    const estudio = parsed.find((item) => item.title?.startsWith("Estudio"))!;

    const result = compareWithExisting(
      [estudio],
      [
        {
          id: "xyz",
          reference: "ART-2",
          title: estudio.title!,
          rentPrice: 900,
          salePrice: null,
          zone: "Puerto de Sagunto"
        }
      ]
    );

    expect(result[0].state).toBe("igual");
    expect(result[0].changes).toHaveLength(0);
  });
});
