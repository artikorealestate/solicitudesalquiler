import type { Dictionary } from "./es";

export const en: Dictionary = {
  meta: { languageName: "English" },

  chooser: {
    eyebrow: "Enquiry form",
    title: "Which language would you prefer?",
    subtitle:
      "Choose your language to fill in the form. You can change it at any time.",
    continueIn: "Continue in English",
  },

  common: {
    next: "Continue",
    back: "Back",
    submit: "Send enquiry",
    sending: "Sending…",
    optional: "optional",
    required: "required",
    yes: "Yes",
    no: "No",
    stepOf: "Step {current} of {total}",
    changeLanguage: "Change language",
    selectPlaceholder: "Select an option",
  },

  steps: {
    operation: "Enquiry type",
    property: "Property",
    personal: "Your details",
    questions: "Your situation",
    documents: "Documents",
    consent: "Data protection",
    review: "Summary",
  },

  operation: {
    title: "What are you looking for?",
    subtitle: "The questions change depending on your answer.",
    rent: {
      label: "Rent a home",
      description: "I would like to rent one of the available properties",
    },
    sale: {
      label: "Buy a home",
      description: "I would like to buy one of the properties for sale",
    },
  },

  property: {
    title: "Which property are you interested in?",
    subtitle: "These are the properties currently available.",
    empty:
      "There are no properties available for this type of enquiry right now. Please try again in a few days.",
    perMonth: "/month",
    viewOnIdealista: "View the full listing",
    selected: "Selected",
  },

  personal: {
    title: "Your contact details",
    subtitle: "We need these to get back to you.",
    firstName: "First name",
    lastName: "Surname",
    email: "Email address",
    phone: "Phone number",
    nationality: "Nationality",
    idDocument: "ID card, NIE or passport",
    idDocumentHint: "This helps us prepare the contract paperwork.",
  },

  rentQuestions: {
    title: "Tell us about your situation",
    subtitle:
      "This helps us assess whether the property is a good fit for you.",

    householdSize: "How many people would live in the property?",
    relationship: "What is your relationship to each other?",
    relationshipOptions: {
      couple: "Couple",
      family: "Family",
      flatmates: "Flatmates",
      alone: "I would live alone",
      other: "Other",
    },

    moveInDate: "When would you need to move in?",

    stayLength: "How long would you need it for?",
    stayOptions: {
      withEndDate: "We already know our leaving date",
      season: "A season, less than a year",
      oneYear: "One year",
      twoOrThree: "Two or three years",
      longTerm: "Long term, with no end date in mind",
    },
    moveOutDate: "What day would you be leaving?",
    occupation: "What do you do for a living?",

    employmentType:
      "What kind of contract or employment situation do you have?",
    employmentOptions: {
      permanent: "Permanent contract",
      temporary: "Fixed-term contract",
      selfEmployed: "Self-employed",
      civilServant: "Civil servant",
      retired: "Retired or on a pension",
      student: "Student",
      unemployed: "Currently not working",
      other: "Other situation",
    },

    stayPurpose: "What brings you here?",
    stayPurposeOptions: {
      work: "Work or a job relocation",
      studies: "Studies",
      holiday: "Holiday",
      betweenHomes: "While we find a home or building work finishes",
      other: "Another reason",
    },
    provableIncome:
      "Can your income be evidenced with payslips or equivalent documents?",
    monthlyIncome: "What is the household's net monthly income? (€)",

    solvencyHelp:
      "The usual affordability guideline is that rent should not exceed roughly 30% of the household's evidenced net income.",
    solvencyForProperty:
      "For this property, at €{rent} per month, that would mean around €{recommended} net per month between you.",
    solvencyMet:
      "Based on what you have entered, you meet the usual guideline.",
    solvencyNotMet:
      "This falls below the usual guideline. You can still continue: we will consider it alongside everything else.",

    pets: "Do you have pets?",
    petsDetail: "Which ones?",
    searchDuration: "How long have you been looking for a rental?",
    searchDurationOptions: {
      justStarted: "We have just started",
      lessThanMonth: "Less than a month",
      oneToThree: "One to three months",
      moreThanThree: "More than three months",
    },

    visitedOthers: "Have you already viewed other properties?",
    documentsReady: "Do you have your documents ready?",
    documentsReadyOptions: {
      yes: "Yes, everything is ready",
      partly: "Partly",
      no: "Not yet",
    },
  },

  saleQuestions: {
    title: "Tell us about your situation",
    subtitle: "This helps us guide you better through the buying process.",

    buyerProfile: "Who would be buying, and what is your situation?",
    buyerProfileHint:
      "For example: young couple, family with children, investor, second home…",

    searchDuration: "How long have you been looking for a home?",
    searchDurationOptions: {
      justStarted: "We have just started",
      lessThanThree: "Less than three months",
      threeToTwelve: "Three months to a year",
      moreThanYear: "More than a year",
    },

    propertiesVisited: "Roughly how many properties have you viewed?",
    madeOffer: "Have you already made an offer on anything?",
    needToSell: "Do you need to sell another property in order to buy?",
    needsFinancing: "Do you need a mortgage?",
    financingApproved: "Has it already been pre-approved?",
    financingApprovedHint:
      "Having your mortgage pre-approved speeds the process up considerably.",

    firstPurchase: "Is this your first purchase?",
    firstPurchaseOptions: {
      first: "Yes, this is our first purchase",
      experienced: "No, we know the buying process",
    },

    occupation: "What do you do for a living?",
  },

  documents: {
    title: "Documents",
    subtitleRent:
      "Attaching documents speeds up our reply considerably. You can send them now or later on.",
    subtitleSale:
      "If you have any relevant documents you can attach them. This is not required.",
    addFiles: "Add files",
    dropHint: "Drag your files here, or click to choose them",
    accepted: "PDFs and images are accepted, up to 10 MB per file.",
    remove: "Remove",
    suggestionsRent: "Documents usually requested for a rental:",
    suggestionsRentList: [
      "Recent payslips or proof of income",
      "Employment contract",
      "ID card, NIE or passport",
      "Latest tax return (if self-employed)",
    ],
    suggestionsSeasonList: [
      "Identity document (passport, national ID or equivalent)",
      "If you are coming for work or study, something confirming it",
    ],
    skip: "Continue without attaching anything",
    tooLarge: "“{name}” is larger than 10 MB and cannot be attached.",
    wrongType: "“{name}” is not an accepted file type.",
    uploading: "Uploading document {current} of {total}…",
    uploadWait:
      "Please don't close this page while your files are uploading. We'll tell you as soon as your enquiry has been sent.",
    uploadPartial:
      "Your enquiry was sent successfully, but {count} document(s) could not be uploaded. We will get in touch to ask for them.",
    uploadUnavailable:
      "Your enquiry was sent successfully. We will ask you for the documents by email.",
  },

  comment: {
    label: "Anything else you would like to add?",
    placeholder: "Anything you think we should know…",
  },

  consent: {
    title: "Data protection",
    subtitle: "We need your confirmation before sending.",

    gdprVersion: "2026-08-gdpr-v3",
    gdprText:
      "I agree that INMOARTIKO SL (tax ID B56527930), registered in Sagunto (Valencia, Spain), may process my personal data and the documents I provide for the purpose of handling my enquiry about the selected property. I may exercise my rights of access, rectification, erasure, objection, restriction and portability by writing to info@artikore.com.",

    ownerVersion: "2026-08-owner-v2",
    ownerText:
      "I authorise INMOARTIKO SL to share my data and the documents I provide with the owner of the property, for the sole purpose of assessing my application.",

    requiredError: "We need your consent in order to process this enquiry.",
  },

  review: {
    title: "Review your enquiry",
    subtitle: "Please check everything is correct before sending.",
    edit: "Edit",
    sectionOperation: "Enquiry type",
    sectionProperty: "Property",
    sectionPersonal: "Your details",
    sectionQuestions: "Your situation",
    sectionDocuments: "Documents",
    noDocuments: "No documents attached",
    documentCount: "{count} file(s) attached",
  },

  success: {
    title: "We have received your enquiry",
    body: "Thank you for your interest in {property}. We will review your information and get in touch over the coming days.",
    emailSent: "We have sent a confirmation to {email}.",
    signature: "Artiko Real Estate",
  },

  email: {
    subject: "We have received your enquiry · Artiko Real Estate",
    greeting: "Hello {name},",
    received:
      "Thank you for your interest. We have successfully received your {operation} enquiry for the following property:",
    operationRent: "rental",
    operationSale: "purchase",
    nextSteps:
      "We will review the information you have sent and get in touch over the coming days if your profile matches what the owner is looking for.",
    documentsPending:
      "If you were unable to attach all your documents, don't worry: we will ask for them if needed.",
    noReply:
      "This message was generated automatically. You can reply to this email if there is anything else you would like to tell us.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Would you rather talk to a person?",
    whatsappCta: "Message us on WhatsApp",
    /// Enlace personal para volver a la propia solicitud y anadir lo que falte.
    selfServiceIntro:
      "Still need to send us a document? You can add it whenever you like from this link, without filling in the form again.",
    selfServiceCta: "Add documents",
    visitWebsite: "See our properties",
  },

  docs: {
    eyebrow: "Documents",
    greeting: "Hello, {name}",
    intro:
      "Your enquiry about {property} is moving forward. We just need to review a few documents.",
    weNeed: "What we need",
    abroadNote:
      "If you work or have lived outside Spain, send us the equivalent document from your country. It's fine if it's in another language — if we need a translation, we'll ask.",
    spanishNameLabel: "in Spain:",
    selfServiceHere:
      "This is your enquiry about {property}, sent on {date}. You can add any missing documents here — there is no need to fill in the form again.",
    alreadySent: "You have already sent us",
    addFiles: "Add files",
    dropHint: "Drag your documents here, or click to choose them",
    accepted:
      "PDFs and images, up to 10 MB per file. A clear photo of the document is fine.",
    remove: "Remove",
    send: "Send documents",
    sending: "Uploading…",
    successTitle: "Documents received",
    successBody:
      "Thank you. We are reviewing them and will get back to you over the coming days.",
    successPartial:
      "{count} file(s) could not be uploaded. Open the link from the email again and try once more.",
    uploadMore: "Upload something else",
    sessionExpired:
      "Your session expired for security reasons. Reload this page and try again — nothing has been lost.",
    unavailableTitle: "This link is no longer available",
    unavailableBody:
      "We may have sent you a more recent one. Check your email, or write to us and we'll resend it.",
    expiredTitle: "The link has expired",
    expiredBody:
      "For security these links last a limited time. Write to us and we'll send a new one straight away.",
    completedTitle: "We have already received your documents",
    completedBody:
      "Thank you. We are reviewing them and will get back to you over the coming days.",
    emailSubject: "Documents for {property} · Artiko Real Estate",
    emailIntro:
      "Thank you for your interest. Your enquiry matches what we are looking for, so the next step is to review your documents.",
    emailCta: "Upload my documents",
    emailExpiry:
      "The link is personal and expires on {date}. You don't have to upload everything at once — you can come back.",
    items: {
      id: "Identity document (passport, national ID or equivalent)",
      nie: "Spanish foreigner identity number (NIE)",
      residencePermit: "Residence or work permit",
      incomeProof: "Proof of your income for the last three months",
      employmentContract: "Employment contract or a letter from your employer",
      workHistory: "Employment history or proof of length of service",
      taxReturn: "Your latest tax return",
      selfEmployedProof: "Proof that you are registered as self-employed",
      quarterlyTax: "Your most recent quarterly tax filings",
      pensionProof: "Pension certificate or statement",
      companyDocs: "Certificate of incorporation and signing authority",
      representativeId: "Identity document of the person signing",
      companyAccounts: "Latest annual accounts or corporate tax return",
      guarantorDocuments: "Guarantor's documents",
      other: "Other documents",
    },
  },

  footer: {
    agency: "Estate agency in Valencia, Spain",
    website: "Find out more at artikore.com",
    questionsLabel: "Any questions before you send?",
    contact: "Write to us at",
    whatsapp: "Message us on WhatsApp",
  },

  errors: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    invalidNumber: "Please enter numbers only",
    selectProperty: "Choose a property to continue",
    selectOperation: "Choose renting or buying to continue",
    submitFailed:
      "We could not send your enquiry. Please check your connection and try again.",
    fixFields: "Please check the highlighted fields before continuing.",
    tooManySubmissions:
      "You have sent several enquiries in a short time. Please wait a while and try again, or message us on WhatsApp.",
  },
};
