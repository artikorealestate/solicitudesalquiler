# Artiko Interesados - Diseno de Producto

Fecha: 2026-08-13

## Objetivo

Construir una app completa para gestionar interesados en inmuebles de Artiko Real Estate, separando procesos de alquiler y compra, con formulario publico multidioma, panel privado para administradores, organizacion automatica de documentos en Google Drive y notificaciones por email.

La app sustituira el formulario HTML estatico actual y el flujo simple de Google Apps Script por una experiencia mas profesional, mantenible y preparada para crecer.

## Alcance De La Primera Version

La primera version debe resolver estos puntos:

- Formulario publico para interesados sin login.
- Selector de idioma: espanol, ingles, aleman, frances, ruso, ucraniano, neerlandes, portugues e italiano.
- Selector de operacion: alquiler o compra.
- Seleccion de inmueble desde una lista de inmuebles activos.
- Preguntas adaptadas segun alquiler o compra.
- Subida de documentos.
- Guardado ordenado de documentos en Google Drive.
- Panel privado para administradores con login de Google/Gmail.
- Gestion de inmuebles desde el panel privado.
- Vista de interesados por inmueble y por tipo de operacion.
- Estados internos para seguimiento.
- Email automatico al interesado confirmando recepcion.
- Email automatico a Artiko avisando de una nueva solicitud.
- Exportacion a CSV o Excel desde el panel.

## Fuera De Alcance Inicial

Para mantener la primera version controlada, no se incluira al inicio:

- Scraping automatico completo de Idealista.
- Login para interesados.
- Chat interno con interesados.
- Firma digital de contratos.
- Analisis automatico avanzado de documentos.
- Integraciones con WhatsApp.

Estas funciones podran anadirse despues si el uso real de la app lo justifica.

## Arquitectura Recomendada

La app se construira como aplicacion web full-stack:

- Frontend y backend: Next.js.
- Hosting: Vercel.
- Login admin: Google OAuth.
- Base de datos: Postgres gestionado, recomendado Supabase o Neon.
- Documentos: Google Drive.
- Emails: Gmail API o proveedor SMTP autorizado.

Google Drive se mantiene como almacen principal de documentos porque Artiko ya lo usa para revisar, analizar, descargar, compartir y enviar archivos.

La base de datos guardara la informacion estructurada: inmuebles, solicitudes, interesados, respuestas, estados, idioma, enlaces a carpetas de Drive y enlaces a archivos. Drive guardara los documentos pesados y la estructura visual de carpetas.

## Modelo De Datos

### Administradores

Campos principales:

- email
- nombre
- rol
- activo
- fecha de alta

Solo podran entrar emails incluidos como administradores activos.

### Inmuebles

Campos principales:

- referencia interna
- titulo
- tipo de operacion: alquiler, compra o ambas
- zona
- calle o direccion aproximada
- precio de alquiler
- precio de compra
- url de Idealista
- imagen principal
- imagenes adicionales
- estado: activo, pausado, archivado
- notas internas
- fecha de creacion
- fecha de actualizacion

La URL de Idealista se guardara como referencia y enlace externo. En la primera version, la app no dependera de extraer datos automaticamente desde Idealista.

### Solicitudes

Campos comunes:

- tipo de operacion
- idioma elegido
- inmueble
- nombre
- apellidos
- email
- telefono
- nacionalidad
- documento de identidad
- respuestas del formulario
- estado interno
- carpeta de Google Drive
- enlaces de documentos
- consentimiento RGPD
- autorizacion para compartir con propietario
- fecha de envio

Estados recomendados:

- nuevo
- revisando
- pendiente de documentacion
- valido
- descartado
- visita propuesta
- visitado
- oferta
- reservado
- cerrado

## Estructura En Google Drive

La app creara o reutilizara carpetas con esta estructura:

```text
Clientes interesados
Clientes interesados / Alquiler
Clientes interesados / Compra
Clientes interesados / Alquiler / [Referencia inmueble - titulo]
Clientes interesados / Compra / [Referencia inmueble - titulo]
Clientes interesados / [Operacion] / [Inmueble] / [Fecha - Nombre Apellidos]
```

Dentro de cada carpeta de interesado se guardaran:

- Documentos subidos por el interesado.
- Un resumen en PDF o Google Doc con las respuestas del formulario.

La app usara una funcion de tipo "obtener o crear carpeta" para evitar duplicados en las carpetas principales y en las carpetas de inmueble.

## Formulario Publico

El interesado no necesita crear cuenta ni iniciar sesion.

Flujo:

1. Elegir idioma.
2. Elegir operacion: alquiler o compra.
3. Elegir inmueble activo.
4. Completar datos personales.
5. Responder preguntas especificas de alquiler o compra.
6. Adjuntar documentos.
7. Aceptar proteccion de datos y autorizacion para compartir con propietario.
8. Revisar resumen y enviar.

### Preguntas Comunes

- Nombre.
- Apellidos.
- Email.
- Telefono.
- Nacionalidad.
- DNI, NIE o pasaporte.
- Inmueble de interes.
- Comentario adicional opcional.

### Preguntas De Alquiler

