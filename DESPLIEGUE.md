# Despliegue en Vercel

Guía para poner Artiko Interesados en producción. Los valores concretos de
cada credencial están en el archivo `.env` de tu ordenador, que nunca se sube
al repositorio.

## 1. Conectar el repositorio

En [vercel.com](https://vercel.com), entra con la cuenta de Artiko.

**Add New → Project → Import Git Repository** → elige
`artikorealestate/solicitudesalquiler`.

En la configuración de importación:

| Campo | Valor |
|---|---|
| Framework Preset | Next.js (lo detecta solo) |
| Root Directory | `./` |
| Build Command | por defecto |
| Production Branch | `feat/artiko-mvp` mientras pruebas, `main` cuando lo fusiones |

**No pulses Deploy todavía**: primero las variables.

## 2. Variables de entorno

En **Settings → Environment Variables**, añade una por una. Los valores los
copias de tu archivo `.env` local.

### Base de datos

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | Supabase → Connect → ORMs → Prisma |
| `DIRECT_URL` | La misma pantalla, la segunda línea |

### Acceso de administradores

| Variable | Valor |
|---|---|
| `NEXTAUTH_URL` | La URL que te dé Vercel, por ejemplo `https://artiko-interesados.vercel.app` |
| `NEXTAUTH_SECRET` | El de tu `.env` |
| `GOOGLE_CLIENT_ID` | El de tu `.env` |
| `GOOGLE_CLIENT_SECRET` | El de tu `.env` |
| `ADMIN_EMAILS` | Correos autorizados, separados por comas |

### Google Drive

| Variable | Valor |
|---|---|
| `GOOGLE_DRIVE_REFRESH_TOKEN` | El de tu `.env` |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | Déjala vacía: la app usa la raíz de tu Drive |

### Correo

| Variable | Valor |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `artikorealestate@gmail.com` |
| `SMTP_PASSWORD` | La contraseña de aplicación de 16 letras |
| `GMAIL_FROM_ADDRESS` | `Artiko Real Estate <artikorealestate@gmail.com>` |
| `INTERNAL_NOTIFICATION_EMAILS` | `info@artikore.com` |

### Datos públicos

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_APP_URL` | La misma URL de Vercel |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://artikore.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `info@artikore.com` |
| `NEXT_PUBLIC_WHATSAPP` | `34623928734` |
| `NEXT_PUBLIC_WHATSAPP_URGENT` | `34688940806` |

> Las que empiezan por `NEXT_PUBLIC_` viajan al navegador y cualquiera puede
> leerlas. Por eso ahí solo hay datos que ya son públicos. **Ninguna
> contraseña lleva ese prefijo, y no debe llevarlo nunca.**

## 3. Autorizar la URL en Google

Sin esto el login de administradores falla en producción.

En [console.cloud.google.com](https://console.cloud.google.com) →
**APIs y servicios → Credenciales** → tu ID de cliente OAuth, añade a
**URIs de redirección autorizados**:

```
https://TU-URL-DE-VERCEL/api/auth/callback/google
```

Y a **Orígenes autorizados de JavaScript**:

```
https://TU-URL-DE-VERCEL
```

Los cambios en Google pueden tardar unos minutos en aplicarse.

## 4. Desplegar y comprobar

Pulsa **Deploy** y espera. Después repasa esta lista:

- [ ] La portada carga y muestra las nueve banderas
- [ ] Entras al panel con tu cuenta de Google
- [ ] **No** aparece la banda roja de "Drive sin conectar"
- [ ] Los inmuebles activos salen en el formulario público
- [ ] Envías una solicitud de prueba con un documento adjunto
- [ ] Llega el correo de confirmación, ahora **con el logo visible**
- [ ] Llega el aviso interno a `info@artikore.com`
- [ ] El documento aparece en la ficha del panel y en Drive

Cuando todo esto salga bien, borra esa solicitud de prueba desde el panel.

## 5. Dominio propio (opcional)

En **Settings → Domains** puedes apuntar algo como
`solicitudes.artikore.com`. Si lo haces, acuérdate de:

1. Cambiar `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL` al dominio nuevo
2. Añadir también ese dominio a las credenciales de Google del paso 3

## Después del lanzamiento

Queda pendiente, sin prisa pero sin olvidarlo:

- **Borrado automático** de la documentación de candidatos descartados. El
  RGPD no permite guardar nóminas y documentos de identidad indefinidamente.
- **Revisión de los textos legales** por alguien nativo o por vuestro asesor,
  sobre todo en alemán, ruso y ucraniano.

## Comandos útiles

Desde PowerShell, dentro de `C:\dev\artiko-interesados`:

| Comando | Para qué |
|---|---|
| `npm run status` | Estado general: inmuebles, solicitudes y conexiones |
| `npm run inspect:last` | Detalle de la última solicitud recibida |
| `npm run drive:audit` | Todo lo que la app ha creado en Drive, papelera incluida |
| `npm run drive:check` | Comprobar que la conexión con Drive sigue viva |
| `npm run email:preview` | Reenviarte las muestras de los tres correos |
| `npm test` | Ejecutar las 170 pruebas automáticas |
