import type { Dictionary } from "./es";

export const nl: Dictionary = {
  meta: { languageName: "Nederlands" },

  chooser: {
    eyebrow: "Aanvraagformulier",
    title: "In welke taal wilt u verdergaan?",
    subtitle:
      "Kies uw taal om het formulier in te vullen. U kunt dit altijd wijzigen.",
    continueIn: "Verder in het Nederlands",
  },

  common: {
    next: "Verder",
    back: "Terug",
    submit: "Aanvraag versturen",
    sending: "Bezig met versturen…",
    optional: "optioneel",
    required: "verplicht",
    yes: "Ja",
    no: "Nee",
    stepOf: "Stap {current} van {total}",
    changeLanguage: "Taal wijzigen",
    selectPlaceholder: "Kies een optie",
  },

  steps: {
    operation: "Aanvraag",
    property: "Woning",
    personal: "Uw gegevens",
    questions: "Uw situatie",
    documents: "Documenten",
    consent: "Gegevensbescherming",
    review: "Overzicht",
  },

  operation: {
    title: "Waarnaar bent u op zoek?",
    subtitle: "De vragen passen zich aan uw keuze aan.",
    rent: {
      label: "Een woning huren",
      description: "Ik wil een van de beschikbare woningen huren",
    },
    sale: {
      label: "Een woning kopen",
      description: "Ik wil een van de woningen te koop kopen",
    },
  },

  property: {
    title: "In welke woning bent u geïnteresseerd?",
    subtitle: "Dit zijn de woningen die nu beschikbaar zijn.",
    empty:
      "Er zijn momenteel geen woningen beschikbaar voor dit type aanvraag. Probeer het over een paar dagen opnieuw.",
    perMonth: "/maand",
    viewOnIdealista: "Bekijk de volledige advertentie",
    selected: "Geselecteerd",
  },

  personal: {
    title: "Uw contactgegevens",
    subtitle: "Die hebben we nodig om u te kunnen antwoorden.",
    firstName: "Voornaam",
    lastName: "Achternaam",
    email: "E-mailadres",
    phone: "Telefoonnummer",
    nationality: "Nationaliteit",
    idDocument: "Identiteitskaart, NIE of paspoort",
    idDocumentHint: "Dit helpt ons de contractdocumenten voor te bereiden.",
  },

  rentQuestions: {
    title: "Vertel ons over uw situatie",
    subtitle:
      "Met deze informatie kunnen we beoordelen of de woning bij u past.",

    householdSize: "Met hoeveel personen zou u in de woning wonen?",
    relationship: "Wat is uw onderlinge relatie?",
    relationshipOptions: {
      couple: "Stel",
      family: "Gezin",
      flatmates: "Huisgenoten",
      alone: "Ik zou alleen wonen",
      other: "Anders",
    },

    moveInDate: "Vanaf wanneer zou u willen intrekken?",
    occupation: "Wat doet u op dit moment voor werk?",

    employmentType: "Wat voor contract of arbeidssituatie heeft u?",
    employmentOptions: {
      permanent: "Vast contract",
      temporary: "Tijdelijk contract",
      selfEmployed: "Zelfstandige",
      civilServant: "Ambtenaar",
      retired: "Gepensioneerd",
      student: "Student",
      unemployed: "Op dit moment zonder werk",
      other: "Andere situatie",
    },

    provableIncome:
      "Kunt u uw inkomen aantonen met loonstroken of vergelijkbare documenten?",
    monthlyIncome: "Wat is het netto maandinkomen van het huishouden? (€)",

    solvencyHelp:
      "De gebruikelijke richtlijn is dat de huur niet hoger is dan ongeveer 30% van het aantoonbare netto-inkomen van het huishouden.",
    solvencyForProperty:
      "Voor deze woning van {rent} € per maand komt dat neer op ongeveer {recommended} € netto per maand samen.",
    solvencyMet:
      "Op basis van wat u heeft ingevuld voldoet u aan de gebruikelijke richtlijn.",
    solvencyNotMet:
      "Dit blijft onder de gebruikelijke richtlijn. U kunt toch doorgaan: we bekijken het samen met alle overige informatie.",

    pets: "Heeft u huisdieren?",
    petsDetail: "Welke?",
    searchDuration: "Hoelang zoekt u al een huurwoning?",
    searchDurationOptions: {
      justStarted: "We zijn net begonnen",
      lessThanMonth: "Minder dan een maand",
      oneToThree: "Eén tot drie maanden",
      moreThanThree: "Meer dan drie maanden",
    },

    visitedOthers: "Heeft u al andere woningen bezichtigd?",
    documentsReady: "Heeft u uw documenten bij de hand?",
    documentsReadyOptions: {
      yes: "Ja, alles is klaar",
      partly: "Gedeeltelijk",
      no: "Nog niet",
    },
  },

  saleQuestions: {
    title: "Vertel ons over uw situatie",
    subtitle:
      "Met deze informatie kunnen we u beter begeleiden bij de aankoop.",

    buyerProfile: "Wie zou de aankoop doen en wat is uw situatie?",
    buyerProfileHint:
      "Bijvoorbeeld: jong stel, gezin met kinderen, belegger, tweede woning…",

    searchDuration: "Hoelang zoekt u al een woning?",
    searchDurationOptions: {
      justStarted: "We zijn net begonnen",
      lessThanThree: "Minder dan drie maanden",
      threeToTwelve: "Tussen drie maanden en een jaar",
      moreThanYear: "Meer dan een jaar",
    },

    propertiesVisited: "Hoeveel woningen heeft u ongeveer bezichtigd?",
    madeOffer: "Heeft u al een bod uitgebracht?",
    needToSell: "Moet u een andere woning verkopen om te kunnen kopen?",
    needsFinancing: "Heeft u een hypotheek nodig?",
    financingApproved: "Is die al voorlopig goedgekeurd?",
    financingApprovedHint:
      "Een voorlopig goedgekeurde hypotheek versnelt het proces aanzienlijk.",

    firstPurchase: "Is dit uw eerste aankoop?",
    firstPurchaseOptions: {
      first: "Ja, dit is onze eerste aankoop",
      experienced: "Nee, we kennen het aankoopproces al",
    },

    occupation: "Wat doet u op dit moment voor werk?",
  },

  documents: {
    title: "Documenten",
    subtitleRent:
      "Documenten meesturen versnelt ons antwoord aanzienlijk. U kunt ze nu of later sturen.",
    subtitleSale:
      "Heeft u relevante documenten, dan kunt u ze meesturen. Dit is niet verplicht.",
    addFiles: "Bestanden toevoegen",
    dropHint: "Sleep uw bestanden hierheen, of klik om ze te kiezen",
    accepted: "PDF en afbeeldingen worden geaccepteerd, tot 10 MB per bestand.",
    remove: "Verwijderen",
    suggestionsRent: "Documenten die meestal gevraagd worden bij huur:",
    suggestionsRentList: [
      "Recente loonstroken of inkomensbewijzen",
      "Arbeidsovereenkomst",
      "Identiteitskaart, NIE of paspoort",
      "Laatste belastingaangifte (bij zelfstandigen)",
    ],
    skip: "Verdergaan zonder bijlagen",
    tooLarge: "„{name}” is groter dan 10 MB en kan niet worden bijgevoegd.",
    wrongType: "„{name}” is geen toegestaan bestandstype.",
    uploading: "Document {current} van {total} wordt geüpload…",
    uploadWait:
      "Sluit deze pagina niet terwijl uw bestanden worden geüpload. We laten het weten zodra uw aanvraag is verstuurd.",
    uploadPartial:
      "Uw aanvraag is verstuurd, maar {count} document(en) konden niet worden geüpload. We nemen contact op om ze alsnog op te vragen.",
    uploadUnavailable:
      "Uw aanvraag is verstuurd. We vragen de documenten per e-mail op.",
  },

  comment: {
    label: "Wilt u nog iets toevoegen?",
    placeholder: "Alles wat wij volgens u zouden moeten weten…",
  },

  consent: {
    title: "Gegevensbescherming",
    subtitle: "Voordat u verstuurt hebben we uw bevestiging nodig.",

    gdprVersion: "2026-08-avg-nl-v3",
    gdprText:
      "Ik geef INMOARTIKO SL (fiscaal nummer B56527930), gevestigd in Sagunto (Valencia, Spanje), toestemming om mijn persoonsgegevens en de aangeleverde documenten te verwerken met als doel mijn aanvraag over de geselecteerde woning te behandelen. Ik kan mijn rechten op inzage, rectificatie, verwijdering, bezwaar, beperking en overdraagbaarheid uitoefenen door te schrijven naar info@artikore.com.",

    ownerVersion: "2026-08-eigenaar-nl-v2",
    ownerText:
      "Ik geef INMOARTIKO SL toestemming om mijn gegevens en de aangeleverde documenten te delen met de eigenaar van de woning, uitsluitend om mijn kandidatuur te beoordelen.",

    requiredError:
      "We hebben uw toestemming nodig om de aanvraag te kunnen behandelen.",
  },

  review: {
    title: "Controleer uw aanvraag",
    subtitle: "Controleer of alles klopt voordat u verstuurt.",
    edit: "Wijzigen",
    sectionOperation: "Aanvraag",
    sectionProperty: "Woning",
    sectionPersonal: "Uw gegevens",
    sectionQuestions: "Uw situatie",
    sectionDocuments: "Documenten",
    noDocuments: "Geen documenten bijgevoegd",
    documentCount: "{count} bestand(en) bijgevoegd",
  },

  success: {
    title: "We hebben uw aanvraag ontvangen",
    body: "Bedankt voor uw interesse in {property}. We bekijken uw gegevens en nemen de komende dagen contact met u op.",
    emailSent: "We hebben een bevestiging gestuurd naar {email}.",
    signature: "Artiko Real Estate",
  },

  email: {
    subject: "We hebben uw aanvraag ontvangen · Artiko Real Estate",
    greeting: "Hallo {name},",
    received:
      "bedankt voor uw interesse. We hebben uw aanvraag voor {operation} van de volgende woning goed ontvangen:",
    operationRent: "huur",
    operationSale: "aankoop",
    nextSteps:
      "We bekijken de door u verstuurde informatie en nemen de komende dagen contact op als uw profiel aansluit bij wat de eigenaar zoekt.",
    documentsPending:
      "Kon u niet alle documenten meesturen? Geen zorgen: we vragen ze op als dat nodig is.",
    noReply:
      "Dit bericht is automatisch gegenereerd. U kunt op deze e-mail antwoorden als u ons nog iets wilt laten weten.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Liever persoonlijk contact?",
    whatsappCta: "Stuur ons een WhatsApp",
    /// Enlace personal para volver a la propia solicitud y anadir lo que falte.
    selfServiceIntro:
      "Mist u nog een document? U kunt het altijd via deze link toevoegen, zonder het formulier opnieuw in te vullen.",
    selfServiceCta: "Documenten toevoegen",
    visitWebsite: "Bekijk onze woningen",
  },

  docs: {
    eyebrow: "Documenten",
    greeting: "Hallo, {name}",
    intro:
      "Uw aanvraag voor {property} gaat verder. We hoeven alleen nog een paar documenten te bekijken.",
    weNeed: "Wat we nodig hebben",
    abroadNote:
      "Als u buiten Spanje werkt of hebt gewoond, stuur ons dan het gelijkwaardige document uit uw land. Een andere taal is geen probleem — als we een vertaling nodig hebben, laten we het weten.",
    spanishNameLabel: "in Spanje:",
    selfServiceHere:
      "Dit is uw aanvraag voor {property}, verstuurd op {date}. U kunt hier ontbrekende documenten toevoegen — het formulier hoeft u niet opnieuw in te vullen.",
    alreadySent: "U heeft ons al gestuurd",
    addFiles: "Bestanden toevoegen",
    dropHint: "Sleep uw documenten hierheen, of klik om ze te kiezen",
    accepted:
      "PDF en afbeeldingen, tot 10 MB per bestand. Een scherpe foto van het document volstaat.",
    remove: "Verwijderen",
    send: "Documenten versturen",
    sending: "Bezig met uploaden…",
    successTitle: "Documenten ontvangen",
    successBody:
      "Bedankt. We bekijken ze en nemen de komende dagen contact met u op.",
    successPartial:
      "{count} bestand(en) konden niet worden geüpload. Open de link uit de e-mail opnieuw en probeer het nog eens.",
    uploadMore: "Nog iets uploaden",
    sessionExpired:
      "De sessie is om veiligheidsredenen verlopen. Herlaad deze pagina en probeer het opnieuw — er is niets verloren gegaan.",
    unavailableTitle: "Deze link is niet meer beschikbaar",
    unavailableBody:
      "Mogelijk hebben we u een recentere gestuurd. Controleer uw e-mail, of schrijf ons en we sturen hem opnieuw.",
    expiredTitle: "De link is verlopen",
    expiredBody:
      "Uit veiligheidsoverwegingen zijn deze links beperkt geldig. Schrijf ons en we sturen meteen een nieuwe.",
    completedTitle: "We hebben uw documenten al ontvangen",
    completedBody:
      "Bedankt. We bekijken ze en nemen de komende dagen contact met u op.",
    emailSubject: "Documenten voor {property} · Artiko Real Estate",
    emailIntro:
      "bedankt voor uw interesse. Uw aanvraag sluit aan bij wat we zoeken, dus de volgende stap is het bekijken van uw documenten.",
    emailCta: "Mijn documenten uploaden",
    emailExpiry:
      "De link is persoonlijk en verloopt op {date}. U hoeft niet alles in één keer te uploaden — u kunt terugkomen.",
    items: {
      id: "Identiteitsbewijs (identiteitskaart, paspoort of gelijkwaardig)",
      nie: "Spaans identificatienummer voor buitenlanders (NIE)",
      residencePermit: "Verblijfs- of werkvergunning",
      incomeProof: "Bewijs van uw inkomen van de laatste drie maanden",
      employmentContract: "Arbeidsovereenkomst of verklaring van uw werkgever",
      workHistory: "Arbeidsverleden of bewijs van dienstjaren",
      taxReturn: "Laatste belastingaangifte",
      selfEmployedProof: "Bewijs van uw werkzaamheden als zelfstandige",
      quarterlyTax: "Laatste kwartaalaangiften",
      pensionProof: "Pensioenverklaring of -bewijs",
      companyDocs: "Oprichtingsakte en tekenbevoegdheid",
      representativeId: "Identiteitsbewijs van de ondertekenaar",
      companyAccounts: "Laatste jaarrekening of vennootschapsbelasting",
      guarantorDocuments: "Documenten van de borg",
      other: "Overige documenten",
    },
  },

  footer: {
    agency: "Makelaardij in Valencia, Spanje",
    website: "Leer ons kennen op artikore.com",
    questionsLabel: "Vragen voordat u verstuurt?",
    contact: "Schrijf ons op",
    whatsapp: "Stuur ons een WhatsApp",
  },

  errors: {
    required: "Dit veld is verplicht",
    invalidEmail: "Vul een geldig e-mailadres in",
    invalidPhone: "Vul een geldig telefoonnummer in",
    invalidNumber: "Vul alleen cijfers in",
    selectProperty: "Kies een woning om verder te gaan",
    selectOperation: "Kies huren of kopen om verder te gaan",
    submitFailed:
      "We konden uw aanvraag niet versturen. Controleer uw verbinding en probeer het opnieuw.",
    fixFields: "Controleer de gemarkeerde velden voordat u verdergaat.",
    tooManySubmissions:
      "U heeft in korte tijd meerdere aanvragen verstuurd. Wacht even en probeer het opnieuw, of stuur ons een WhatsApp.",
  },
};