- Cuantas personas vivirian en la vivienda.
- Relacion entre las personas.
- Fecha deseada de entrada.
- Profesion o dedicacion actual.
- Tipo de contrato o situacion laboral.
- Si los ingresos son demostrables mediante nominas o documentacion equivalente.
- Ingresos netos mensuales demostrables del grupo.
- Si superan el importe recomendado de solvencia.
- Mascotas.
- Tiempo buscando vivienda de alquiler.
- Si han visitado otras viviendas.
- Documentacion disponible.

Si el inmueble tiene precio de alquiler, la app podra mostrar el criterio de solvencia recomendado: que el alquiler no supere aproximadamente el 30% de los ingresos netos demostrables del grupo.

### Preguntas De Compra

- Quienes realizarian la compra y cual es su perfil.
- Tiempo buscando vivienda.
- Numero aproximado de viviendas visitadas.
- Si han realizado alguna oferta.
- Si necesitan vender otro inmueble para comprar.
- Si necesitan financiacion.
- Si tienen financiacion preaprobada.
- Si es primera compra o conocen el proceso.
- Profesion o dedicacion actual.
- Comentario adicional opcional.

## Panel Privado

El panel sera accesible solo para administradores mediante Google/Gmail.

Vistas principales:

- Dashboard con solicitudes recientes.
- Inmuebles.
- Solicitudes.
- Detalle de solicitud.
- Configuracion.

### Gestion De Inmuebles

Los administradores podran:

- Crear inmuebles.
- Editar referencia, titulo, zona, precio y URL de Idealista.
- Subir imagen principal y adicionales.
- Marcar inmueble como activo, pausado o archivado.
- Definir si es alquiler, compra o ambas.

### Gestion De Solicitudes

Los administradores podran:

- Ver solicitudes por tipo, inmueble, estado y fecha.
- Abrir la carpeta de Drive.
- Abrir archivos concretos.
- Cambiar estado interno.
- Anadir notas internas.
- Exportar resultados.

## Emails

### Email Al Interesado

Se enviara automaticamente despues de recibir la solicitud.

Debe enviarse en el idioma elegido por el interesado.

Contenido:

- Confirmacion de recepcion.
- Nombre o referencia del inmueble.
- Tipo de operacion.
- Mensaje de que Artiko revisara la informacion y contactara en los proximos dias si el perfil encaja.
- Datos de contacto de Artiko.

### Email Interno A Artiko

Se enviara a una o varias direcciones internas.

Contenido:

- Nueva solicitud recibida.
- Tipo de operacion.
- Inmueble.
- Nombre del interesado.
- Email y telefono.
- Resumen de respuestas clave.
- Enlace a la solicitud en el panel.
- Enlace a carpeta de Google Drive.

## Multidioma

La app mantendra los textos de interfaz, preguntas, ayudas, errores y emails en archivos de traduccion por idioma.

Idiomas iniciales:

- es: espanol.
- en: ingles.
- de: aleman.
- fr: frances.
- ru: ruso.
- uk: ucraniano.
- nl: neerlandes.
- pt: portugues.
- it: italiano.

El panel admin puede empezar solo en espanol. La parte publica y los emails del interesado deben estar traducidos desde la primera version.

## Experiencia De Usuario

La parte publica debe sentirse clara y amable:

- Formulario por pasos.
- Progreso visible.
- Preguntas cortas y concretas.
- Solo mostrar las preguntas necesarias.
- Errores junto al campo correspondiente.
- Guardar estado local del formulario mientras se rellena para evitar perdida accidental.
- Confirmacion final antes de enviar.

El panel admin debe sentirse operativo:

- Tablas densas pero legibles.
- Filtros rapidos.
- Acciones claras.
- Enlaces directos a Drive y al inmueble.
- Estados visibles.

## Seguridad Y Privacidad

- El interesado no accede al panel ni a documentos despues de enviar.
- Los documentos no se exponen publicamente.
- Los enlaces de Drive se guardan para administradores.
- El login admin se restringe por lista de emails autorizados.
- Los secretos de Google, base de datos y email viviran en variables de entorno, nunca en el repositorio.
- La app registrara consentimientos RGPD junto a fecha, idioma y version del texto aceptado.

## Estrategia De Migracion

El HTML actual se conserva como referencia visual y de contenido, pero la nueva app se construira sobre una estructura Next.js.

La URL publica podra seguir siendo la misma cuando se despliegue en Vercel.

El Apps Script actual queda sustituido por endpoints backend propios. Si se decide mantener Google Sheets como espejo, la app podra escribir una fila adicional en una hoja, pero la base de datos sera la fuente principal.

## Criterios De Exito

La version inicial se considera lista cuando:

- Un interesado puede completar una solicitud de alquiler en cualquiera de los idiomas soportados.
- Un interesado puede completar una solicitud de compra en cualquiera de los idiomas soportados.
- La solicitud se guarda con inmueble, tipo, respuestas y estado.
- Los documentos se guardan en la estructura correcta de Google Drive.
- Artiko recibe email interno.
- El interesado recibe email de confirmacion en su idioma.
- Un administrador puede entrar con Gmail.
- Un administrador puede crear y editar inmuebles.
- Un administrador puede revisar solicitudes y abrir documentos.
- La app funciona correctamente en movil y escritorio.
