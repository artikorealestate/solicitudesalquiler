# Registro de incidentes de seguridad

Artículo 33.5 del RGPD: hay que documentar **todas** las violaciones de
seguridad de los datos personales, también las que no se comunican a la
Agencia Española de Protección de Datos. Una violación no es solo una
filtración: también lo es perder el acceso a los datos (disponibilidad).

Plazo para comunicarlas a la AEPD cuando hay riesgo para las personas:
**72 horas** desde que se conocen (sede.aepd.gob.es).

---

## 2026-09 · Base de datos no disponible

| | |
|---|---|
| **Detectado** | 22/09/2026, por un administrador al no cargar el panel. |
| **Duración estimada** | Del 16/09/2026 al 22/09/2026. |
| **Qué pasó** | El proveedor de la base de datos (Supabase, plan gratuito) pausó el proyecto por una semana sin actividad. La aplicación no podía leer ni escribir datos. |
| **Datos afectados** | Ninguno perdido, alterado ni expuesto. Fue una pérdida temporal de disponibilidad. Al reactivar el proyecto, todos los datos estaban intactos. |
| **Personas afectadas** | Interesados que intentaron enviar una solicitud en esas fechas: vieron un error y no pudieron enviarla. No es posible saber cuántos. |
| **Riesgo para las personas** | Bajo: no hubo acceso indebido ni pérdida de datos. Consecuencia práctica: no poder presentar la solicitud. |
| **¿Se comunica a la AEPD?** | No: sin riesgo para los derechos y libertades de las personas. Se documenta aquí. |
| **¿Se comunica a los afectados?** | No procede (no hay datos comprometidos). |
| **Medidas tomadas** | Reactivación del proyecto (22/09). Consulta diaria que impide que vuelva a pausarse. Aviso por correo a info@artikore.com si la base de datos no responde. Vigilancia horaria externa. Pantalla de error amable en lugar del error técnico. |
