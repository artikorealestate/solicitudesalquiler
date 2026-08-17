/*
 * Sincronizacion de anuncios de Idealista para Artiko Interesados.
 *
 * Este archivo lo carga el boton que el administrador guarda en su barra de
 * marcadores. Se ejecuta en la pagina de Idealista que la persona ya tiene
 * abierta: lee lo que hay en pantalla y lo envia a la app.
 *
 * No hace ninguna peticion a Idealista. La pagina la ha cargado el navegador
 * de la persona con su sesion normal; aqui solo se lee el resultado. Esto es
 * lo que hace viable la sincronizacion: cualquier peticion programada contra
 * idealista.com responde 403.
 *
 * Al vivir en el servidor de la app y no dentro del marcador, se puede
 * corregir cuando Idealista cambie su HTML sin que nadie reinstale nada.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var appOrigin = script ? new URL(script.src).origin : null;
  var token = script ? new URL(script.src).searchParams.get("t") : null;

  // ---------------------------------------------------------------- aviso ---

  function showNotice(message, tone, linkUrl, linkText) {
    var existing = document.getElementById("artiko-sync-notice");
    if (existing) existing.remove();

    var box = document.createElement("div");
    box.id = "artiko-sync-notice";
    box.style.cssText = [
      "position:fixed", "top:20px", "right:20px", "z-index:2147483647",
      "max-width:340px", "padding:16px 18px",
      "background:#fff", "border:1px solid #E5E1DA",
      "border-left:4px solid " + (tone === "error" ? "#B44A3F" : "#CAB269"),
      "border-radius:10px",
      "box-shadow:0 8px 32px rgba(52,52,52,.22)",
      "font:14px/1.5 Lato,system-ui,sans-serif", "color:#334155"
    ].join(";");

    var text = document.createElement("div");
    text.textContent = message;
    box.appendChild(text);

    if (linkUrl) {
      var link = document.createElement("a");
      link.href = linkUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = linkText;
      link.style.cssText =
        "display:inline-block;margin-top:10px;color:#A8914F;font-weight:700";
      box.appendChild(link);
    }

    var close = document.createElement("button");
    close.textContent = "×";
    close.setAttribute("aria-label", "Cerrar");
    close.style.cssText =
      "position:absolute;top:6px;right:10px;border:0;background:none;" +
      "font-size:20px;line-height:1;color:#7A7A7A;cursor:pointer";
    close.onclick = function () {
      box.remove();
    };
    box.appendChild(close);

    document.body.appendChild(box);
    return box;
  }

  // ----------------------------------------------------------- extraccion ---

  function textOf(element) {
    return element ? element.textContent.trim().replace(/\s+/g, " ") : null;
  }

  /**
   * Lee los anuncios de la pagina actual.
   * Exportada aparte para poder probarla contra HTML real.
   */
  function extractListings(doc) {
    var items = doc.querySelectorAll("article.item");
    var results = [];

    for (var i = 0; i < items.length; i += 1) {
      var el = items[i];

      var link = el.querySelector('a[href*="/inmueble/"]');
      var titleEl = el.querySelector("a.item-link[title]") || link;
      var priceEl = el.querySelector(".item-price");
      var image = el.querySelector("img");
      var descriptionEl = el.querySelector(".item-description p, .item-description");

      var title = titleEl
        ? titleEl.getAttribute("title") || textOf(titleEl)
        : null;

      // El identificador de Idealista es la clave estable: los titulos y los
      // precios cambian, este no.
      var idealistaId =
        el.getAttribute("data-element-id") ||
        (link && (link.href.match(/\/inmueble\/(\d+)/) || [])[1]) ||
        null;

      if (!idealistaId || !title) continue;

      // Solo los <span class="item-detail">. El contenedor que los agrupa se
      // llama "item-detail-char", asi que un selector por coincidencia
      // parcial devolveria ademas todas las caracteristicas pegadas.
      var details = [];
      var detailNodes = el.querySelectorAll("span.item-detail");
      for (var d = 0; d < detailNodes.length; d += 1) {
        var value = textOf(detailNodes[d]);
        if (value) details.push(value);
      }

      results.push({
        idealistaId: String(idealistaId),
        title: title,
        priceText: textOf(priceEl),
        url: link ? link.href.split("?")[0] : null,
        imageUrl: image
          ? image.getAttribute("src") ||
            image.getAttribute("data-ondemand-img") ||
            null
          : null,
        description: textOf(descriptionEl),
        details: details
      });
    }

    return results;
  }

  /**
   * Recupera la referencia propia de Artiko ("Referencia del anuncio: 195")
   * abriendo la ficha del anuncio.
   *
   * Esa referencia no aparece en el listado, solo en la ficha. La peticion la
   * hace el navegador de la persona, sobre idealista.com y con su sesion:
   * es del mismo origen, no una peticion programada desde un servidor.
   */
  function extractReferenceFromHtml(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var help = doc.querySelector(".ref-help");
    if (!help) return null;

    if (help.nextElementSibling) {
      var direct = help.nextElementSibling.textContent.trim();
      if (direct) return direct;
    }

    var parentText = help.parentElement
      ? help.parentElement.textContent.replace(/\s+/g, " ").trim()
      : "";
    var match = parentText.match(/Referencia del anuncio\s*[:\s]\s*(\S+)/i);
    return match ? match[1] : null;
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /// Recorre las fichas de una en una, con pausa entre ellas. Sin la pausa,
  /// veinte peticiones seguidas parecerian automatizadas aunque salgan del
  /// navegador de una persona.
  async function addReferences(listings, onProgress) {
    for (var i = 0; i < listings.length; i += 1) {
      var listing = listings[i];
      if (!listing.url) continue;

      onProgress(i + 1, listings.length);

      try {
        var response = await fetch(listing.url, { credentials: "include" });
        if (response.ok) {
          listing.reference = extractReferenceFromHtml(await response.text());
        }
      } catch (error) {
        // Una ficha que falle no debe tumbar la sincronizacion: ese anuncio
        // se quedara con el identificador de Idealista como referencia.
      }

      if (i < listings.length - 1) await sleep(600);
    }
  }

  /// Idealista pagina los resultados cuando hay muchos anuncios. Si hay mas
  /// paginas hay que avisar, o el administrador creera que ha sincronizado
  /// todo el catalogo cuando solo ha traido la primera pagina.
  function hasMorePages(doc) {
    var next = doc.querySelector(
      '.pagination .next a, a[rel="next"], .pagination li.next'
    );
    return Boolean(next);
  }

  // Expuesto antes de cualquier comprobacion para que las pruebas
  // automaticas puedan cargar la extraccion sin ejecutar el envio.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      extractListings: extractListings,
      extractReferenceFromHtml: extractReferenceFromHtml,
      hasMorePages: hasMorePages
    };
  }

  // -------------------------------------------------------------- arranque ---

  if (!/(^|\.)idealista\.com$/i.test(location.hostname)) {
    showNotice(
      "Este boton solo funciona en una pagina de anuncios de Idealista. " +
        "Abre tu listado de anuncios y vuelve a pulsarlo.",
      "error"
    );
    return;
  }

  if (!appOrigin || !token) {
    showNotice(
      "Al boton le falta la credencial. Vuelve a crearlo desde el panel de Artiko.",
      "error"
    );
    return;
  }

  var listings = extractListings(document);

  if (listings.length === 0) {
    showNotice(
      "No he encontrado anuncios en esta pagina. Asegurate de estar en tu " +
        "listado de anuncios de Idealista y espera a que cargue del todo.",
      "error"
    );
    return;
  }

  var notice = showNotice(
    "Leyendo " + listings.length + " anuncios…",
    "info"
  );

  addReferences(listings, function (current, total) {
    if (notice) {
      notice.firstChild.textContent =
        "Leyendo referencias… " + current + " de " + total;
    }
  }).then(sendToArtiko);

  function sendToArtiko() {
  fetch(appOrigin + "/api/admin/idealista/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
      sourceUrl: location.href,
      hasMorePages: hasMorePages(document),
      listings: listings
    })
  })
    .then(function (response) {
      return response.json().then(function (body) {
        return { ok: response.ok, body: body };
      });
    })
    .then(function (result) {
      if (notice) notice.remove();

      if (!result.ok) {
        showNotice(
          result.body && result.body.error
            ? result.body.error
            : "Artiko ha rechazado el envio.",
          "error"
        );
        return;
      }

      var extra = hasMorePages(document)
        ? " Ojo: hay mas paginas de anuncios. Pasa a la siguiente y vuelve a pulsar el boton."
        : "";

      showNotice(
        "Recibidos " +
          listings.length +
          " anuncios. Nada se ha guardado todavia: revisalos y confirma." +
          extra,
        "info",
        appOrigin + "/admin/inmuebles/sincronizar/" + result.body.batchId,
        "Revisar y confirmar →"
      );
    })
    .catch(function (error) {
      if (notice) notice.remove();
      showNotice("No he podido conectar con Artiko: " + error.message, "error");
    });
  }
})();
