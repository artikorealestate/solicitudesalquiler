import type { Dictionary } from "./es";

export const it: Dictionary = {
  meta: { languageName: "Italiano" },

  chooser: {
    eyebrow: "Modulo di richiesta",
    title: "In quale lingua preferisci continuare?",
    subtitle:
      "Scegli la lingua per compilare il modulo. Potrai cambiarla in qualsiasi momento.",
    continueIn: "Continua in italiano",
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
    selectPlaceholder: "Seleziona un'opzione",
  },

  steps: {
    operation: "Richiesta",
    property: "Immobile",
    personal: "I tuoi dati",
    questions: "La tua situazione",
    documents: "Documenti",
    consent: "Protezione dei dati",
    review: "Riepilogo",
  },

  operation: {
    title: "Cosa stai cercando?",
    subtitle: "Le domande cambiano in base alla tua scelta.",
    rent: {
      label: "Affittare una casa",
      description: "Vorrei affittare uno degli immobili disponibili",
    },
    sale: {
      label: "Comprare una casa",
      description: "Vorrei comprare uno degli immobili in vendita",
    },
  },

  property: {
    title: "Quale immobile ti interessa?",
    subtitle: "Questi sono gli immobili disponibili al momento.",
    empty:
      "Al momento non ci sono immobili disponibili per questo tipo di richiesta. Riprova tra qualche giorno.",
    perMonth: "/mese",
    viewOnIdealista: "Vedi l'annuncio completo",
    selected: "Selezionato",
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
    idDocumentHint: "Ci aiuta a preparare la documentazione del contratto.",
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
      other: "Altro",
    },

    moveInDate: "Da quando avreste bisogno di entrare?",

    stayLength: "Per quanto tempo vi servirebbe?",
    stayOptions: {
      withEndDate: "Sappiamo già la data di uscita",
      season: "Una stagione, meno di un anno",
      oneYear: "Un anno",
      twoOrThree: "Due o tre anni",
      longTerm: "A lungo termine, senza una data prevista",
    },
    moveOutDate: "In che giorno lascereste l'abitazione?",
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
      other: "Altra situazione",
    },

    stayPurpose: "Qual è il motivo del soggiorno?",
    stayPurposeOptions: {
      work: "Lavoro o trasferimento lavorativo",
      studies: "Studio",
      holiday: "Vacanza",
      betweenHomes: "In attesa di trovare casa o di finire dei lavori",
      other: "Un altro motivo",
    },
    provableIncome:
      "I redditi sono dimostrabili con buste paga o documenti equivalenti?",
    monthlyIncome: "Qual è il reddito netto mensile del nucleo? (€)",

    pets: "Avete animali domestici?",
    petsDetail: "Quali?",
    searchDuration: "Da quanto tempo cercate una casa in affitto?",
    searchDurationOptions: {
      justStarted: "Abbiamo appena iniziato",
      lessThanMonth: "Meno di un mese",
      oneToThree: "Tra uno e tre mesi",
      moreThanThree: "Più di tre mesi",
    },

    visitedOthers: "Avete già visitato altre case?",
    documentsReady: "Avete la documentazione pronta?",
    documentsReadyOptions: {
      yes: "Sì, è tutto pronto",
      partly: "In parte",
      no: "Non ancora",
    },
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
      moreThanYear: "Più di un anno",
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
      experienced: "No, conosciamo già il processo di compravendita",
    },

    occupation: "Di cosa ti occupi attualmente?",
  },

  documents: {
    title: "Documenti",
    subtitleRent:
      "Allegare la documentazione velocizza molto la risposta. Puoi inviarla ora o più avanti.",
    subtitleSale: "Se hai documenti utili puoi allegarli. Non è obbligatorio.",
    addFiles: "Aggiungi file",
    dropHint: "Trascina qui i file, oppure clicca per selezionarli",
    accepted: "Si accettano PDF e immagini, fino a 10 MB per file.",
    remove: "Rimuovi",
    suggestionsRent: "Documentazione solitamente richiesta per l'affitto:",
    suggestionsRentList: [
      "Documento d'identità, NIE o passaporto di ogni persona che firmerà il contratto",
      "Dipendenti: contratto di lavoro, ultime tre buste paga e tre mesi di estratti conto",
      "Autonomi: ultima dichiarazione dei redditi, dichiarazioni trimestrali e sei mesi di estratti conto",
      "Pensionati: certificato di pensione e tre mesi di estratti conto",
    ],
    suggestionsSeasonList: [
      "Documento d'identità (passaporto, carta d'identità o equivalente)",
      "Se vieni per lavoro o studio, qualcosa che lo attesti",
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
      "La tua richiesta è stata inviata correttamente. Ti chiederemo la documentazione via email.",
  },

  comment: {
    label: "Vuoi aggiungere altro?",
    placeholder: "Qualsiasi cosa che ritieni utile farci sapere…",
  },

  consent: {
    title: "Protezione dei dati",
    subtitle: "Prima di inviare, leggi come trattiamo i tuoi dati.",

    infoVersion: "2026-10-info-v1-it",
    infoTitle: "Informazioni di base sulla protezione dei dati",
    infoRows: [
      {
        label: "Titolare",
        text: "INMOARTIKO SL (CF B56527930), Sagunto (Valencia, Spagna).",
      },
      {
        label: "Finalità",
        text: "Gestire la tua richiesta per questo immobile e valutare la tua candidatura.",
      },
      {
        label: "Base giuridica",
        text: "La tua stessa richiesta: si tratta di passaggi preliminari a un possibile contratto che ci chiedi tu (art. 6.1.b del GDPR).",
      },
      {
        label: "Destinatari",
        text: "La proprietà dell'immobile, perché valuti la tua candidatura. I nostri fornitori tecnologici (Google, Supabase e Vercel), alcuni con sede negli USA e aderenti al Data Privacy Framework UE-USA.",
      },
      {
        label: "Conservazione",
        text: "Se la tua richiesta non va avanti, cancelliamo i tuoi dati e documenti 3 mesi dopo l'ultima gestione.",
      },
      {
        label: "I tuoi diritti",
        text: "Accesso, rettifica, cancellazione, opposizione, limitazione e portabilità, scrivendo a info@artikore.com. Puoi anche presentare reclamo all'Agenzia spagnola per la protezione dei dati (AEPD).",
      },
    ],
    moreInfo: "Informazioni complete sulla protezione dei dati",
    acknowledgeText: "Ho letto le informazioni sulla protezione dei dati.",

    requiredError:
      "Conferma di aver letto le informazioni per poter inviare la richiesta.",
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
    documentCount: "{count} file allegato/i",
  },

  success: {
    title: "Abbiamo ricevuto la tua richiesta",
    body: "Grazie per il tuo interesse per {property}. Esamineremo le informazioni e ti contatteremo nei prossimi giorni.",
    emailSent: "Ti abbiamo inviato una conferma a {email}.",
    signature: "Artiko Real Estate",
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
    /// Enlace personal para volver a la propia solicitud y anadir lo que falte.
    selfServiceIntro:
      "Ti manca qualche documento? Puoi aggiungerlo quando vuoi da questo link, senza compilare di nuovo il modulo.",
    selfServiceCta: "Aggiungi documenti",
    privacyNote:
      "Se la tua richiesta non va avanti, cancelleremo i tuoi dati e documenti 3 mesi dopo l'ultima gestione.",
    privacyLink: "Informazioni sulla protezione dei dati",
    visitWebsite: "Vedi i nostri immobili",
  },

  docs: {
    eyebrow: "Documenti",
    greeting: "Ciao, {name}",
    intro:
      "La tua richiesta per {property} va avanti. Ci manca solo esaminare alcuni documenti.",
    weNeed: "Cosa ci serve",
    personHeading: "Documenti di {name}",
    guarantorTag: "garante",
    everyoneNote:
      "Ogni persona che firmerà il contratto, e il garante se c'è, deve presentare i propri documenti. Carica ogni documento nella sezione della persona giusta.",
    abroadNote:
      "Se lavori o hai vissuto fuori dalla Spagna, inviaci il documento equivalente del tuo paese. Non è un problema se è in un'altra lingua: se ci serve una traduzione, te la chiederemo.",
    spanishNameLabel: "in Spagna:",
    selfServiceHere:
      "Questa è la tua richiesta per {property}, inviata il {date}. Puoi aggiungere qui i documenti mancanti: non serve compilare di nuovo il modulo.",
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
      incomeProof:
        "Le ultime tre buste paga o ricevute dei pagamenti percepiti",
      employmentContract:
        "Contratto di lavoro in corso, certificato del datore di lavoro o lettera di chi paga",
      workHistory: "Storico lavorativo o certificato di anzianità",
      taxReturn: "Ultima dichiarazione dei redditi completa",
      selfEmployedProof:
        "Prova che l'attività è ancora in corso (iscrizione, fatture recenti…)",
      quarterlyTax: "Dichiarazioni fiscali trimestrali presentate quest'anno",
      pensionProof: "Certificato di pensione aggiornato",
      companyDocs: "Atto costitutivo e poteri di rappresentanza",
      representativeId: "Documento d'identità di chi firmerà",
      companyAccounts: "Ultimo bilancio della società",
      bankStatements3:
        "Estratti conto completi degli ultimi tre mesi, in cui si vedano le entrate",
      bankStatements6: "Estratti conto completi degli ultimi sei mesi",
      ownerPayProof:
        "Prova di quanto si percepisce dalla società (buste paga, certificazione delle ritenute…)",
      fundsInSpain:
        "Prova che il denaro è disponibile in Spagna (ad esempio, l'estratto di un conto spagnolo)",
      guarantorDocuments: "Documentazione del garante",
      other: "Altra documentazione",
    },
  },

  footer: {
    agency: "Agenzia immobiliare a Valencia, Spagna",
    website: "Scopri di più su artikore.com",
    questionsLabel: "Hai dubbi prima di inviare?",
    contact: "Scrivici a",
    whatsapp: "Scrivici su WhatsApp",
    privacy: "Privacy",
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
      "Hai inviato diverse richieste in poco tempo. Attendi un momento e riprova, oppure scrivici su WhatsApp.",
  },
};
