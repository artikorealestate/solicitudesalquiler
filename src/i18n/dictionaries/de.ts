import type { Dictionary } from "./es";

export const de: Dictionary = {
  meta: { languageName: "Deutsch" },

  chooser: {
    eyebrow: "Anfrageformular",
    title: "In welcher Sprache möchten Sie fortfahren?",
    subtitle:
      "Wählen Sie Ihre Sprache für das Formular. Sie können sie jederzeit ändern.",
    continueIn: "Auf Deutsch fortfahren",
  },

  common: {
    next: "Weiter",
    back: "Zurück",
    submit: "Anfrage senden",
    sending: "Wird gesendet…",
    optional: "optional",
    required: "erforderlich",
    yes: "Ja",
    no: "Nein",
    stepOf: "Schritt {current} von {total}",
    changeLanguage: "Sprache ändern",
    selectPlaceholder: "Bitte auswählen",
  },

  steps: {
    operation: "Anliegen",
    property: "Immobilie",
    personal: "Ihre Daten",
    questions: "Ihre Situation",
    documents: "Unterlagen",
    consent: "Datenschutz",
    review: "Zusammenfassung",
  },

  operation: {
    title: "Wonach suchen Sie?",
    subtitle: "Die Fragen richten sich nach Ihrer Auswahl.",
    rent: {
      label: "Eine Wohnung mieten",
      description: "Ich möchte eine der verfügbaren Immobilien mieten",
    },
    sale: {
      label: "Eine Wohnung kaufen",
      description:
        "Ich möchte eine der zum Verkauf stehenden Immobilien kaufen",
    },
  },

  property: {
    title: "Welche Immobilie interessiert Sie?",
    subtitle: "Das sind die derzeit verfügbaren Immobilien.",
    empty:
      "Derzeit sind für dieses Anliegen keine Immobilien verfügbar. Bitte versuchen Sie es in einigen Tagen erneut.",
    perMonth: "/Monat",
    viewOnIdealista: "Vollständiges Inserat ansehen",
    selected: "Ausgewählt",
  },

  personal: {
    title: "Ihre Kontaktdaten",
    subtitle: "Wir benötigen sie, um Ihnen antworten zu können.",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
    nationality: "Staatsangehörigkeit",
    idDocument: "Personalausweis, NIE oder Reisepass",
    idDocumentHint:
      "Das hilft uns bei der Vorbereitung der Vertragsunterlagen.",
  },

  rentQuestions: {
    title: "Erzählen Sie uns von Ihrer Situation",
    subtitle: "So können wir einschätzen, ob die Immobilie zu Ihnen passt.",

    householdSize: "Wie viele Personen würden in der Wohnung leben?",
    relationship: "In welchem Verhältnis stehen Sie zueinander?",
    relationshipOptions: {
      couple: "Paar",
      family: "Familie",
      flatmates: "Wohngemeinschaft",
      alone: "Ich würde allein wohnen",
      other: "Anderes",
    },

    moveInDate: "Ab wann würden Sie einziehen wollen?",

    stayLength: "Für welchen Zeitraum benötigen Sie die Wohnung?",
    stayOptions: {
      withEndDate: "Wir kennen unser Auszugsdatum bereits",
      season: "Eine Saison, weniger als ein Jahr",
      oneYear: "Ein Jahr",
      twoOrThree: "Zwei oder drei Jahre",
      longTerm: "Langfristig, ohne festes Enddatum",
    },
    moveOutDate: "An welchem Tag würden Sie ausziehen?",
    occupation: "Was machen Sie beruflich?",

    employmentType: "Welche Art von Vertrag oder Beschäftigung haben Sie?",
    employmentOptions: {
      permanent: "Unbefristeter Vertrag",
      temporary: "Befristeter Vertrag",
      selfEmployed: "Selbstständig",
      civilServant: "Beamtin oder Beamter",
      retired: "Im Ruhestand oder Rente",
      student: "In Ausbildung oder Studium",
      unemployed: "Derzeit ohne Beschäftigung",
      other: "Andere Situation",
    },

    stayPurpose: "Was führt Sie her?",
    stayPurposeOptions: {
      work: "Arbeit oder beruflicher Umzug",
      studies: "Studium",
      holiday: "Urlaub",
      betweenHomes: "Bis wir eine Wohnung finden oder Bauarbeiten enden",
      other: "Ein anderer Grund",
    },
    provableIncome:
      "Können Sie Ihr Einkommen mit Gehaltsabrechnungen oder ähnlichen Unterlagen nachweisen?",
    monthlyIncome:
      "Wie hoch ist das monatliche Nettoeinkommen des Haushalts? (€)",

    pets: "Haben Sie Haustiere?",
    petsDetail: "Welche?",
    searchDuration: "Wie lange suchen Sie schon eine Mietwohnung?",
    searchDurationOptions: {
      justStarted: "Wir haben gerade erst angefangen",
      lessThanMonth: "Weniger als einen Monat",
      oneToThree: "Ein bis drei Monate",
      moreThanThree: "Mehr als drei Monate",
    },

    visitedOthers: "Haben Sie bereits andere Wohnungen besichtigt?",
    documentsReady: "Haben Sie Ihre Unterlagen bereit?",
    documentsReadyOptions: {
      yes: "Ja, alles ist bereit",
      partly: "Teilweise",
      no: "Noch nicht",
    },
  },

  saleQuestions: {
    title: "Erzählen Sie uns von Ihrer Situation",
    subtitle: "So können wir Sie beim Kaufprozess besser begleiten.",

    buyerProfile: "Wer würde kaufen, und wie ist Ihre Situation?",
    buyerProfileHint:
      "Zum Beispiel: junges Paar, Familie mit Kindern, Kapitalanleger, Zweitwohnsitz…",

    searchDuration: "Wie lange suchen Sie schon eine Immobilie?",
    searchDurationOptions: {
      justStarted: "Wir haben gerade erst angefangen",
      lessThanThree: "Weniger als drei Monate",
      threeToTwelve: "Drei Monate bis ein Jahr",
      moreThanYear: "Mehr als ein Jahr",
    },

    propertiesVisited: "Wie viele Immobilien haben Sie etwa besichtigt?",
    madeOffer: "Haben Sie bereits ein Angebot abgegeben?",
    needToSell:
      "Müssen Sie eine andere Immobilie verkaufen, um kaufen zu können?",
    needsFinancing: "Benötigen Sie eine Finanzierung?",
    financingApproved: "Ist sie bereits vorab genehmigt?",
    financingApprovedHint:
      "Eine vorab genehmigte Finanzierung beschleunigt den Ablauf erheblich.",

    firstPurchase: "Ist es Ihr erster Immobilienkauf?",
    firstPurchaseOptions: {
      first: "Ja, es ist unser erster Kauf",
      experienced: "Nein, wir kennen den Kaufprozess bereits",
    },

    occupation: "Was machen Sie beruflich?",
  },

  documents: {
    title: "Unterlagen",
    subtitleRent:
      "Beigefügte Unterlagen beschleunigen unsere Antwort erheblich. Sie können sie jetzt oder später senden.",
    subtitleSale:
      "Wenn Sie relevante Unterlagen haben, können Sie sie beifügen. Das ist nicht verpflichtend.",
    addFiles: "Dateien hinzufügen",
    dropHint: "Dateien hierher ziehen oder zum Auswählen klicken",
    accepted: "PDF und Bilder werden akzeptiert, bis 10 MB je Datei.",
    remove: "Entfernen",
    suggestionsRent: "Übliche Unterlagen für eine Anmietung:",
    suggestionsRentList: [
      "Ausweis, NIE oder Reisepass jeder Person, die den Vertrag unterschreibt",
      "Angestellte: Arbeitsvertrag, letzte drei Gehaltsabrechnungen und Kontoauszüge von drei Monaten",
      "Selbstständige: letzte Steuererklärung, Quartalserklärungen und Kontoauszüge von sechs Monaten",
      "Rentner: Rentenbescheinigung und Kontoauszüge von drei Monaten",
    ],
    suggestionsSeasonList: [
      "Ausweisdokument (Reisepass, Personalausweis oder gleichwertig)",
      "Bei Arbeit oder Studium: ein entsprechender Nachweis",
    ],
    skip: "Ohne Anhänge fortfahren",
    tooLarge: "„{name}“ ist größer als 10 MB und kann nicht angehängt werden.",
    wrongType: "„{name}“ ist kein zulässiger Dateityp.",
    uploading: "Dokument {current} von {total} wird hochgeladen…",
    uploadWait:
      "Bitte schließen Sie diese Seite nicht, während Ihre Dateien hochgeladen werden. Wir sagen Ihnen Bescheid, sobald die Anfrage gesendet ist.",
    uploadPartial:
      "Ihre Anfrage wurde erfolgreich gesendet, aber {count} Dokument(e) konnten nicht hochgeladen werden. Wir melden uns, um sie anzufordern.",
    uploadUnavailable:
      "Ihre Anfrage wurde erfolgreich gesendet. Wir fordern die Unterlagen per E-Mail an.",
  },

  comment: {
    label: "Möchten Sie noch etwas hinzufügen?",
    placeholder: "Alles, was wir Ihrer Meinung nach wissen sollten…",
  },

  consent: {
    title: "Datenschutz",
    subtitle:
      "Bitte lesen Sie vor dem Absenden, wie wir mit Ihren Daten umgehen.",

    infoVersion: "2026-10-info-v1-de",
    infoTitle: "Grundlegende Informationen zum Datenschutz",
    infoRows: [
      {
        label: "Verantwortlicher",
        text: "INMOARTIKO SL (Steuernummer B56527930), Sagunto (Valencia, Spanien).",
      },
      {
        label: "Zweck",
        text: "Bearbeitung Ihrer Anfrage zu dieser Immobilie und Prüfung Ihrer Bewerbung.",
      },
      {
        label: "Rechtsgrundlage",
        text: "Ihre eigene Anfrage: Es handelt sich um Schritte vor einem möglichen Vertrag, die Sie bei uns anfragen (Art. 6 Abs. 1 lit. b DSGVO).",
      },
      {
        label: "Empfänger",
        text: "Der Eigentümer der Immobilie, damit er Ihre Bewerbung prüfen kann. Unsere Technologieanbieter (Google, Supabase und Vercel), teils mit Sitz in den USA und nach dem EU-US Data Privacy Framework zertifiziert.",
      },
      {
        label: "Speicherdauer",
        text: "Kommt Ihre Bewerbung nicht zustande, löschen wir Ihre Daten und Unterlagen 3 Monate nach dem letzten Bearbeitungsschritt.",
      },
      {
        label: "Ihre Rechte",
        text: "Auskunft, Berichtigung, Löschung, Widerspruch, Einschränkung und Datenübertragbarkeit – per E-Mail an info@artikore.com. Sie können sich außerdem bei der spanischen Datenschutzbehörde (AEPD) beschweren.",
      },
    ],
    moreInfo: "Vollständige Datenschutzinformationen",
    acknowledgeText: "Ich habe die Datenschutzinformationen gelesen.",

    requiredError:
      "Bitte bestätigen Sie, dass Sie die Informationen gelesen haben, damit wir Ihre Anfrage senden können.",
  },

  review: {
    title: "Prüfen Sie Ihre Anfrage",
    subtitle: "Bitte prüfen Sie vor dem Senden, ob alles stimmt.",
    edit: "Ändern",
    sectionOperation: "Anliegen",
    sectionProperty: "Immobilie",
    sectionPersonal: "Ihre Daten",
    sectionQuestions: "Ihre Situation",
    sectionDocuments: "Unterlagen",
    noDocuments: "Keine Unterlagen beigefügt",
    documentCount: "{count} Datei(en) beigefügt",
  },

  success: {
    title: "Wir haben Ihre Anfrage erhalten",
    body: "Vielen Dank für Ihr Interesse an {property}. Wir prüfen Ihre Angaben und melden uns in den kommenden Tagen bei Ihnen.",
    emailSent: "Wir haben eine Bestätigung an {email} gesendet.",
    signature: "Artiko Real Estate",
  },

  email: {
    subject: "Wir haben Ihre Anfrage erhalten · Artiko Real Estate",
    greeting: "Hallo {name},",
    received:
      "vielen Dank für Ihr Interesse. Wir haben Ihre Anfrage zur {operation} für folgende Immobilie erhalten:",
    operationRent: "Miete",
    operationSale: "Kauf",
    nextSteps:
      "Wir prüfen Ihre Angaben und melden uns in den kommenden Tagen, wenn Ihr Profil zu den Vorstellungen der Eigentümerseite passt.",
    documentsPending:
      "Falls Sie nicht alle Unterlagen beifügen konnten, ist das kein Problem: Wir fordern sie bei Bedarf an.",
    noReply:
      "Diese Nachricht wurde automatisch erstellt. Sie können auf diese E-Mail antworten, wenn Sie uns noch etwas mitteilen möchten.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Möchten Sie lieber persönlich sprechen?",
    whatsappCta: "Schreiben Sie uns per WhatsApp",
    /// Enlace personal para volver a la propia solicitud y anadir lo que falte.
    selfServiceIntro:
      "Fehlt noch ein Dokument? Sie können es jederzeit über diesen Link nachreichen, ohne das Formular erneut auszufüllen.",
    selfServiceCta: "Unterlagen nachreichen",
    privacyNote:
      "Kommt Ihre Bewerbung nicht zustande, löschen wir Ihre Daten und Unterlagen 3 Monate nach dem letzten Bearbeitungsschritt.",
    privacyLink: "Datenschutzinformationen",
    visitWebsite: "Unsere Immobilien ansehen",
  },

  docs: {
    eyebrow: "Unterlagen",
    greeting: "Hallo, {name}",
    intro:
      "Ihre Anfrage zu {property} geht weiter. Uns fehlt nur noch die Prüfung einiger Unterlagen.",
    weNeed: "Was wir benötigen",
    personHeading: "Unterlagen von {name}",
    guarantorTag: "Bürge",
    everyoneNote:
      "Jede Person, die den Mietvertrag unterschreibt, und gegebenenfalls der Bürge muss eigene Unterlagen einreichen. Laden Sie jedes Dokument bei der richtigen Person hoch.",
    abroadNote:
      "Wenn Sie außerhalb Spaniens arbeiten oder gelebt haben, senden Sie uns das entsprechende Dokument aus Ihrem Land. Eine andere Sprache ist kein Problem — falls wir eine Übersetzung brauchen, melden wir uns.",
    spanishNameLabel: "in Spanien:",
    selfServiceHere:
      "Das ist Ihre Anfrage zu {property} vom {date}. Fehlende Unterlagen können Sie hier ergänzen – das Formular müssen Sie nicht erneut ausfüllen.",
    alreadySent: "Bereits erhalten",
    addFiles: "Dateien hinzufügen",
    dropHint:
      "Ziehen Sie Ihre Unterlagen hierher oder klicken Sie zum Auswählen",
    accepted:
      "PDF und Bilder, bis 10 MB je Datei. Ein scharfes Foto des Dokuments reicht.",
    remove: "Entfernen",
    send: "Unterlagen senden",
    sending: "Wird hochgeladen…",
    successTitle: "Unterlagen erhalten",
    successBody:
      "Vielen Dank. Wir prüfen sie und melden uns in den kommenden Tagen bei Ihnen.",
    successPartial:
      "{count} Datei(en) konnten nicht hochgeladen werden. Öffnen Sie den Link aus der E-Mail erneut und versuchen Sie es noch einmal.",
    uploadMore: "Weitere hochladen",
    sessionExpired:
      "Die Sitzung ist aus Sicherheitsgründen abgelaufen. Laden Sie die Seite neu und versuchen Sie es erneut — es ist nichts verloren gegangen.",
    unavailableTitle: "Dieser Link ist nicht mehr verfügbar",
    unavailableBody:
      "Möglicherweise haben wir Ihnen einen neueren geschickt. Prüfen Sie Ihre E-Mails oder schreiben Sie uns, dann senden wir ihn erneut.",
    expiredTitle: "Der Link ist abgelaufen",
    expiredBody:
      "Aus Sicherheitsgründen sind diese Links zeitlich begrenzt. Schreiben Sie uns und wir senden Ihnen sofort einen neuen.",
    completedTitle: "Wir haben Ihre Unterlagen bereits erhalten",
    completedBody:
      "Vielen Dank. Wir prüfen sie und melden uns in den kommenden Tagen.",
    emailSubject: "Unterlagen für {property} · Artiko Real Estate",
    emailIntro:
      "vielen Dank für Ihr Interesse. Ihre Anfrage passt zu dem, was wir suchen. Der nächste Schritt ist die Prüfung Ihrer Unterlagen.",
    emailCta: "Meine Unterlagen hochladen",
    emailExpiry:
      "Der Link ist persönlich und läuft am {date} ab. Sie müssen nicht alles auf einmal hochladen — Sie können jederzeit zurückkehren.",
    items: {
      id: "Ausweisdokument (Personalausweis, Reisepass oder gleichwertig)",
      nie: "Spanische Ausländer-Identifikationsnummer (NIE)",
      residencePermit: "Aufenthalts- oder Arbeitserlaubnis",
      incomeProof:
        "Die letzten drei Gehaltsabrechnungen oder Zahlungsnachweise",
      employmentContract:
        "Aktueller Arbeitsvertrag, Arbeitgeberbescheinigung oder Schreiben des Zahlenden",
      workHistory:
        "Beschäftigungsverlauf oder Nachweis der Betriebszugehörigkeit",
      taxReturn: "Letzte vollständige Einkommensteuererklärung",
      selfEmployedProof:
        "Nachweis, dass die Tätigkeit weiterhin ausgeübt wird (Anmeldung, aktuelle Rechnungen…)",
      quarterlyTax:
        "In diesem Jahr eingereichte vierteljährliche Steuererklärungen",
      pensionProof: "Aktuelle Rentenbescheinigung",
      companyDocs: "Gründungsurkunde und Vertretungsvollmachten",
      representativeId: "Ausweisdokument der unterzeichnenden Person",
      companyAccounts: "Letzter Jahresabschluss der Gesellschaft",
      bankStatements3:
        "Vollständige Kontoauszüge der letzten drei Monate, auf denen die Einkünfte zu sehen sind",
      bankStatements6: "Vollständige Kontoauszüge der letzten sechs Monate",
      ownerPayProof:
        "Nachweis über die Bezüge aus der Gesellschaft (Gehaltsabrechnungen, Steuerbescheinigung…)",
      fundsInSpain:
        "Nachweis, dass das Geld in Spanien verfügbar ist (zum Beispiel Auszug eines spanischen Kontos)",
      guarantorDocuments: "Unterlagen des Bürgen",
      other: "Weitere Unterlagen",
    },
  },

  footer: {
    agency: "Immobilienagentur in Valencia, Spanien",
    website: "Mehr über uns auf artikore.com",
    questionsLabel: "Noch Fragen vor dem Absenden?",
    contact: "Schreiben Sie uns an",
    whatsapp: "Schreiben Sie uns per WhatsApp",
    privacy: "Datenschutz",
  },

  errors: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    invalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein",
    invalidNumber: "Bitte nur Zahlen eingeben",
    selectProperty: "Wählen Sie eine Immobilie, um fortzufahren",
    selectOperation: "Wählen Sie Miete oder Kauf, um fortzufahren",
    submitFailed:
      "Wir konnten Ihre Anfrage nicht senden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    fixFields: "Bitte prüfen Sie die markierten Felder, bevor Sie fortfahren.",
    tooManySubmissions:
      "Sie haben in kurzer Zeit mehrere Anfragen gesendet. Warten Sie bitte einen Moment und versuchen Sie es erneut, oder schreiben Sie uns per WhatsApp.",
  },
};
