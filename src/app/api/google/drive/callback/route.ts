import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resetTokenCache } from "@/lib/google/auth";

/// Recibe el codigo de Google y lo canjea por un refresh token, que guarda
/// directamente en .env.
///
/// Se escribe en el archivo en lugar de mostrarlo en pantalla para que la
/// credencial no acabe en el historial del navegador ni en una captura.

function htmlPage(title: string, body: string, tone: "ok" | "error") {
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
     <title>${title}</title>
     <style>
       body{font-family:system-ui,sans-serif;background:#F7F5F2;color:#334155;
            display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px}
       .card{background:#fff;border:1px solid #E5E1DA;border-left:4px solid ${
         tone === "ok" ? "#CAB269" : "#B44A3F"
       };border-radius:12px;padding:32px;max-width:520px;line-height:1.6}
       h1{font-family:Georgia,serif;font-weight:400;color:#343434;margin:0 0 12px}
       a{color:#A8914F}
       code{background:#F0ECE6;padding:2px 6px;border-radius:4px;font-size:13px}
     </style></head>
     <body><div class="card"><h1>${title}</h1>${body}</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function saveRefreshToken(token: string) {
  const envPath = resolve(process.cwd(), ".env");
  const current = await readFile(envPath, "utf8");

  const line = `GOOGLE_DRIVE_REFRESH_TOKEN="${token}"`;
  const updated = /^GOOGLE_DRIVE_REFRESH_TOKEN=.*$/m.test(current)
    ? current.replace(/^GOOGLE_DRIVE_REFRESH_TOKEN=.*$/m, line)
    : `${current.trimEnd()}\n${line}\n`;

  await writeFile(envPath, updated, "utf8");
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return htmlPage(
      "No se ha completado la autorizacion",
      `<p>Google ha devuelto: <code>${error ?? "sin codigo"}</code></p>
       <p><a href="/admin/inmuebles">Volver al panel</a></p>`,
      "error"
    );
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: new URL("/api/google/drive/callback", request.url).toString(),
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    return htmlPage(
      "Google ha rechazado el canje",
      `<p>Respuesta: <code>${response.status}</code></p><p>${detail}</p>`,
      "error"
    );
  }

  const body = (await response.json()) as { refresh_token?: string };

  if (!body.refresh_token) {
    return htmlPage(
      "Google no ha devuelto un token permanente",
      `<p>Suele pasar cuando la cuenta ya habia autorizado la aplicacion antes.
          Entra en <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">
          los permisos de tu cuenta de Google</a>, retira el acceso de
          "Artiko Interesados" y vuelve a intentarlo.</p>`,
      "error"
    );
  }

  await saveRefreshToken(body.refresh_token);
  resetTokenCache();

  return htmlPage(
    "Google Drive conectado",
    `<p>El acceso ha quedado guardado en el archivo <code>.env</code>.
        A partir de ahora la app puede crear las carpetas de
        "Clientes interesados" y guardar la documentacion.</p>
     <p>Reinicia el servidor de desarrollo para que lea el nuevo valor.</p>
     <p><a href="/admin/inmuebles">Volver al panel</a></p>`,
    "ok"
  );
}
