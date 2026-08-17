import type { Dictionary } from "./es";

export const it: Dictionary = {
  meta: { languageName: "Italiano" },

  chooser: {
    eyebrow: "Modulo di richiesta",
    title: "In quale lingua preferisci continuare?",
    subtitle:
      "Scegli la lingua per compilare il modulo. Potrai cambiarla in qualsiasi momento.",
    continueIn: "Continua in italiano"
  },

  common: {
    next: "Continua",
    back: "Indietro",
    submit: "Invia richiesta",
    sending: "Invio in corso…",
    optional: "facoltativo",
    required: "obbligatorio",
    yes: "Sì",
    no: "No",
    stepOf: "Passo {current} di {total}",
    changeLanguage: "Cambia lingua",
    selectPlaceholder: "Seleziona un'opzione"
  },

  steps: {
    operation: "Richiesta",
    property: "Immobile",
    personal: "I tuoi dati",
    questions: "La tua situazione",
    documents: "Documenti",
    consent: "Protezione dei dati",
    review: "Riepilogo"
  },

  operation: {
    title: "Cosa stai cercando?",
    subtitle: "Le domande cambiano in base alla tua scelta.",
    rent: {
      label: "Affittare una casa",
      description: "Vorrei affittare uno degli immobili disponibili"
    },
    sale: {
      label: "Comprare una casa",
      description: "Vorrei comprare uno degli immobili in vendita"
    }
  },

  property: {
    title: "Quale immobile ti interessa?",
    subtitle: "Questi sono gli immobili disponibili al momento.",
    empty:
      "Al momento non ci sono immobili disponibili per questo tipo di richiesta. Riprova tra qualche giorno.",
    perMonth: "/mese",
    viewOnIdealista: "Vedi l'annuncio completo",
    selected: "Selezionato"
  },

  personal: {
    title: "I tuoi contatti",
    subtitle: "Ci servono per poterti rispondere.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Indirizzo email",
    phone: "Telefono",
    nationality: "Nazionalità",
    idDocument: "Carta d'identità, NIE o passaporto",
    idDocumentHint: "Ci aiuta a preparare la documentazione del contratto."
  },

  rentQuestions: {
    title: "Raccontaci la tua situazione",
    subtitle:
      "Queste informazioni ci permettono di valutare se l'immobile fa al caso tuo.",

    householdSize: "Quante persone vivrebbero nell'immobile?",
    relationship: "Che rapporto c'è tra di voi?",
    relationshipOptions: {
      couple: "Coppia",
      family: "Famiglia",
      flatmates: "Coinquilini",
      alone: "Vivrei da solo o sola",
      other: "Altro"
    },

    moveInDate: "Da quando avreste bisogno di entrare?",
    occupation: "Di cosa ti occupi attualmente?",

    employmentType: "Che tipo di contratto o situazione lavorativa avete?",
    employmentOptions: {
      permanent: "Contratto a tempo indeterminato",
      temporary: "Contratto a tempo determinato",
      selfEmployed: "Lavoratore autonomo",
      civilServant: "Dipendente pubblico",
      retired: "In pensione",
      student: "Studente",
      unemployed: "Attualmente senza lavoro",
      other: "Altra situazione"
    },

    provableIncome:
      "I redditi sono dimostrabili con buste paga o documenti equivalenti?",
    monthlyIncome: "Qual è il reddito netto mensile del nucleo? (€)",

    solvencyHelp:
      "Il criterio abituale è che l'affitto non superi circa il 30% del reddito netto dimostrabile del nucleo.",
    solvencyForProperty:
      "Per questo immobile, da {rent} € al mese, servirebbero circa {recommended} € netti mensili in totale.",
    solvencyMet:
      "In base a quanto hai indicato, rientrate nel criterio abituale.",
    solvencyNotMet:
      "Resta sotto il criterio abituale. Puoi comunque continuare: lo valuteremo insieme al resto delle informazioni.",

    pets: "Avete animali domestici?",
    petsDetail: "Quali?",
    searchDuration: "Da quanto tempo cercate una casa in affitto?",
    searchDurationOptions: {
      justStarted: "Abbiamo appena iniziato",
      lessThanMonth: "Meno di un mese",
      oneToThree: "Tra uno e tre mesi",
      moreThanThree: "Più di tre mesi"
    },

    visitedOthers: "Avete già visitato altre case?",
    documentsReady: "Avete la documentazione pronta?",
    documentsReadyOptions: {
      yes: "Sì, è tutto pronto",
      partly: "In parte",
      no: "Non ancora"
    }
  },

  saleQuestions: {
    title: "Raccontaci la tua situazione",
    subtitle:
      "Queste informazioni ci aiutano ad accompagnarti meglio nell'acquisto.",

    buyerProfile: "Chi effettuerebbe l'acquisto e qual è il vostro profilo?",
    buyerProfileHint:
      "Per esempio: giovane coppia, famiglia con figli, investitore, seconda casa…",

    searchDuration: "Da quanto tempo cercate casa?",
    searchDurationOptions: {
      justStarted: "Abbiamo appena iniziato",
      lessThanThree: "Meno di tre mesi",
      threeToTwelve: "Tra tre mesi e un anno",
      moreThanYear: "Più di un anno"
    },

    propertiesVisited: "Quante case avete visitato all'incirca?",
    madeOffer: "Avete già fatto qualche offerta?",
    needToSell: "Dovete vendere un altro immobile per poter comprare?",
    needsFinancing: "Avete bisogno di un mutuo?",
    financingApproved: "È già stato pre-approvato?",
    financingApprovedHint:
      "Avere il mutuo pre-approvato velocizza molto l'operazione.",

    firstPurchase: "È il vostro primo acquisto?",
    firstPurchaseOptions: {
      first: "Sì, è il nostro primo acquisto",
      experienced: "No, conosciamo già il processo di compravendita"
    },

    occupation: "Di cosa ti occupi attualmente?"
  },

  documents: {
    title: "Documenti",
    subtitleRent:
      "Allegare la documentazione velocizza molto la risposta. Puoi inviarla ora o più avanti.",
    subtitleSale:
      "Se hai documenti utili puoi allegarli. Non è obbligatorio.",
    addFiles: "Aggiungi file",
    dropHint: "Trascina qui i file, oppure clicca per selezionarli",
    accepted: "Si accettano PDF e immagini, fino a 10 MB per file.",
    remove: "Rimuovi",
    suggestionsRent: "Documentazione solitamente richiesta per l'affitto:",
    suggestionsRentList: [
      "Ultime buste paga o giustificativi di reddito",
      "Contratto di lavoro",
      "Carta d'identità, NIE o passaporto",
      "Ultima dichiarazione dei redditi (se lavoratore autonomo)"
    ],
    skip: "Continua senza allegare nulla",
    tooLarge: "«{name}» supera i 10 MB e non può essere allegato.",
    wrongType: "«{name}» non è un tipo di file accettato.",
    uploading: "Caricamento documento {current} di {total}…",
    uploadWait:
      "Non chiudere questa pagina mentre si caricano i file. Ti avviseremo appena la richiesta sarà inviata.",
    uploadPartial:
      "La tua richiesta è stata inviata correttamente, ma {count} documento/i non è stato possibile caricarlo. Ti contatteremo per richiederlo.",
    uploadUnavailable:
      "La tua richiesta è stata inviata correttamente. Ti chiederemo la documentazione via email."
  },

  comment: {
    label: "Vuoi aggiungere altro?",
    placeholder: "Qualsiasi cosa che ritieni utile farci sapere…"
  },

  consent: {
    title: "Protezione dei dati",
    subtitle: "Prima di inviare abbiamo bisogno della tua conferma.",

    gdprVersion: "2026-08-gdpr-it-v3",
    gdprText:
      "Acconsento al trattamento da parte di INMOARTIKO SL (codice fiscale B56527930), con sede a Sagunto (Valencia, Spagna), dei miei dati personali e della documentazione fornita, allo scopo di gestire la mia richiesta di informazioni sull'immobile selezionato. Potrò esercitare i diritti di accesso, rettifica, cancellazione, opposizione, limitazione e portabilità scrivendo a info@artikore.com.",

    ownerVersion: "2026-08-proprietario-v2",
    ownerText:
      "Autorizzo INMOARTIKO SL a condividere i miei dati e la documentazione fornita con la proprietà dell'immobile, al solo fine di valutare la mia candidatura.",

    requiredError:
      "Ci serve il tuo consenso per poter gestire la richiesta."
  },

  review: {
    title: "Controlla la tua richiesta",
    subtitle: "Verifica che sia tutto corretto prima di inviarla.",
    edit: "Modifica",
    sectionOperation: "Richiesta",
    sectionProperty: "Immobile",
    sectionPersonal: "I tuoi dati",
    sectionQuestions: "La tua situazione",
    sectionDocuments: "Documenti",
    noDocuments: "Nessun documento allegato",
    documentCount: "{count} file allegato/i"
  },

  success: {
    title: "Abbiamo ricevuto la tua richiesta",
    body: "Grazie per il tuo interesse per {property}. Esamineremo le informazioni e ti contatteremo nei prossimi giorni.",
    emailSent: "Ti abbiamo inviato una conferma a {email}.",
    signature: "Artiko Real Estate"
  },

  email: {
    subject: "Abbiamo ricevuto la tua richiesta · Artiko Real Estate",
    greeting: "Ciao {name},",
    received:
      "grazie per il tuo interesse. Abbiamo ricevuto correttamente la tua richiesta di {operation} per il seguente immobile:",
    operationRent: "affitto",
    operationSale: "acquisto",
    nextSteps:
      "Esamineremo le informazioni inviate e ti contatteremo nei prossimi giorni se il tuo profilo corrisponde a quanto cerca la proprietà.",
    documentsPending:
      "Se non sei riuscito ad allegare tutta la documentazione non preoccuparti: te la chiederemo se necessario.",
    noReply:
      "Questo messaggio è stato generato automaticamente. Puoi rispondere a questa email se vuoi dirci qualcos'altro.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Preferisci parlarne con una persona?",
    whatsappCta: "Scrivici su WhatsApp",
    visitWebsite: "Vedi i nostri immobili"
  },

  docs: {
    eyebrow: "Documenti",
    greeting: "Ciao, {name}",
    intro:
      "La tua richiesta per {property} va avanti. Ci manca solo esaminare alcuni documenti.",
    weNeed: "Cosa ci serve",
    abroadNote:
      "Se lavori o hai vissuto fuori dalla Spagna, inviaci il documento equivalente del tuo paese. Non è un problema se è in un'altra lingua: se ci serve una traduzione, te la chiederemo.",
    spanishNameLabel: "in Spagna:",
    alreadySent: "Ci hai già inviato",
    addFiles: "Aggiungi file",
    dropHint: "Trascina qui i tuoi documenti, oppure clicca per selezionarli",
    accepted:
      "PDF e immagini, fino a 10 MB per file. Va bene anche una foto nitida del documento.",
    remove: "Rimuovi",
    send: "Invia documenti",
    sending: "Caricamento…",
    successTitle: "Documenti ricevuti",
    successBody:
      "Grazie. Li stiamo esaminando e ti diremo qualcosa nei prossimi giorni.",
    successPartial:
      "{count} file non è stato possibile caricarli. Riapri il link dell'email e riprova.",
    uploadMore: "Carica altro",
    sessionExpired:
      "La sessione è scaduta per sicurezza. Ricarica questa pagina e riprova: non è andato perso nulla.",
    unavailableTitle: "Questo link non è più disponibile",
    unavailableBody:
      "Potremmo avertene inviato uno più recente. Controlla la tua email, oppure scrivici e te lo rimandiamo.",
    expiredTitle: "Il link è scaduto",
    expiredBody:
      "Per sicurezza questi link durano un tempo limitato. Scrivici e te ne mandiamo subito uno nuovo.",
    completedTitle: "Abbiamo già ricevuto i tuoi documenti",
    completedBody:
      "Grazie. Li stiamo esaminando e ti diremo qualcosa nei prossimi giorni.",
    emailSubject: "Documenti per {property} · Artiko Real Estate",
    emailIntro:
      "grazie per il tuo interesse. La tua richiesta corrisponde a quello che cerchiamo, quindi il passo successivo è esaminare i documenti.",
    emailCta: "Carica i miei documenti",
    emailExpiry:
      "Il link è personale e scade il {date}. Non devi caricare tutto in una volta: puoi rientrare quando vuoi.",
    items: {
      id: "Documento d'identità (carta d'identità, passaporto o equivalente)",
      nie: "Numero di identità per stranieri in Spagna (NIE)",
      residencePermit: "Permesso di soggiorno o di lavoro",
      incomeProof: "Giustificativi dei tuoi redditi degli ultimi tre mesi",
      employmentContract: "Contratto di lavoro o lettera del datore di lavoro",
      workHistory: "Storico lavorativo o certificato di anzianità",
      taxReturn: "Ultima dichiarazione dei redditi",
      selfEmployedProof: "Giustificativo della tua attività autonoma",
      quarterlyTax: "Ultime dichiarazioni fiscali trimestrali",
      pensionProof: "Certificato o giustificativo della pensione",
      companyDocs: "Atto costitutivo e poteri di rappresentanza",
      representativeId: "Documento d'identità di chi firmerà",
      companyAccounts: "Ultimo bilancio o imposta sulle società",
      guarantorDocuments: "Documentazione del garante",
      other: "Altra documentazione"
    }
  },

  footer: {
    agency: "Agenzia immobiliare a Valencia, Spagna",
    website: "Scopri di più su artikore.com",
    questionsLabel: "Hai dubbi prima di inviare?",
    contact: "Scrivici a",
    whatsapp: "Scrivici su WhatsApp"
  },

  errors: {
    required: "Questo campo è obbligatorio",
    invalidEmail: "Inserisci un indirizzo email valido",
    invalidPhone: "Inserisci un numero di telefono valido",
    invalidNumber: "Inserisci solo numeri",
    selectProperty: "Scegli un immobile per continuare",
    selectOperation: "Scegli affitto o acquisto per continuare",
    submitFailed:
      "Non siamo riusciti a inviare la richiesta. Controlla la connessione e riprova.",
    fixFields: "Controlla i campi segnalati prima di continuare.",
    tooManySubmissions:
      "Hai inviato diverse richieste in poco tempo. Attendi un momento e riprova, oppure scrivici su WhatsApp."
  }
};
