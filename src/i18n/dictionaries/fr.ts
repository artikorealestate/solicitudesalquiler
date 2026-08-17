import type { Dictionary } from "./es";

export const fr: Dictionary = {
  meta: { languageName: "Français" },

  chooser: {
    eyebrow: "Formulaire de demande",
    title: "Dans quelle langue souhaitez-vous continuer ?",
    subtitle:
      "Choisissez votre langue pour remplir le formulaire. Vous pourrez la changer à tout moment.",
    continueIn: "Continuer en français"
  },

  common: {
    next: "Continuer",
    back: "Retour",
    submit: "Envoyer la demande",
    sending: "Envoi en cours…",
    optional: "facultatif",
    required: "obligatoire",
    yes: "Oui",
    no: "Non",
    stepOf: "Étape {current} sur {total}",
    changeLanguage: "Changer de langue",
    selectPlaceholder: "Sélectionnez une option"
  },

  steps: {
    operation: "Votre projet",
    property: "Bien",
    personal: "Vos coordonnées",
    questions: "Votre situation",
    documents: "Documents",
    consent: "Protection des données",
    review: "Récapitulatif"
  },

  operation: {
    title: "Que recherchez-vous ?",
    subtitle: "Les questions s'adaptent à votre choix.",
    rent: {
      label: "Louer un logement",
      description: "Je souhaite louer l'un des biens disponibles"
    },
    sale: {
      label: "Acheter un logement",
      description: "Je souhaite acheter l'un des biens en vente"
    }
  },

  property: {
    title: "Quel bien vous intéresse ?",
    subtitle: "Voici les biens actuellement disponibles.",
    empty:
      "Aucun bien n'est disponible pour ce type de demande pour le moment. Réessayez dans quelques jours.",
    perMonth: "/mois",
    viewOnIdealista: "Voir l'annonce complète",
    selected: "Sélectionné"
  },

  personal: {
    title: "Vos coordonnées",
    subtitle: "Nous en avons besoin pour vous répondre.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Téléphone",
    nationality: "Nationalité",
    idDocument: "Carte d'identité, NIE ou passeport",
    idDocumentHint: "Cela nous aide à préparer les documents du contrat."
  },

  rentQuestions: {
    title: "Parlez-nous de votre situation",
    subtitle:
      "Ces informations nous permettent d'évaluer si le bien vous convient.",

    householdSize: "Combien de personnes habiteraient le logement ?",
    relationship: "Quel est votre lien entre vous ?",
    relationshipOptions: {
      couple: "Couple",
      family: "Famille",
      flatmates: "Colocataires",
      alone: "Je vivrais seul ou seule",
      other: "Autre"
    },

    moveInDate: "À partir de quand souhaiteriez-vous emménager ?",
    occupation: "Quelle est votre activité professionnelle ?",

    employmentType: "Quel type de contrat ou de situation professionnelle avez-vous ?",
    employmentOptions: {
      permanent: "Contrat à durée indéterminée",
      temporary: "Contrat à durée déterminée",
      selfEmployed: "Indépendant",
      civilServant: "Fonctionnaire",
      retired: "Retraité ou pensionné",
      student: "Étudiant",
      unemployed: "Sans emploi actuellement",
      other: "Autre situation"
    },

    provableIncome:
      "Vos revenus peuvent-ils être justifiés par des bulletins de salaire ou documents équivalents ?",
    monthlyIncome: "Quel est le revenu net mensuel du foyer ? (€)",

    solvencyHelp:
      "Le critère habituel est que le loyer ne dépasse pas environ 30 % des revenus nets justifiables du foyer.",
    solvencyForProperty:
      "Pour ce bien, à {rent} € par mois, cela représenterait environ {recommended} € nets mensuels à vous tous.",
    solvencyMet:
      "D'après ce que vous avez indiqué, vous remplissez le critère habituel.",
    solvencyNotMet:
      "Cela reste en dessous du critère habituel. Vous pouvez tout de même continuer : nous l'examinerons avec le reste des informations.",

    pets: "Avez-vous des animaux de compagnie ?",
    petsDetail: "Lesquels ?",
    searchDuration: "Depuis combien de temps cherchez-vous une location ?",
    searchDurationOptions: {
      justStarted: "Nous venons de commencer",
      lessThanMonth: "Moins d'un mois",
      oneToThree: "Entre un et trois mois",
      moreThanThree: "Plus de trois mois"
    },

    visitedOthers: "Avez-vous déjà visité d'autres logements ?",
    documentsReady: "Vos documents sont-ils prêts ?",
    documentsReadyOptions: {
      yes: "Oui, tout est prêt",
      partly: "En partie",
      no: "Pas encore"
    }
  },

  saleQuestions: {
    title: "Parlez-nous de votre situation",
    subtitle:
      "Ces informations nous aident à mieux vous accompagner dans votre achat.",

    buyerProfile: "Qui achèterait, et quelle est votre situation ?",
    buyerProfileHint:
      "Par exemple : jeune couple, famille avec enfants, investisseur, résidence secondaire…",

    searchDuration: "Depuis combien de temps cherchez-vous un logement ?",
    searchDurationOptions: {
      justStarted: "Nous venons de commencer",
      lessThanThree: "Moins de trois mois",
      threeToTwelve: "Entre trois mois et un an",
      moreThanYear: "Plus d'un an"
    },

    propertiesVisited: "Combien de logements avez-vous visités environ ?",
    madeOffer: "Avez-vous déjà fait une offre ?",
    needToSell: "Devez-vous vendre un autre bien pour pouvoir acheter ?",
    needsFinancing: "Avez-vous besoin d'un financement ?",
    financingApproved: "Est-il déjà pré-accordé ?",
    financingApprovedHint:
      "Un financement pré-accordé accélère considérablement l'opération.",

    firstPurchase: "S'agit-il de votre premier achat ?",
    firstPurchaseOptions: {
      first: "Oui, c'est notre premier achat",
      experienced: "Non, nous connaissons déjà le processus d'achat"
    },

    occupation: "Quelle est votre activité professionnelle ?"
  },

  documents: {
    title: "Documents",
    subtitleRent:
      "Joindre vos documents accélère beaucoup notre réponse. Vous pouvez les envoyer maintenant ou plus tard.",
    subtitleSale:
      "Si vous avez des documents utiles, vous pouvez les joindre. Ce n'est pas obligatoire.",
    addFiles: "Ajouter des fichiers",
    dropHint: "Glissez vos fichiers ici, ou cliquez pour les choisir",
    accepted: "PDF et images acceptés, jusqu'à 10 Mo par fichier.",
    remove: "Retirer",
    suggestionsRent: "Documents habituellement demandés pour une location :",
    suggestionsRentList: [
      "Derniers bulletins de salaire ou justificatifs de revenus",
      "Contrat de travail",
      "Carte d'identité, NIE ou passeport",
      "Dernière déclaration de revenus (si indépendant)"
    ],
    skip: "Continuer sans rien joindre",
    tooLarge: "« {name} » dépasse 10 Mo et ne peut pas être joint.",
    wrongType: "« {name} » n'est pas un type de fichier accepté.",
    uploading: "Envoi du document {current} sur {total}…",
    uploadWait:
      "Ne fermez pas cette page pendant l'envoi de vos fichiers. Nous vous préviendrons dès que votre demande sera envoyée.",
    uploadPartial:
      "Votre demande a bien été envoyée, mais {count} document(s) n'ont pas pu être transmis. Nous vous contacterons pour les récupérer.",
    uploadUnavailable:
      "Votre demande a bien été envoyée. Nous vous demanderons les documents par e-mail."
  },

  comment: {
    label: "Souhaitez-vous ajouter quelque chose ?",
    placeholder: "Tout ce que vous jugez utile de nous dire…"
  },

  consent: {
    title: "Protection des données",
    subtitle: "Avant l'envoi, nous avons besoin de votre confirmation.",

    gdprVersion: "2026-08-rgpd-fr-v3",
    gdprText:
      "J'accepte qu'INMOARTIKO SL (numéro fiscal B56527930), domiciliée à Sagunto (Valence, Espagne), traite mes données personnelles et les documents fournis dans le but de gérer ma demande d'information concernant le bien sélectionné. Je peux exercer mes droits d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité en écrivant à info@artikore.com.",

    ownerVersion: "2026-08-proprietaire-v2",
    ownerText:
      "J'autorise INMOARTIKO SL à communiquer mes données et les documents fournis au propriétaire du bien, dans le seul but d'évaluer ma candidature.",

    requiredError:
      "Nous avons besoin de votre consentement pour traiter cette demande."
  },

  review: {
    title: "Vérifiez votre demande",
    subtitle: "Vérifiez que tout est correct avant de l'envoyer.",
    edit: "Modifier",
    sectionOperation: "Votre projet",
    sectionProperty: "Bien",
    sectionPersonal: "Vos coordonnées",
    sectionQuestions: "Votre situation",
    sectionDocuments: "Documents",
    noDocuments: "Aucun document joint",
    documentCount: "{count} fichier(s) joint(s)"
  },

  success: {
    title: "Nous avons bien reçu votre demande",
    body: "Merci de votre intérêt pour {property}. Nous examinerons vos informations et reviendrons vers vous dans les prochains jours.",
    emailSent: "Nous avons envoyé une confirmation à {email}.",
    signature: "Artiko Real Estate"
  },

  email: {
    subject: "Nous avons bien reçu votre demande · Artiko Real Estate",
    greeting: "Bonjour {name},",
    received:
      "Merci de votre intérêt. Nous avons bien reçu votre demande de {operation} pour le bien suivant :",
    operationRent: "location",
    operationSale: "achat",
    nextSteps:
      "Nous examinerons les informations transmises et reviendrons vers vous dans les prochains jours si votre profil correspond aux attentes du propriétaire.",
    documentsPending:
      "Si vous n'avez pas pu joindre tous vos documents, ne vous inquiétez pas : nous vous les demanderons si nécessaire.",
    noReply:
      "Ce message a été généré automatiquement. Vous pouvez répondre à cet e-mail si vous souhaitez nous dire autre chose.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Vous préférez en parler avec quelqu'un ?",
    whatsappCta: "Écrivez-nous sur WhatsApp",
    visitWebsite: "Voir nos biens"
  },

  docs: {
    eyebrow: "Documents",
    greeting: "Bonjour, {name}",
    intro:
      "Votre demande concernant {property} avance. Il ne nous manque plus qu'à examiner quelques documents.",
    weNeed: "Ce dont nous avons besoin",
    abroadNote:
      "Si vous travaillez ou avez vécu hors d'Espagne, envoyez-nous le document équivalent de votre pays. Ce n'est pas grave s'il est dans une autre langue : si nous avons besoin d'une traduction, nous vous le dirons.",
    spanishNameLabel: "en Espagne :",
    alreadySent: "Vous nous avez déjà envoyé",
    addFiles: "Ajouter des fichiers",
    dropHint: "Glissez vos documents ici, ou cliquez pour les choisir",
    accepted:
      "PDF et images, jusqu'à 10 Mo par fichier. Une photo nette du document suffit.",
    remove: "Retirer",
    send: "Envoyer les documents",
    sending: "Envoi en cours…",
    successTitle: "Documents reçus",
    successBody:
      "Merci. Nous les examinons et reviendrons vers vous dans les prochains jours.",
    successPartial:
      "{count} fichier(s) n'ont pas pu être envoyés. Rouvrez le lien reçu par e-mail et réessayez.",
    uploadMore: "Envoyer autre chose",
    sessionExpired:
      "La session a expiré pour des raisons de sécurité. Rechargez cette page et réessayez : rien n'a été perdu.",
    unavailableTitle: "Ce lien n'est plus disponible",
    unavailableBody:
      "Nous vous en avons peut-être envoyé un plus récent. Vérifiez vos e-mails, ou écrivez-nous et nous vous le renverrons.",
    expiredTitle: "Le lien a expiré",
    expiredBody:
      "Par sécurité, ces liens ont une durée limitée. Écrivez-nous et nous vous en envoyons un nouveau tout de suite.",
    completedTitle: "Nous avons déjà reçu vos documents",
    completedBody:
      "Merci. Nous les examinons et reviendrons vers vous dans les prochains jours.",
    emailSubject: "Documents pour {property} · Artiko Real Estate",
    emailIntro:
      "Merci de votre intérêt. Votre demande correspond à ce que nous recherchons : l'étape suivante est l'examen de vos documents.",
    emailCta: "Envoyer mes documents",
    emailExpiry:
      "Le lien est personnel et expire le {date}. Vous n'êtes pas obligé de tout envoyer d'un coup : vous pouvez revenir.",
    items: {
      id: "Pièce d'identité (carte d'identité, passeport ou équivalent)",
      nie: "Numéro d'identité d'étranger en Espagne (NIE)",
      residencePermit: "Titre de séjour ou permis de travail",
      incomeProof: "Justificatifs de vos revenus des trois derniers mois",
      employmentContract: "Contrat de travail ou attestation de votre employeur",
      workHistory: "Historique professionnel ou attestation d'ancienneté",
      taxReturn: "Dernière déclaration de revenus",
      selfEmployedProof: "Justificatif de votre activité indépendante",
      quarterlyTax: "Dernières déclarations fiscales trimestrielles",
      pensionProof: "Attestation ou justificatif de pension",
      companyDocs: "Statuts de la société et pouvoirs en vigueur",
      representativeId: "Pièce d'identité du signataire",
      companyAccounts: "Derniers comptes annuels ou impôt sur les sociétés",
      guarantorDocuments: "Documents du garant",
      other: "Autres documents"
    }
  },

  footer: {
    agency: "Agence immobilière à Valence, Espagne",
    website: "Découvrez-nous sur artikore.com",
    questionsLabel: "Des questions avant d'envoyer ?",
    contact: "Écrivez-nous à",
    whatsapp: "Écrivez-nous sur WhatsApp"
  },

  errors: {
    required: "Ce champ est obligatoire",
    invalidEmail: "Saisissez une adresse e-mail valide",
    invalidPhone: "Saisissez un numéro de téléphone valide",
    invalidNumber: "Saisissez uniquement des chiffres",
    selectProperty: "Choisissez un bien pour continuer",
    selectOperation: "Choisissez location ou achat pour continuer",
    submitFailed:
      "Nous n'avons pas pu envoyer votre demande. Vérifiez votre connexion et réessayez.",
    fixFields: "Vérifiez les champs signalés avant de continuer.",
    tooManySubmissions:
      "Vous avez envoyé plusieurs demandes en peu de temps. Patientez un moment et réessayez, ou écrivez-nous sur WhatsApp."
  }
};
