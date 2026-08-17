import { describe, expect, it } from "vitest";
import {
  buildBatchRows,
  normalizeListing,
  summarizeBatch,
  type ExistingProperty,
  type RawListing
} from "../../src/lib/idealista/batch";

const rentalRaw: RawListing = {
  idealistaId: "105799303",
  title: "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer",
  priceText: "1.600€/mes",
  url: "https://www.idealista.com/pro/artiko-real-estate/inmueble/105799303/",
  imageUrl: "https://img4.idealista.com/blur/480_360_mq/0/foto.jpg",
  description: "Alquiler de temporada en Gran Canet.",
  details: ["Garaje incluido", "2 hab.", "116 m²"]
};

const saleRaw: RawListing = {
  idealistaId: "104112233",
  title: "Piso en Calle Mayor, Sagunto",
  priceText: "295.000€",
  url: "https://www.idealista.com/pro/artiko-real-estate/inmueble/104112233/",
  imageUrl: null,
  description: null,
  details: []
};

function existing(overrides: Partial<ExistingProperty> = {}): ExistingProperty {
  return {
    id: "prop-1",
    idealistaId: "105799303",
    reference: "ART-001",
    title: rentalRaw.title,
    rentPrice: 1600,
    salePrice: null,
    zone: "Canet d'En Berenguer",
    mainImageUrl: rentalRaw.imageUrl ?? null,
    ...overrides
  };
}

describe("referencia del inmueble", () => {
  it("usa la referencia propia de Artiko cuando Idealista la expone", () => {
    const listing = normalizeListing({ ...rentalRaw, reference: "195" });

    expect(listing.reference).toBe("195");
    expect(listing.hasOwnReference).toBe(true);
  });

  it("cae al identificador de Idealista cuando no hay referencia propia", () => {
    const listing = normalizeListing({ ...rentalRaw, reference: null });

    // La referencia da nombre a la carpeta de Drive y es obligatoria, asi que
    // nunca puede quedarse vacia.
    expect(listing.reference).toBe("105799303");
    expect(listing.hasOwnReference).toBe(false);
  });

  it("no acepta una referencia que solo tiene espacios", () => {
    const listing = normalizeListing({ ...rentalRaw, reference: "   " });

    expect(listing.reference).toBe("105799303");
    expect(listing.hasOwnReference).toBe(false);
  });

  it("limpia los espacios sobrantes de la referencia", () => {
    const listing = normalizeListing({ ...rentalRaw, reference: "  195  " });
    expect(listing.reference).toBe("195");
  });
});

describe("normalizeListing", () => {
  it("convierte un anuncio de alquiler en campos de inmueble", () => {
    const listing = normalizeListing(rentalRaw);

    expect(listing.rentPrice).toBe(1600);
    expect(listing.salePrice).toBeUndefined();
    expect(listing.operationType).toBe("RENT");
    expect(listing.zone).toBe("Canet d'En Berenguer");
    expect(listing.address).toBe("Calle de la Flor del Taronger");
    expect(listing.mainImageUrl).toContain("img4.idealista.com");
  });

  it("convierte un anuncio de venta", () => {
    const listing = normalizeListing(saleRaw);

    expect(listing.salePrice).toBe(295000);
    expect(listing.rentPrice).toBeUndefined();
    expect(listing.operationType).toBe("SALE");
    expect(listing.zone).toBe("Sagunto");
  });

  it("no se inventa datos cuando faltan", () => {
    const listing = normalizeListing({
      idealistaId: "1",
      title: "Piso en Algun Sitio",
      priceText: null
    });

    expect(listing.rentPrice).toBeUndefined();
    expect(listing.salePrice).toBeUndefined();
    expect(listing.mainImageUrl).toBeUndefined();
    expect(listing.description).toBeUndefined();
  });
});

describe("buildBatchRows", () => {
  it("marca como nuevo lo que no esta en la base de datos", () => {
    const rows = buildBatchRows([rentalRaw, saleRaw], []);

    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.state === "nuevo")).toBe(true);
    expect(summarizeBatch(rows)).toEqual({ nuevos: 2, cambiados: 0, iguales: 0 });
  });

  it("reconoce un inmueble ya existente aunque le hayan cambiado el titulo", () => {
    const rows = buildBatchRows(
      [rentalRaw],
      [existing({ title: "Titulo antiguo completamente distinto" })]
    );

    // El emparejamiento va por identificador de Idealista, no por titulo.
    expect(rows[0].state).toBe("cambiado");
    expect(rows[0].existingId).toBe("prop-1");
    expect(rows[0].changes).toContain("titulo actualizado");
  });

  it("detecta y describe una bajada de precio", () => {
    const rows = buildBatchRows([rentalRaw], [existing({ rentPrice: 1800 })]);

    expect(rows[0].state).toBe("cambiado");
    expect(rows[0].changes[0]).toBe("alquiler: 1800 → 1600");
  });

  it("deja en paz lo que no ha cambiado", () => {
    const rows = buildBatchRows([rentalRaw], [existing()]);

    expect(rows[0].state).toBe("igual");
    expect(rows[0].changes).toHaveLength(0);
  });

  it("no empareja inmuebles dados de alta a mano, sin identificador", () => {
    const rows = buildBatchRows(
      [rentalRaw],
      [existing({ idealistaId: null })]
    );

    expect(rows[0].state).toBe("nuevo");
  });

  it("conserva la referencia interna del inmueble existente", () => {
    const rows = buildBatchRows([rentalRaw], [existing({ rentPrice: 1500 })]);
    expect(rows[0].existingReference).toBe("ART-001");
  });
});
