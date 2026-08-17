/// Textos del formulario publico en espanol.
///
/// Este archivo es la referencia: el tipo Dictionary se deriva de el, asi que
/// cualquier idioma al que le falte una clave dara error de compilacion en
/// lugar de mostrar un hueco en blanco al interesado.
///
/// Los textos legales llevan version. Si se cambia el texto de un
/// consentimiento hay que subir la version, porque guardamos junto a cada
/// solicitud el texto exacto que la persona acepto.
export const es = {
  meta: {
    languageName: "Español"
  },

  chooser: {
    eyebrow: "Solicitud de información",
    title: "¿En qué idioma prefieres continuar?",
    subtitle:
      "Elige tu idioma para rellenar la solicitud. Podrás cambiarlo en cualquier momento.",
    continueIn: "Continuar en español"
  },

  common: {
    next: "Continuar",
    back: "Atrás",
    submit: "Enviar solicitud",
    sending: "Enviando…",
    optional: "opcional",
    required: "obligatorio",
    yes: "Sí",
    no: "No",
    stepOf: "Paso {current} de {total}",
    changeLanguage: "Cambiar idioma",
    selectPlaceholder: "Selecciona una opción"
  },

  steps: {
    operation: "Operación",
    property: "Inmueble",
    personal: "Tus datos",
    questions: "Tu situación",
    documents: "Documentación",
    consent: "Protección de datos",
    review: "Resumen"
  },

  operation: {
    title: "¿Qué te interesa?",
    subtitle: "Las preguntas se adaptan según lo que elijas.",
    rent: {
      label: "Alquilar una vivienda",
      description: "Quiero alquilar uno de los inmuebles disponibles"
    },
    sale: {
      label: "Comprar una vivienda",
      description: "Quiero comprar uno de los inmuebles en venta"
    }
  },

  property: {
    title: "¿Qué inmueble te interesa?",
    subtitle: "Estos son los inmuebles disponibles ahora mismo.",
    empty:
      "En este momento no hay inmuebles disponibles para esta operación. Vuelve a intentarlo en unos días.",
    perMonth: "/mes",
    viewOnIdealista: "Ver el anuncio completo",
    selected: "Seleccionado"
  },

  personal: {
    title: "Tus datos de contacto",
    subtitle: "Los necesitamos para poder responderte.",
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Correo electrónico",
    phone: "Teléfono",
    nationality: "Nacionalidad",
    idDocument: "DNI, NIE o pasaporte",
    idDocumentHint: "Nos ayuda a preparar la documentación del contrato."
  },

  rentQuestions: {
    title: "Cuéntanos tu situación",
    subtitle:
      "Esta información nos permite valorar si el inmueble encaja con lo que necesitas.",

    householdSize: "¿Cuántas personas viviríais en la vivienda?",
    relationship: "¿Qué relación hay entre vosotros?",
    relationshipOptions: {
      couple: "Pareja",
      family: "Familia",
      flatmates: "Compañeros de piso",
      alone: "Viviría solo o sola",
      other: "Otra"
    },

    moveInDate: "¿Para qué fecha necesitaríais entrar?",
    occupation: "¿A qué os dedicáis actualmente?",

    employmentType: "¿Qué tipo de contrato o situación laboral tenéis?",
    employmentOptions: {
      permanent: "Contrato indefinido",
      temporary: "Contrato temporal",
      selfEmployed: "Autónomo",
      civilServant: "Funcionario",
      retired: "Jubilado o pensionista",
      student: "Estudiante",
      unemployed: "Sin empleo actualmente",
      other: "Otra situación"
    },

    provableIncome: "¿Los ingresos son demostrables con nóminas o documentación equivalente?",
    monthlyIncome: "¿Cuál es el ingreso neto mensual del grupo? (€)",

    solvencyHelp:
      "El criterio habitual de solvencia es que el alquiler no supere aproximadamente el 30% de los ingresos netos demostrables del grupo.",
    solvencyForProperty:
      "Para este inmueble, de {rent} € al mes, eso supondría unos {recommended} € netos mensuales entre todos.",
    solvencyMet:
      "Con lo que has indicado, cumplís el criterio habitual de solvencia.",
    solvencyNotMet:
      "Queda por debajo del criterio habitual. Puedes continuar igualmente: lo valoraremos con el resto de la información.",

    pets: "¿Tenéis mascotas?",
    petsDetail: "¿Cuáles?",
    searchDuration: "¿Cuánto tiempo lleváis buscando vivienda de alquiler?",
    searchDurationOptions: {
      justStarted: "Acabamos de empezar",
      lessThanMonth: "Menos de un mes",
      oneToThree: "Entre uno y tres meses",
      moreThanThree: "Más de tres meses"
    },

    visitedOthers: "¿Habéis visitado ya otras viviendas?",
    documentsReady: "¿Tenéis la documentación preparada?",
    documentsReadyOptions: {
      yes: "Sí, la tenemos lista",
      partly: "En parte",
      no: "Todavía no"
    }
  },

  saleQuestions: {
    title: "Cuéntanos tu situación",
    subtitle:
      "Esta información nos ayuda a acompañarte mejor durante el proceso de compra.",

    buyerProfile: "¿Quiénes realizaríais la compra y cuál es vuestro perfil?",
    buyerProfileHint:
      "Por ejemplo: pareja joven, familia con hijos, inversor, segunda residencia…",

    searchDuration: "¿Cuánto tiempo lleváis buscando vivienda?",
    searchDurationOptions: {
      justStarted: "Acabamos de empezar",
      lessThanThree: "Menos de tres meses",
      threeToTwelve: "Entre tres meses y un año",
      moreThanYear: "Más de un año"
    },

    propertiesVisited: "¿Cuántas viviendas habéis visitado aproximadamente?",
    madeOffer: "¿Habéis realizado ya alguna oferta?",
    needToSell: "¿Necesitáis vender otro inmueble para poder comprar?",
    needsFinancing: "¿Necesitáis financiación?",
    financingApproved: "¿La tenéis ya preaprobada?",
    financingApprovedHint:
      "Tener la financiación preaprobada agiliza mucho la operación.",

    firstPurchase: "¿Es vuestra primera compra?",
    firstPurchaseOptions: {
      first: "Sí, es nuestra primera compra",
      experienced: "No, ya conocemos el proceso de compraventa"
    },

    occupation: "¿A qué os dedicáis actualmente?"
  },

  documents: {
    title: "Documentación",
    subtitleRent:
      "Adjuntar documentación acelera mucho la respuesta. Puedes enviarla ahora o más adelante.",
    subtitleSale:
      "Si tienes documentación relevante puedes adjuntarla. No es obligatorio.",
    addFiles: "Añadir archivos",
    dropHint: "Arrastra los archivos aquí o pulsa para seleccionarlos",
    accepted: "Se aceptan PDF e imágenes, hasta 10 MB por archivo.",
    remove: "Quitar",
    suggestionsRent: "Documentación habitual para alquiler:",
    suggestionsRentList: [
      "Últimas nóminas o justificantes de ingresos",
      "Contrato de trabajo",
      "DNI, NIE o pasaporte",
      "Última declaración de la renta (si eres autónomo)"
    ],
    skip: "Continuar sin adjuntar nada",
    tooLarge: "«{name}» ocupa más de 10 MB y no se puede adjuntar.",
    wrongType: "«{name}» no es un tipo de archivo admitido.",
    uploading: "Subiendo documento {current} de {total}…",
    /// Aviso durante la subida. Sin él, mucha gente cierra la pestaña al ver
    /// que tarda y pierde los documentos.
    uploadWait:
      "No cierres esta página mientras se suben los archivos. Te avisaremos en cuanto la solicitud esté enviada.",
    uploadPartial:
      "Tu solicitud se ha enviado correctamente, pero {count} documento(s) no se han podido subir. Nos pondremos en contacto contigo para pedírtelos.",
    uploadUnavailable:
      "Tu solicitud se ha enviado correctamente. Te pediremos la documentación por correo."
  },

  comment: {
    label: "¿Quieres añadir algo más?",
    placeholder: "Cualquier cosa que creas que deberíamos saber…"
  },

  consent: {
    title: "Protección de datos",
    subtitle: "Antes de enviar, necesitamos tu confirmación.",

    gdprVersion: "2026-08-rgpd-v3",
    gdprText:
      "Acepto que INMOARTIKO SL (CIF B56527930), con domicilio social en Sagunto (Valencia), trate mis datos personales y la documentación aportada con la finalidad de gestionar mi solicitud de información sobre el inmueble seleccionado. Podré ejercer mis derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@artikore.com.",

    ownerVersion: "2026-08-propietario-v2",
    ownerText:
      "Autorizo a INMOARTIKO SL a compartir mis datos y la documentación aportada con la propiedad del inmueble, con el único fin de que valore mi candidatura.",

    requiredError: "Necesitamos tu consentimiento para poder tramitar la solicitud."
  },

  review: {
    title: "Revisa tu solicitud",
    subtitle: "Comprueba que todo es correcto antes de enviarla.",
    edit: "Modificar",
    sectionOperation: "Operación",
    sectionProperty: "Inmueble",
    sectionPersonal: "Tus datos",
    sectionQuestions: "Tu situación",
    sectionDocuments: "Documentación",
    noDocuments: "Sin documentos adjuntos",
    documentCount: "{count} archivo(s) adjunto(s)"
  },

  success: {
    title: "Hemos recibido tu solicitud",
    body: "Gracias por tu interés en {property}. Revisaremos la información y nos pondremos en contacto contigo en los próximos días.",
    emailSent: "Te hemos enviado una confirmación a {email}.",
    signature: "Artiko Real Estate"
  },

  /// Correo de confirmación al interesado. Va en SU idioma.
  email: {
    subject: "Hemos recibido tu solicitud · Artiko Real Estate",
    greeting: "Hola {name}:",
    received:
      "Gracias por tu interés. Hemos recibido correctamente tu solicitud de {operation} para el siguiente inmueble:",
    operationRent: "alquiler",
    operationSale: "compra",
    nextSteps:
      "Revisaremos la información que nos has enviado y nos pondremos en contacto contigo en los próximos días si tu perfil encaja con lo que busca la propiedad.",
    documentsPending:
      "Si no has podido adjuntar toda la documentación, no te preocupes: te la pediremos si hace falta.",
    noReply:
      "Este mensaje se ha generado automáticamente. Puedes responder a este correo si necesitas contarnos algo más.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    /// Invitación al canal personal. Va en los correos al interesado para que
    /// el trato directo ocurra por WhatsApp y no en la bandeja de trabajo.
    personalTouch: "¿Prefieres hablarlo con una persona?",
    whatsappCta: "Escríbenos por WhatsApp",
    visitWebsite: "Ver nuestras viviendas"
  },

  /// Petición de documentación a un candidato ya preseleccionado.
  ///
  /// Los documentos se nombran por lo que son, no por su nombre español: buena
  /// parte de los interesados de Artiko viene de fuera y no tiene "vida
  /// laboral" ni presenta el "modelo 130". El nombre oficial español se añade
  /// aparte, entre paréntesis, porque quien vive aquí sí necesita pedirlo así.
  docs: {
    eyebrow: "Documentación",
    greeting: "Hola, {name}",
    intro:
      "Tu solicitud para {property} sigue adelante. Solo nos falta revisar unos documentos.",
    weNeed: "Lo que necesitamos",

    /// El mensaje que resuelve el caso de quien no vive o no ha trabajado en España.
    abroadNote:
      "Si trabajas o has vivido fuera de España, envíanos el documento equivalente de tu país. No pasa nada si está en otro idioma: si necesitamos una traducción, te la pediremos.",
    spanishNameLabel: "en España:",

    alreadySent: "Ya nos has enviado",
    addFiles: "Añadir archivos",
    dropHint: "Arrastra aquí tus documentos o pulsa para seleccionarlos",
    accepted:
      "PDF e imágenes, hasta 10 MB por archivo. Una foto nítida del documento vale.",
    remove: "Quitar",
    send: "Enviar documentación",
    sending: "Subiendo…",

    successTitle: "Documentación recibida",
    successBody:
      "Gracias. Ya la estamos revisando y te diremos algo en los próximos días.",
    successPartial:
      "{count} archivo(s) no se han podido subir. Vuelve a abrir el enlace del correo e inténtalo otra vez.",
    uploadMore: "Subir algo más",
    sessionExpired:
      "La sesión ha caducado por seguridad. Recarga esta página y vuelve a intentarlo; no se ha perdido nada.",

    unavailableTitle: "Este enlace ya no está disponible",
    unavailableBody:
      "Puede que hayamos enviado uno más reciente. Revisa tu correo o escríbenos y te lo reenviamos.",
    expiredTitle: "El enlace ha caducado",
    expiredBody:
      "Por seguridad estos enlaces duran un tiempo limitado. Escríbenos y te mandamos uno nuevo enseguida.",
    completedTitle: "Ya hemos recibido tu documentación",
    completedBody:
      "Gracias. La estamos revisando y te diremos algo en los próximos días.",

    emailSubject: "Documentación para {property} · Artiko Real Estate",
    emailIntro:
      "Gracias por tu interés. Tu solicitud encaja con lo que buscamos, así que el siguiente paso es revisar la documentación.",
    emailCta: "Subir mi documentación",
    emailExpiry:
      "El enlace es personal y caduca el {date}. No hace falta que lo subas todo de una vez: puedes volver a entrar.",

    /// Nombres de los documentos.
    items: {
      id: "Documento de identidad (DNI, pasaporte o equivalente)",
      nie: "Número de identidad de extranjero",
      residencePermit: "Permiso de residencia o de trabajo",
      incomeProof: "Justificantes de tus ingresos de los últimos tres meses",
      employmentContract: "Contrato de trabajo o carta de tu empresa",
      workHistory: "Historial laboral o certificado de antigüedad",
      taxReturn: "Última declaración de impuestos",
      selfEmployedProof: "Justificante de tu actividad por cuenta propia",
      quarterlyTax: "Últimas declaraciones trimestrales de impuestos",
      pensionProof: "Justificante o certificado de tu pensión",
      companyDocs: "Escritura de constitución y poderes de la sociedad",
      representativeId: "Documento de identidad de quien firmará",
      companyAccounts: "Últimas cuentas anuales o impuesto de sociedades",
      guarantorDocuments: "Documentación del avalista",
      other: "Otra documentación"
    }
  },

  /// Pie del formulario público. Quien entrega su DNI y sus nóminas tiene
  /// derecho a saber a quién se los está dando: es confianza, y además el
  /// RGPD exige identificar a la empresa que trata los datos.
  footer: {
    agency: "Agencia inmobiliaria en Valencia",
    website: "Conócenos en artikore.com",
    questionsLabel: "¿Tienes dudas antes de enviar?",
    contact: "Escríbenos a",
    whatsapp: "Escríbenos por WhatsApp"
  },

  errors: {
    required: "Este campo es obligatorio",
    invalidEmail: "Escribe un correo electrónico válido",
    invalidPhone: "Escribe un teléfono válido",
    invalidNumber: "Escribe solo números",
    selectProperty: "Elige un inmueble para continuar",
    selectOperation: "Elige alquiler o compra para continuar",
    submitFailed:
      "No hemos podido enviar la solicitud. Comprueba tu conexión y vuelve a intentarlo.",
    fixFields: "Revisa los campos marcados antes de continuar.",
    tooManySubmissions:
      "Has enviado varias solicitudes en poco tiempo. Espera un rato y vuelve a intentarlo, o escríbenos por WhatsApp."
  }
};

/// El tipo sale del diccionario espanol, que es la referencia. Si a una
/// traduccion le falta una clave, el compilador lo dice antes de que un
/// interesado se encuentre un hueco en blanco.
export type Dictionary = typeof es;
