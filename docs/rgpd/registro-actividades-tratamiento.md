# Registro de actividades de tratamiento

**Borrador para revisar con el asesor jurídico.** Artículo 30 del RGPD.
Responsable: INMOARTIKO SL · CIF B56527930 · C/ Numancia 6, 2-5, 46500 Sagunto (Valencia) · info@artikore.com
Última revisión: octubre de 2026.

Las empresas de menos de 250 trabajadores solo están exentas de llevar este
registro si el tratamiento es ocasional. Gestionar candidatos a alquiler y
compra es la actividad diaria de Artiko, así que **hay que tenerlo**.

---

## Actividad: gestión de interesados en inmuebles (Artiko Interesados)

| | |
|---|---|
| **Finalidad** | Recibir y gestionar solicitudes de alquiler y compra; valorar candidaturas (incluida una orientación de solvencia); presentarlas a la propiedad; preparar el contrato si sigue adelante. |
| **Base jurídica** | Medidas precontractuales a petición del interesado (art. 6.1.b). Bolsa de candidatos: consentimiento (art. 6.1.a). Protección del formulario frente a abusos: interés legítimo (art. 6.1.f). Expediente de operaciones cerradas: obligación legal (art. 6.1.c). |
| **Interesados** | Personas que solicitan alquilar o comprar un inmueble a través del formulario. |
| **Categorías de datos** | Identificación y contacto (nombre, email, teléfono, nacionalidad, nº de documento de identidad). Situación personal y económica declarada (convivientes, ocupación, situación laboral, ingresos, mascotas, fechas y motivo de estancia; en compras, financiación). Documentación aportada (identidad, nóminas, contratos, declaraciones fiscales…). Huella cifrada de la IP. |
| **Categorías especiales** | No se solicitan. Riesgo residual: una nómina puede mostrar cuota sindical. La información al interesado le invita a taparla. |
| **Destinatarios** | Propiedad del inmueble (informe de perfil sin contacto ni nº de documento; documentación concreta solo si hace falta para decidir). Encargados: Google (Drive y Gmail), Supabase (base de datos, Irlanda), Vercel (servidor, Irlanda). Autoridades cuando lo exija la ley. |
| **Transferencias internacionales** | Google y Vercel son empresas de EE. UU.; Supabase también tiene matriz estadounidense. Mecanismo: Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo. **Pendiente: verificar el mecanismo de cada proveedor y firmar/aceptar sus contratos de encargado (ver abajo).** |
| **Plazos de conservación** | Sin operación: borrado automático 3 meses después de la última gestión. Bolsa de candidatos: 12 meses. Reservas y operaciones cerradas: no se borran automáticamente; pasan al expediente de la operación con los plazos legales que correspondan (fiscales, mercantiles; en compraventas, 10 años para la identificación según la normativa de prevención del blanqueo). |
| **Medidas de seguridad** | Conexión cifrada. Documentos en carpetas privadas de Drive sin compartir. Panel solo para administradores autorizados con inicio de sesión de Google y lista cerrada de correos. IP cifrada en un solo sentido. Servidor y base de datos en la UE. Borrado automático diario con aviso previo de 14 días y constancia sin datos personales. Vigilancia de disponibilidad. |

---

## Puntos abiertos para el asesor

1. **Cuenta personal de Google.** Los documentos están en Drive de una cuenta
   @gmail.com, no de Google Workspace. Con una cuenta personal, Google no firma
   el contrato de encargado del tratamiento del artículo 28. Artiko ha decidido
   no pasar a Workspace; conviene que el asesor valore ese riesgo.
2. **Contratos de encargado con Supabase y Vercel** (comprobado en octubre de 2026):
   - **Vercel:** su DPA solo cubre los planes Pro y Enterprise, y entra en
     vigor al contratarlos. Además, el plan gratuito (Hobby) está restringido
     a uso personal no comercial: una aplicación de una inmobiliaria necesita
     Pro (20 $/mes por puesto de desarrollador). Sin Pro no hay DPA y Vercel
     puede pausar el proyecto por incumplir sus condiciones.
   - **Supabase:** su DPA "forma parte" de sus Términos de Servicio, así que
     rige desde que se aceptaron. Para tener una copia firmada en el
     expediente, se solicita desde el apartado de documentos legales del
     panel de la organización o escribiendo a privacy@supabase.io.
3. **Textos legales en nueve idiomas.** Redactados con cuidado pero no revisados
   por un jurista ni por nativos (sobre todo alemán, ruso y ucraniano).
4. **Delegado de Protección de Datos.** No parece obligatorio por volumen ni
   tipo de datos; confirmarlo.
5. **Evaluación de impacto.** No parece obligatoria (no hay gran escala ni
   categorías especiales). Confirmarlo y dejarlo anotado.
6. **Pedir el DNI a todos desde el primer formulario.** Es defendible porque
   hace falta para el contrato, pero el criterio de minimización favorece
   pedirlo solo a los preseleccionados. Decisión de negocio de Artiko.
