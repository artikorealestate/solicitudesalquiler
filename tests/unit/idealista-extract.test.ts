// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

/// Probamos el archivo que realmente se sirve al navegador
/// (public/idealista-sync.js), no una copia. Si alguien lo toca y rompe la
/// extraccion, este test lo detecta.
///
/// El script se autoejecuta y exporta extractListings por module.exports.
type Extractor = (doc: Document) => Array<{
  idealistaId: string;
  title: string;
  priceText: string | null;
  url: string | null;
  imageUrl: string | null;
  description: string | null;
  details: string[];
}>;

let extractListings: Extractor;
let extractReferenceFromHtml: (html: string) => string | null;

beforeAll(() => {
  const source = readFileSync(
    resolve(__dirname, "../../public/idealista-sync.js"),
    "utf8"
  );

  // El script aborta pronto porque el dominio no es idealista.com, pero para
  // entonces ya ha definido y exportado extractListings.
  const module = {
    exports: {} as {
      extractListings?: Extractor;
      extractReferenceFromHtml?: (html: string) => string | null;
    }
  };
  new Function("module", "document", "location", source)(
    module,
    globalThis.document,
    { hostname: "test.local", href: "http://test.local/" }
  );

  if (!module.exports.extractListings) {
    throw new Error("El script no ha exportado extractListings");
  }
  extractListings = module.exports.extractListings;
  extractReferenceFromHtml = module.exports.extractReferenceFromHtml!;
});

/// HTML calcado de un anuncio real de Artiko en Idealista, con las clases
/// exactas que usa su web.
const realArticle = `
<article class="item-multimedia-container item " data-element-id="105799303">
  <picture class="item-multimedia">
    <figure class="item-gallery">
      <picture>
        <img src="https://img4.idealista.com/blur/480_360_mq/0/id.pro.es.image.master/1d/ee/45/1263388341.jpg" alt="Salón">
      </picture>
    </figure>
  </picture>
  <div class="item-info-container ">
    <a href="/pro/artiko-real-estate/inmueble/105799303/" class="item-link " title="Piso en Calle de la Flor del Taronger, Canet d'En Berenguer">
      Piso en Calle de la Flor del Taronger, Canet d'En Berenguer
    </a>
    <div class="price-row">
      <span class="item-price h2-simulated">1.600<span class="txt-big">€/mes</span></span>
    </div>
    <div class="item-detail-char ">
      <span class="item-detail">Garaje incluido </span>
      <span class="item-detail">2 hab.</span>
      <span class="item-detail">116 m²</span>
      <span class="item-detail">2ª planta exterior con ascensor</span>
    </div>
    <div class="item-description description">
      <p class="ellipsis">Alquiler de temporada en Gran Canet, disponible de septiembre a mayo por 1.600 EUR al mes.</p>
    </div>
    <div class="listing-tags-container">
      <span class="listing-tags ">Alquiler de temporada</span>
    </div>
  </div>
</article>
`;

function documentWith(html: string): Document {
  document.body.innerHTML = html;
  return document;
}

describe("extractListings sobre HTML real de Idealista", () => {
  it("extrae un anuncio completo", () => {
    const [listing] = extractListings(documentWith(realArticle));

    expect(listing.idealistaId).toBe("105799303");
    expect(listing.title).toBe(
      "Piso en Calle de la Flor del Taronger, Canet d'En Berenguer"
    );
    expect(listing.priceText).toBe("1.600€/mes");
    expect(listing.url).toContain("/inmueble/105799303/");
    expect(listing.imageUrl).toContain("img4.idealista.com");
    expect(listing.description).toContain("Alquiler de temporada en Gran Canet");
  });

  it("no duplica las caracteristicas con el contenedor que las agrupa", () => {
    // El div se llama "item-detail-char" y los span "item-detail": un
    // selector por coincidencia parcial devolveria las cuatro caracteristicas
    // mas una quinta con todas pegadas.
    const [listing] = extractListings(documentWith(realArticle));

    expect(listing.details).toEqual([
      "Garaje incluido",
      "2 hab.",
      "116 m²",
      "2ª planta exterior con ascensor"
    ]);
  });

  it("descarta articulos sin identificador de Idealista", () => {
    const listings = extractListings(
      documentWith(
        '<article class="item"><a class="item-link" title="Piso sin id">x</a></article>'
      )
    );
    expect(listings).toHaveLength(0);
  });

  it("devuelve una lista vacia si la pagina no tiene anuncios", () => {
    expect(extractListings(documentWith("<p>Nada por aqui</p>"))).toEqual([]);
  });

  /// La referencia propia de Artiko ("195") no aparece en el listado, solo en
  /// la ficha de cada anuncio. Es la que ellos usan internamente, asi que es
  /// la que debe acabar en el inmueble.
  it("lee la referencia de Artiko en la ficha del anuncio", () => {
    const fichaHtml = `
      <div class="details-ref">
        <div class="ref-help">Referencia del anuncio</div>
        <span>195</span>
      </div>`;

    expect(extractReferenceFromHtml(fichaHtml)).toBe("195");
  });

  it("admite referencias con letras", () => {
    const fichaHtml = `
      <div><div class="ref-help">Referencia del anuncio</div><span>ART-114</span></div>`;

    expect(extractReferenceFromHtml(fichaHtml)).toBe("ART-114");
  });

  it("devuelve null si la ficha no lleva referencia", () => {
    expect(extractReferenceFromHtml("<div>Sin referencia por aqui</div>")).toBe(
      null
    );
  });

  it("procesa varios anuncios de una pagina", () => {
    const listings = extractListings(
      documentWith(realArticle + realArticle.replace("105799303", "101746100"))
    );
    expect(listings.map((item) => item.idealistaId)).toEqual([
      "105799303",
      "101746100"
    ]);
  });
});
