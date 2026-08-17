/// Auditoria de seguridad contra la web en produccion.
///
///   npx tsx --env-file=.env scripts/audit-produccion.ts
///
/// Busca activamente las credenciales de Artiko en todo lo que un visitante
/// puede descargar, y comprueba que los endpoints rechazan a quien no debe
/// entrar. No confia en el codigo: mira lo que el servidor sirve de verdad.
const BASE = process.env.AUDIT_URL ?? "https://artiko-interesados.vercel.app";

let fallos = 0;
function check(label: string, ok: boolean, detalle = "") {
  console.log(`  [${ok ? "OK   " : "FALLO"}] ${label}${detalle ? ` — ${detalle}` : ""}`);
  if (!ok) fallos += 1;
}

/// Los valores reales que NUNCA deben aparecer en el navegador.
function secretos(): Array<{ nombre: string; valor: string }> {
  const lista = [
    ["Secreto de Google", process.env.GOOGLE_CLIENT_SECRET],
    ["Contrasena del correo", process.env.SMTP_PASSWORD],
    ["Token de Drive", process.env.GOOGLE_DRIVE_REFRESH_TOKEN],
    ["Clave de sesiones", process.env.NEXTAUTH_SECRET],
    ["Cadena de la base de datos", process.env.DATABASE_URL]
  ] as const;

  return lista
    .filter(([, v]) => v && v.length > 8)
    .map(([nombre, valor]) => ({ nombre, valor: valor as string }));
}

async function descargarTodo(): Promise<{ nombre: string; texto: string }[]> {
  const paginas = ["/", "/es", "/admin/login"];
  const recursos: { nombre: string; texto: string }[] = [];
  const scripts = new Set<string>();

  for (const p of paginas) {
    const res = await fetch(BASE + p);
    const html = await res.text();
    recursos.push({ nombre: `pagina ${p}`, texto: html });

    for (const m of html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)) {
      scripts.add(m[1]);
    }
  }

  for (const s of scripts) {
    const res = await fetch(BASE + s);
    recursos.push({ nombre: `script ${s.split("/").pop()}`, texto: await res.text() });
  }

  return recursos;
}

async function main() {
  console.log(`\nAuditoria de ${BASE}\n`);

  // --- 1. Busqueda de credenciales en todo lo que descarga el navegador ---
  console.log("1. Credenciales en el codigo que llega al navegador");
  const recursos = await descargarTodo();
  const totalKB = Math.round(
    recursos.reduce((s, r) => s + r.texto.length, 0) / 1024
  );
  console.log(`   (revisados ${recursos.length} archivos, ${totalKB} KB)`);

  for (const { nombre, valor } of secretos()) {
    const encontrado = recursos.find((r) => r.texto.includes(valor));
    check(
      `${nombre} no aparece`,
      !encontrado,
      encontrado ? `APARECE EN ${encontrado.nombre}` : ""
    );
  }

  // --- 2. Endpoints que exigen sesion ---
  console.log("\n2. Zonas privadas sin sesion");
  for (const ruta of ["/admin", "/admin/solicitudes", "/admin/inmuebles"]) {
    const res = await fetch(BASE + ruta, { redirect: "manual" });
    check(`${ruta} rechaza`, res.status === 307 || res.status === 302, `HTTP ${res.status}`);
  }

  const exportar = await fetch(`${BASE}/api/admin/solicitudes/export`, { redirect: "manual" });
  check(
    "la exportacion de datos personales rechaza",
    exportar.status === 401,
    `HTTP ${exportar.status}`
  );

  // --- 3. Endpoints publicos con credencial ---
  console.log("\n3. Endpoints publicos con credencial propia");

  const importar = await fetch(`${BASE}/api/admin/idealista/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "x".repeat(40), listings: [{ idealistaId: "1", title: "x" }] })
  });
  check("importacion con credencial falsa rechaza", importar.status === 401, `HTTP ${importar.status}`);

  const subida = await fetch(`${BASE}/api/upload/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationId: "inventado",
      ticket: "billete-falso-suficientemente-largo",
      fileName: "x.pdf",
      mimeType: "application/pdf",
      sizeBytes: 100
    })
  });
  check("subida con permiso falso rechaza", subida.status === 403, `HTTP ${subida.status}`);

  const conciliar = await fetch(`${BASE}/api/upload/reconcile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId: "inventado", ticket: "billete-falso-largo-de-verdad" })
  });
  check("comprobacion de subida rechaza", conciliar.status === 403, `HTTP ${conciliar.status}`);

  // --- 4. Enlaces de documentacion ---
  console.log("\n4. Enlaces de documentacion de candidatos");
  const doc = await fetch(`${BASE}/documentos/token-inventado-al-azar`);
  const docTexto = await doc.text();
  check("un enlace inventado no da acceso", !docTexto.includes("Enviar documentos"));
  check(
    "no revela si el enlace existe o no",
    docTexto.includes("ya no est") || docTexto.includes("no est"),
    "mismo mensaje para inexistente y cancelado"
  );

  // --- 5. Autorizacion de Drive cerrada en produccion ---
  console.log("\n5. Rutas de mantenimiento");
  const drive = await fetch(`${BASE}/api/google/drive/authorize`, { redirect: "manual" });
  check(
    "la autorizacion de Drive no esta abierta",
    drive.status === 404 || drive.status === 307 || drive.status === 302,
    `HTTP ${drive.status}`
  );

  // --- 6. Cabeceras ---
  console.log("\n6. Cabeceras de proteccion");
  const cab = (await fetch(`${BASE}/es`)).headers;
  check("no anuncia la tecnologia", !cab.get("x-powered-by"));
  check("no se puede meter en un iframe ajeno", cab.get("x-frame-options") === "SAMEORIGIN");
  check("no adivina tipos de archivo", cab.get("x-content-type-options") === "nosniff");

  const cabAdmin = (await fetch(`${BASE}/admin/login`)).headers;
  check(
    "el panel no se cachea",
    (cabAdmin.get("cache-control") ?? "").includes("no-store")
  );
  check(
    "el panel no lo indexa Google",
    (cabAdmin.get("x-robots-tag") ?? "").includes("noindex")
  );

  console.log(
    fallos === 0
      ? "\nSin hallazgos. Ninguna credencial expuesta.\n"
      : `\n${fallos} comprobacion(es) fallida(s). Revisar.\n`
  );
  if (fallos > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
