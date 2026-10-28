import type { Locale } from "./config";

/// Informacion completa de proteccion de datos (segunda capa).
///
/// La primera capa, resumida, esta en el formulario (diccionarios,
/// consent.infoRows) y enlaza aqui. Las dos tienen que decir lo mismo: si se
/// cambia un plazo o un proveedor, hay que cambiarlo en las dos y subir la
/// version de consent.infoVersion.
///
/// Se sirve solo desde el servidor: este texto no viaja en el codigo del
/// formulario, asi que su longitud no le cuesta nada a quien rellena.
///
/// PENDIENTE: revision por un asesor juridico y por nativos, sobre todo en
/// aleman, ruso y ucraniano. Esta redactado con cuidado, pero no lo ha
/// revisado un abogado.

export type PrivacySection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

export type PrivacyPolicy = {
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
};

const CONTROLLER =
  "INMOARTIKO SL · CIF B56527930 · C/ Numancia 6, 2-5, 46500 Sagunto (Valencia) · info@artikore.com";

const es: PrivacyPolicy = {
  title: "Protección de datos",
  updated: "Última actualización: octubre de 2026",
  intro:
    "Aquí te explicamos con detalle qué hacemos con los datos y documentos que nos envías a través de este formulario. Es la información completa; en el formulario tienes un resumen.",
  sections: [
    {
      heading: "Quién es el responsable",
      paragraphs: [CONTROLLER],
    },
    {
      heading: "Qué datos tratamos",
      items: [
        "Datos de identificación y contacto: nombre, apellidos, correo electrónico, teléfono, nacionalidad y número de documento de identidad.",
        "Datos sobre tu solicitud: el inmueble, las fechas, cuántas personas vivirían en él, vuestra relación, ocupación, situación laboral, ingresos declarados, mascotas y el motivo de la estancia. En compras, tu perfil de comprador y la financiación.",
        "La documentación que decidas aportar (identidad, nóminas, contrato de trabajo, declaraciones de impuestos, extractos bancarios, etc.) y los comentarios que escribas. Si vais a firmar varias personas o hay avalista, también la de cada una de ellas: si nos envías documentos de otra persona, enséñale antes esta información.",
        "Una huella cifrada de la dirección de internet desde la que envías el formulario, nunca la dirección en sí, para frenar envíos automáticos.",
      ],
      paragraphs: [
        "No te pedimos datos de salud, ideología, religión ni otras categorías especiales. Si alguno de tus documentos muestra información que no hace falta para valorar la solicitud (por ejemplo, una cuota sindical en la nómina), puedes taparla antes de enviarlo.",
      ],
    },
    {
      heading: "Para qué los usamos",
      items: [
        "Gestionar tu solicitud, comunicarnos contigo y valorar tu candidatura, incluida una orientación sobre solvencia cuando procede.",
        "Presentar tu candidatura a la propiedad del inmueble.",
        "Si sigue adelante, preparar el contrato.",
        "Proteger el formulario frente a envíos automáticos y abusos.",
      ],
    },
    {
      heading: "Con qué base legal",
      items: [
        "Gestionar y valorar tu solicitud, y presentársela a la propiedad: son medidas previas a un posible contrato que nos pides tú (artículo 6.1.b del RGPD).",
        "Proteger el formulario: nuestro interés legítimo en mantener el servicio seguro (artículo 6.1.f).",
        "Conservar el expediente si llegamos a firmar un contrato: el cumplimiento de obligaciones legales (artículo 6.1.c).",
      ],
    },
    {
      heading: "Si tienes que darnos los datos",
      paragraphs: [
        "Los datos marcados como obligatorios en el formulario son necesarios para valorar tu solicitud: sin ellos no podemos tramitarla. La documentación es voluntaria al principio; puede que te la pidamos más adelante si tu candidatura sigue adelante.",
      ],
    },
    {
      heading: "Decisiones automatizadas",
      paragraphs: [
        "No tomamos decisiones automatizadas sobre ti. La orientación de solvencia es un cálculo de apoyo: siempre decide una persona.",
      ],
    },
    {
      heading: "A quién se comunican",
      items: [
        "A la propiedad del inmueble, para que valore tu candidatura. Normalmente le facilitamos un informe con tu perfil, sin tus datos de contacto ni tu número de documento. Si necesita revisar documentación concreta para decidir, se la mostraremos solo con ese fin.",
        "A los proveedores que tratan datos por cuenta nuestra: Google (almacenamiento de documentos y correo electrónico), Supabase (base de datos, alojada en Irlanda) y Vercel (servidor de la aplicación, en Irlanda).",
        "A las autoridades, cuando una ley nos obligue.",
      ],
      paragraphs: [
        "No vendemos tus datos ni los cedemos con fines comerciales.",
      ],
    },
    {
      heading: "Transferencias fuera de la Unión Europea",
      paragraphs: [
        "Algunos de nuestros proveedores son empresas con sede en Estados Unidos y pueden acceder a datos desde allí. En esos casos la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU., reconocido por la Comisión Europea, o en las cláusulas contractuales tipo aprobadas por ella.",
      ],
    },
    {
      heading: "Cuánto tiempo los conservamos",
      items: [
        "Si tu solicitud no sigue adelante, la borramos con todos tus documentos 3 meses después de la última gestión. El borrado es automático.",
        "Si llegamos a firmar un contrato contigo, tus datos pasan al expediente de la operación y se conservan durante los plazos que exige la ley (por ejemplo, fiscales o mercantiles).",
      ],
      paragraphs: [
        'Por "última gestión" entendemos la última vez que tú nos envías algo o que nosotros trabajamos en tu solicitud.',
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: [
        "Puedes pedirnos acceder a tus datos, rectificarlos, suprimirlos, oponerte a su tratamiento, limitarlo o recibirlos en un formato portable.",
        "Escríbenos a info@artikore.com indicando qué quieres. Si no podemos confirmar que eres tú con el correo desde el que nos escribes, te pediremos que lo acredites. Te responderemos en un mes como máximo.",
        "Si crees que no hemos atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
      ],
    },
    {
      heading: "Seguridad",
      paragraphs: [
        "La conexión va cifrada; tus documentos se guardan en carpetas privadas que no se comparten con nadie; solo puede entrar en el panel personal autorizado de Artiko, con verificación de su cuenta; y el servidor y la base de datos están en la Unión Europea.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Este formulario no usa cookies de análisis ni de publicidad. Solo guarda en tu propio navegador un borrador de lo que vas escribiendo para que no lo pierdas, y lo borra al enviar.",
      ],
    },
    {
      heading: "Cambios",
      paragraphs: [
        "Si cambiamos esta información, publicaremos aquí la nueva versión con su fecha.",
      ],
    },
  ],
};

const en: PrivacyPolicy = {
  title: "Data protection",
  updated: "Last updated: October 2026",
  intro:
    "This page explains in detail what we do with the data and documents you send us through this form. It is the full information; the form contains a summary.",
  sections: [
    { heading: "Who is the controller", paragraphs: [CONTROLLER] },
    {
      heading: "What data we process",
      items: [
        "Identification and contact details: first name, surname, email address, phone number, nationality and identity document number.",
        "Details of your application: the property, the dates, how many people would live there, your relationship, occupation, employment situation, declared income, pets and the purpose of your stay. For purchases, your buyer profile and financing.",
        "Any documents you choose to provide (identity, payslips, employment contract, tax returns, bank statements, etc.) and any comments you write. If several people will sign or there is a guarantor, also those of each of them: if you send us another person's documents, show them this information first.",
        "An encrypted fingerprint of the internet address you submit the form from — never the address itself — to stop automated submissions.",
      ],
      paragraphs: [
        "We do not ask for health data, political or religious beliefs or any other special categories of data. If one of your documents shows information that is not needed to assess your application (for example, trade union dues on a payslip), you may cover it before sending.",
      ],
    },
    {
      heading: "What we use it for",
      items: [
        "To handle your application, communicate with you and assess your candidacy, including an affordability indication where relevant.",
        "To present your application to the owner of the property.",
        "If it goes ahead, to prepare the contract.",
        "To protect the form against automated submissions and abuse.",
      ],
    },
    {
      heading: "Legal basis",
      items: [
        "Handling and assessing your application, and presenting it to the owner: steps prior to a possible contract that you ask us to take (Art. 6(1)(b) GDPR).",
        "Protecting the form: our legitimate interest in keeping the service secure (Art. 6(1)(f)).",
        "Keeping the file if we sign a contract with you: compliance with legal obligations (Art. 6(1)(c)).",
      ],
    },
    {
      heading: "Do you have to provide your data?",
      paragraphs: [
        "The fields marked as required in the form are necessary to assess your application: without them we cannot process it. Documents are optional at first; we may ask for them later if your application goes ahead.",
      ],
    },
    {
      heading: "Automated decisions",
      paragraphs: [
        "We do not make automated decisions about you. The affordability indication is a supporting calculation: a person always decides.",
      ],
    },
    {
      heading: "Who we share it with",
      items: [
        "The owner of the property, so they can assess your application. We normally give them a report with your profile, without your contact details or your document number. If they need to review a specific document to decide, we will show it to them for that purpose only.",
        "Providers that process data on our behalf: Google (document storage and email), Supabase (database, hosted in Ireland) and Vercel (application server, in Ireland).",
        "Public authorities, where the law requires it.",
      ],
      paragraphs: [
        "We do not sell your data or share it for marketing purposes.",
      ],
    },
    {
      heading: "Transfers outside the European Union",
      paragraphs: [
        "Some of our providers are companies based in the United States and may access data from there. In those cases the transfer is covered by the EU-US Data Privacy Framework, recognised by the European Commission, or by the standard contractual clauses it has approved.",
      ],
    },
    {
      heading: "How long we keep it",
      items: [
        "If your application does not go ahead, we delete it together with all your documents 3 months after the last action taken on it. Deletion is automatic.",
        "If we sign a contract with you, your data becomes part of the transaction file and is kept for the periods required by law (for example, tax or commercial law).",
      ],
      paragraphs: [
        'By "last action" we mean the last time you sent us something or we worked on your application.',
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask us to access, rectify or erase your data, object to or restrict its processing, or receive it in a portable format.",
        "Write to info@artikore.com saying what you would like. If we cannot confirm it is you from the email address you write from, we will ask you to prove your identity. We will reply within one month at the latest.",
        "If you believe we have not handled your request properly, you can complain to the Spanish Data Protection Agency (www.aepd.es).",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "The connection is encrypted; your documents are stored in private folders that are not shared with anyone; only authorised Artiko staff can access the management panel, with account verification; and the server and database are located in the European Union.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "This form does not use analytics or advertising cookies. It only stores a draft of what you type in your own browser so you do not lose it, and deletes it when you submit.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "If we change this information, we will publish the new version here with its date.",
      ],
    },
  ],
};

const de: PrivacyPolicy = {
  title: "Datenschutz",
  updated: "Zuletzt aktualisiert: Oktober 2026",
  intro:
    "Hier erklären wir ausführlich, was wir mit den Daten und Unterlagen tun, die Sie uns über dieses Formular senden. Dies ist die vollständige Information; im Formular finden Sie eine Zusammenfassung.",
  sections: [
    { heading: "Verantwortlicher", paragraphs: [CONTROLLER] },
    {
      heading: "Welche Daten wir verarbeiten",
      items: [
        "Identifikations- und Kontaktdaten: Vorname, Nachname, E-Mail-Adresse, Telefonnummer, Staatsangehörigkeit und Ausweisnummer.",
        "Angaben zu Ihrer Anfrage: die Immobilie, die Daten, wie viele Personen dort wohnen würden, Ihre Beziehung zueinander, Beruf, Beschäftigungssituation, angegebenes Einkommen, Haustiere und der Zweck des Aufenthalts. Beim Kauf Ihr Käuferprofil und die Finanzierung.",
        "Die Unterlagen, die Sie freiwillig einreichen (Ausweis, Gehaltsabrechnungen, Arbeitsvertrag, Steuererklärungen, Kontoauszüge usw.), und Ihre Kommentare. Unterschreiben mehrere Personen oder gibt es einen Bürgen, auch die Unterlagen jeder dieser Personen: Wenn Sie uns Dokumente einer anderen Person senden, zeigen Sie ihr vorher diese Information.",
        "Ein verschlüsselter Fingerabdruck der Internetadresse, von der aus Sie das Formular senden – nie die Adresse selbst –, um automatisierte Einsendungen zu verhindern.",
      ],
      paragraphs: [
        "Wir fragen nicht nach Gesundheitsdaten, politischen oder religiösen Überzeugungen oder anderen besonderen Kategorien von Daten. Zeigt eines Ihrer Dokumente Informationen, die für die Prüfung nicht nötig sind (zum Beispiel einen Gewerkschaftsbeitrag auf der Gehaltsabrechnung), können Sie diese vor dem Senden abdecken.",
      ],
    },
    {
      heading: "Wofür wir sie verwenden",
      items: [
        "Um Ihre Anfrage zu bearbeiten, mit Ihnen zu kommunizieren und Ihre Bewerbung zu prüfen, gegebenenfalls einschließlich einer Einschätzung der Zahlungsfähigkeit.",
        "Um Ihre Bewerbung dem Eigentümer der Immobilie vorzustellen.",
        "Wenn es weitergeht, um den Vertrag vorzubereiten.",
        "Um das Formular vor automatisierten Einsendungen und Missbrauch zu schützen.",
      ],
    },
    {
      heading: "Rechtsgrundlage",
      items: [
        "Bearbeitung und Prüfung Ihrer Anfrage sowie Vorstellung beim Eigentümer: Schritte vor einem möglichen Vertrag, die Sie bei uns anfragen (Art. 6 Abs. 1 lit. b DSGVO).",
        "Schutz des Formulars: unser berechtigtes Interesse an einem sicheren Dienst (Art. 6 Abs. 1 lit. f).",
        "Aufbewahrung der Akte, wenn wir einen Vertrag mit Ihnen schließen: Erfüllung gesetzlicher Pflichten (Art. 6 Abs. 1 lit. c).",
      ],
    },
    {
      heading: "Müssen Sie uns Ihre Daten geben?",
      paragraphs: [
        "Die im Formular als Pflichtfelder gekennzeichneten Angaben sind nötig, um Ihre Anfrage zu prüfen: Ohne sie können wir sie nicht bearbeiten. Unterlagen sind anfangs freiwillig; wir fordern sie möglicherweise später an, wenn Ihre Bewerbung weitergeht.",
      ],
    },
    {
      heading: "Automatisierte Entscheidungen",
      paragraphs: [
        "Wir treffen keine automatisierten Entscheidungen über Sie. Die Einschätzung der Zahlungsfähigkeit ist eine unterstützende Berechnung: Es entscheidet immer ein Mensch.",
      ],
    },
    {
      heading: "An wen wir sie weitergeben",
      items: [
        "An den Eigentümer der Immobilie, damit er Ihre Bewerbung prüfen kann. In der Regel erhält er einen Bericht über Ihr Profil, ohne Ihre Kontaktdaten und ohne Ihre Ausweisnummer. Braucht er für seine Entscheidung ein bestimmtes Dokument, zeigen wir es ihm nur zu diesem Zweck.",
        "An Dienstleister, die Daten in unserem Auftrag verarbeiten: Google (Speicherung von Dokumenten und E-Mail), Supabase (Datenbank, in Irland gehostet) und Vercel (Server der Anwendung, in Irland).",
        "An Behörden, wenn ein Gesetz uns dazu verpflichtet.",
      ],
      paragraphs: [
        "Wir verkaufen Ihre Daten nicht und geben sie nicht zu Werbezwecken weiter.",
      ],
    },
    {
      heading: "Übermittlungen außerhalb der Europäischen Union",
      paragraphs: [
        "Einige unserer Dienstleister haben ihren Sitz in den USA und können von dort auf Daten zugreifen. In diesen Fällen stützt sich die Übermittlung auf das von der Europäischen Kommission anerkannte EU-US Data Privacy Framework oder auf die von ihr genehmigten Standardvertragsklauseln.",
      ],
    },
    {
      heading: "Wie lange wir sie aufbewahren",
      items: [
        "Kommt Ihre Bewerbung nicht zustande, löschen wir sie mitsamt allen Unterlagen 3 Monate nach dem letzten Bearbeitungsschritt. Die Löschung erfolgt automatisch.",
        "Schließen wir einen Vertrag mit Ihnen, werden Ihre Daten Teil der Vorgangsakte und so lange aufbewahrt, wie es das Gesetz verlangt (zum Beispiel steuer- oder handelsrechtlich).",
      ],
      paragraphs: [
        "Mit „letztem Bearbeitungsschritt“ meinen wir den Zeitpunkt, zu dem Sie uns zuletzt etwas geschickt haben oder wir zuletzt an Ihrer Anfrage gearbeitet haben.",
      ],
    },
    {
      heading: "Ihre Rechte",
      paragraphs: [
        "Sie können Auskunft über Ihre Daten verlangen, sie berichtigen oder löschen lassen, der Verarbeitung widersprechen oder sie einschränken lassen und sie in einem übertragbaren Format erhalten.",
        "Schreiben Sie an info@artikore.com und teilen Sie uns Ihr Anliegen mit. Können wir anhand Ihrer E-Mail-Adresse nicht bestätigen, dass Sie es sind, bitten wir Sie um einen Nachweis. Wir antworten spätestens innerhalb eines Monats.",
        "Wenn Sie meinen, dass wir Ihr Anliegen nicht ordnungsgemäß behandelt haben, können Sie sich bei der spanischen Datenschutzbehörde beschweren (www.aepd.es).",
      ],
    },
    {
      heading: "Sicherheit",
      paragraphs: [
        "Die Verbindung ist verschlüsselt; Ihre Unterlagen liegen in privaten Ordnern, die mit niemandem geteilt werden; nur befugtes Personal von Artiko kann das Verwaltungspanel nutzen, mit Kontoüberprüfung; Server und Datenbank befinden sich in der Europäischen Union.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Dieses Formular verwendet keine Analyse- oder Werbe-Cookies. Es speichert nur in Ihrem eigenen Browser einen Entwurf Ihrer Eingaben, damit nichts verloren geht, und löscht ihn beim Absenden.",
      ],
    },
    {
      heading: "Änderungen",
      paragraphs: [
        "Wenn wir diese Informationen ändern, veröffentlichen wir die neue Fassung hier mit Datum.",
      ],
    },
  ],
};

const fr: PrivacyPolicy = {
  title: "Protection des données",
  updated: "Dernière mise à jour : octobre 2026",
  intro:
    "Nous vous expliquons ici en détail ce que nous faisons des données et des documents que vous nous envoyez via ce formulaire. Il s'agit de l'information complète ; le formulaire en contient un résumé.",
  sections: [
    { heading: "Responsable du traitement", paragraphs: [CONTROLLER] },
    {
      heading: "Quelles données nous traitons",
      items: [
        "Données d'identification et de contact : prénom, nom, adresse e-mail, téléphone, nationalité et numéro de pièce d'identité.",
        "Données relatives à votre demande : le bien, les dates, le nombre de personnes qui y vivraient, votre lien, votre profession, votre situation professionnelle, vos revenus déclarés, vos animaux et le motif du séjour. Pour un achat, votre profil d'acheteur et le financement.",
        "Les documents que vous choisissez de fournir (identité, fiches de paie, contrat de travail, déclarations d'impôts, relevés bancaires, etc.) et vos commentaires. Si plusieurs personnes signent ou s'il y a un garant, également ceux de chacune d'elles : si vous nous envoyez les documents d'une autre personne, montrez-lui d'abord ces informations.",
        "Une empreinte chiffrée de l'adresse internet depuis laquelle vous envoyez le formulaire — jamais l'adresse elle-même — pour freiner les envois automatisés.",
      ],
      paragraphs: [
        "Nous ne vous demandons pas de données de santé, d'opinions politiques ou religieuses ni d'autres catégories particulières de données. Si l'un de vos documents contient des informations inutiles à l'évaluation de votre demande (par exemple une cotisation syndicale sur une fiche de paie), vous pouvez les masquer avant de l'envoyer.",
      ],
    },
    {
      heading: "À quoi nous les utilisons",
      items: [
        "Gérer votre demande, communiquer avec vous et évaluer votre candidature, y compris une indication de solvabilité le cas échéant.",
        "Présenter votre candidature au propriétaire du bien.",
        "Si elle aboutit, préparer le contrat.",
        "Protéger le formulaire contre les envois automatisés et les abus.",
      ],
    },
    {
      heading: "Base juridique",
      items: [
        "Gérer et évaluer votre demande, et la présenter au propriétaire : démarches préalables à un éventuel contrat, que vous nous demandez (art. 6.1.b du RGPD).",
        "Protéger le formulaire : notre intérêt légitime à maintenir un service sûr (art. 6.1.f).",
        "Conserver le dossier si nous signons un contrat avec vous : le respect d'obligations légales (art. 6.1.c).",
      ],
    },
    {
      heading: "Devez-vous nous fournir vos données ?",
      paragraphs: [
        "Les champs marqués comme obligatoires dans le formulaire sont nécessaires pour évaluer votre demande : sans eux, nous ne pouvons pas la traiter. Les documents sont facultatifs au départ ; nous pourrons vous les demander plus tard si votre candidature avance.",
      ],
    },
    {
      heading: "Décisions automatisées",
      paragraphs: [
        "Nous ne prenons aucune décision automatisée vous concernant. L'indication de solvabilité est un calcul d'appui : c'est toujours une personne qui décide.",
      ],
    },
    {
      heading: "À qui nous les communiquons",
      items: [
        "Au propriétaire du bien, afin qu'il évalue votre candidature. Nous lui remettons normalement un rapport sur votre profil, sans vos coordonnées ni votre numéro de pièce d'identité. S'il doit examiner un document précis pour décider, nous le lui montrerons uniquement à cette fin.",
        "Aux prestataires qui traitent des données pour notre compte : Google (stockage des documents et messagerie), Supabase (base de données, hébergée en Irlande) et Vercel (serveur de l'application, en Irlande).",
        "Aux autorités, lorsque la loi nous y oblige.",
      ],
      paragraphs: [
        "Nous ne vendons pas vos données et ne les cédons pas à des fins commerciales.",
      ],
    },
    {
      heading: "Transferts hors de l'Union européenne",
      paragraphs: [
        "Certains de nos prestataires sont des entreprises établies aux États-Unis et peuvent accéder aux données depuis ce pays. Dans ce cas, le transfert repose sur le cadre de protection des données UE-États-Unis, reconnu par la Commission européenne, ou sur les clauses contractuelles types qu'elle a approuvées.",
      ],
    },
    {
      heading: "Durée de conservation",
      items: [
        "Si votre demande n'aboutit pas, nous la supprimons avec tous vos documents 3 mois après la dernière démarche. La suppression est automatique.",
        "Si nous signons un contrat avec vous, vos données rejoignent le dossier de l'opération et sont conservées pendant les durées exigées par la loi (par exemple en matière fiscale ou commerciale).",
      ],
      paragraphs: [
        "Par « dernière démarche », nous entendons la dernière fois que vous nous avez envoyé quelque chose ou que nous avons travaillé sur votre demande.",
      ],
    },
    {
      heading: "Vos droits",
      paragraphs: [
        "Vous pouvez nous demander d'accéder à vos données, de les rectifier ou de les effacer, vous opposer à leur traitement ou le faire limiter, ou les recevoir dans un format portable.",
        "Écrivez à info@artikore.com en précisant votre demande. Si nous ne pouvons pas confirmer votre identité à partir de l'adresse e-mail utilisée, nous vous demanderons de la justifier. Nous vous répondrons dans un délai d'un mois au plus.",
        "Si vous estimez que nous n'avons pas traité correctement votre demande, vous pouvez introduire une réclamation auprès de l'Agence espagnole de protection des données (www.aepd.es).",
      ],
    },
    {
      heading: "Sécurité",
      paragraphs: [
        "La connexion est chiffrée ; vos documents sont conservés dans des dossiers privés qui ne sont partagés avec personne ; seul le personnel autorisé d'Artiko peut accéder au panneau de gestion, avec vérification de son compte ; le serveur et la base de données se trouvent dans l'Union européenne.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Ce formulaire n'utilise pas de cookies d'analyse ni de publicité. Il enregistre seulement dans votre propre navigateur un brouillon de ce que vous saisissez pour que vous ne le perdiez pas, et le supprime à l'envoi.",
      ],
    },
    {
      heading: "Modifications",
      paragraphs: [
        "Si nous modifions ces informations, nous publierons ici la nouvelle version avec sa date.",
      ],
    },
  ],
};

const it: PrivacyPolicy = {
  title: "Protezione dei dati",
  updated: "Ultimo aggiornamento: ottobre 2026",
  intro:
    "Qui ti spieghiamo nel dettaglio cosa facciamo con i dati e i documenti che ci invii tramite questo modulo. È l'informativa completa; nel modulo ne trovi un riassunto.",
  sections: [
    { heading: "Chi è il titolare", paragraphs: [CONTROLLER] },
    {
      heading: "Quali dati trattiamo",
      items: [
        "Dati identificativi e di contatto: nome, cognome, e-mail, telefono, nazionalità e numero del documento d'identità.",
        "Dati sulla tua richiesta: l'immobile, le date, quante persone ci vivrebbero, il vostro rapporto, la professione, la situazione lavorativa, il reddito dichiarato, gli animali domestici e il motivo del soggiorno. Per gli acquisti, il tuo profilo di acquirente e il finanziamento.",
        "I documenti che decidi di fornire (identità, buste paga, contratto di lavoro, dichiarazioni dei redditi, estratti conto, ecc.) e i commenti che scrivi. Se firmano più persone o c'è un garante, anche quelli di ciascuna di esse: se ci invii documenti di un'altra persona, mostrale prima queste informazioni.",
        "Un'impronta cifrata dell'indirizzo internet da cui invii il modulo — mai l'indirizzo stesso — per frenare gli invii automatici.",
      ],
      paragraphs: [
        "Non ti chiediamo dati sulla salute, opinioni politiche o religiose né altre categorie particolari di dati. Se un tuo documento mostra informazioni non necessarie per valutare la richiesta (ad esempio una quota sindacale in busta paga), puoi coprirle prima di inviarlo.",
      ],
    },
    {
      heading: "Per cosa li usiamo",
      items: [
        "Gestire la tua richiesta, comunicare con te e valutare la tua candidatura, compresa un'indicazione sulla solvibilità quando serve.",
        "Presentare la tua candidatura alla proprietà dell'immobile.",
        "Se va avanti, preparare il contratto.",
        "Proteggere il modulo da invii automatici e abusi.",
      ],
    },
    {
      heading: "Base giuridica",
      items: [
        "Gestire e valutare la tua richiesta e presentarla alla proprietà: passaggi preliminari a un possibile contratto che ci chiedi tu (art. 6.1.b del GDPR).",
        "Proteggere il modulo: il nostro legittimo interesse a mantenere sicuro il servizio (art. 6.1.f).",
        "Conservare la pratica se firmiamo un contratto con te: l'adempimento di obblighi di legge (art. 6.1.c).",
      ],
    },
    {
      heading: "Devi fornirci i dati?",
      paragraphs: [
        "I dati indicati come obbligatori nel modulo sono necessari per valutare la tua richiesta: senza di essi non possiamo gestirla. I documenti all'inizio sono facoltativi; potremmo chiederteli più avanti se la tua candidatura prosegue.",
      ],
    },
    {
      heading: "Decisioni automatizzate",
      paragraphs: [
        "Non prendiamo decisioni automatizzate su di te. L'indicazione sulla solvibilità è un calcolo di supporto: decide sempre una persona.",
      ],
    },
    {
      heading: "A chi li comunichiamo",
      items: [
        "Alla proprietà dell'immobile, perché valuti la tua candidatura. Di norma le forniamo un resoconto del tuo profilo, senza i tuoi dati di contatto né il numero del documento. Se deve esaminare un documento specifico per decidere, glielo mostreremo solo a quel fine.",
        "Ai fornitori che trattano dati per nostro conto: Google (archiviazione dei documenti e posta elettronica), Supabase (database, ospitato in Irlanda) e Vercel (server dell'applicazione, in Irlanda).",
        "Alle autorità, quando la legge ci obbliga.",
      ],
      paragraphs: [
        "Non vendiamo i tuoi dati né li cediamo a fini commerciali.",
      ],
    },
    {
      heading: "Trasferimenti fuori dall'Unione europea",
      paragraphs: [
        "Alcuni dei nostri fornitori sono aziende con sede negli Stati Uniti e possono accedere ai dati da lì. In questi casi il trasferimento si basa sul Data Privacy Framework UE-USA, riconosciuto dalla Commissione europea, o sulle clausole contrattuali tipo da essa approvate.",
      ],
    },
    {
      heading: "Per quanto tempo li conserviamo",
      items: [
        "Se la tua richiesta non va avanti, la cancelliamo con tutti i tuoi documenti 3 mesi dopo l'ultima gestione. La cancellazione è automatica.",
        "Se firmiamo un contratto con te, i tuoi dati entrano nella pratica dell'operazione e vengono conservati per i periodi richiesti dalla legge (ad esempio fiscali o commerciali).",
      ],
      paragraphs: [
        'Per "ultima gestione" intendiamo l\'ultima volta che ci hai inviato qualcosa o che abbiamo lavorato sulla tua richiesta.',
      ],
    },
    {
      heading: "I tuoi diritti",
      paragraphs: [
        "Puoi chiederci di accedere ai tuoi dati, rettificarli, cancellarli, opporti al trattamento o limitarlo, o riceverli in un formato portabile.",
        "Scrivi a info@artikore.com indicando cosa desideri. Se non possiamo confermare che sei tu dall'indirizzo e-mail da cui scrivi, ti chiederemo di dimostrarlo. Ti risponderemo entro un mese al massimo.",
        "Se ritieni che non abbiamo gestito correttamente la tua richiesta, puoi presentare reclamo all'Agenzia spagnola per la protezione dei dati (www.aepd.es).",
      ],
    },
    {
      heading: "Sicurezza",
      paragraphs: [
        "La connessione è cifrata; i tuoi documenti sono conservati in cartelle private non condivise con nessuno; solo il personale autorizzato di Artiko può accedere al pannello di gestione, con verifica dell'account; server e database si trovano nell'Unione europea.",
      ],
    },
    {
      heading: "Cookie",
      paragraphs: [
        "Questo modulo non usa cookie di analisi né pubblicitari. Salva solo nel tuo browser una bozza di ciò che scrivi per non perderla, e la cancella all'invio.",
      ],
    },
    {
      heading: "Modifiche",
      paragraphs: [
        "Se modifichiamo queste informazioni, pubblicheremo qui la nuova versione con la sua data.",
      ],
    },
  ],
};

const pt: PrivacyPolicy = {
  title: "Proteção de dados",
  updated: "Última atualização: outubro de 2026",
  intro:
    "Aqui explicamos em detalhe o que fazemos com os dados e documentos que nos envia através deste formulário. É a informação completa; no formulário tem um resumo.",
  sections: [
    { heading: "Quem é o responsável", paragraphs: [CONTROLLER] },
    {
      heading: "Que dados tratamos",
      items: [
        "Dados de identificação e contacto: nome, apelidos, e-mail, telefone, nacionalidade e número do documento de identificação.",
        "Dados sobre o seu pedido: o imóvel, as datas, quantas pessoas viveriam nele, a vossa relação, profissão, situação laboral, rendimentos declarados, animais de estimação e o motivo da estadia. Nas compras, o seu perfil de comprador e o financiamento.",
        "Os documentos que decida enviar (identificação, recibos de vencimento, contrato de trabalho, declarações de impostos, extratos bancários, etc.) e os comentários que escrever. Se vão assinar várias pessoas ou houver fiador, também os de cada uma delas: se nos enviar documentos de outra pessoa, mostre-lhe antes esta informação.",
        "Uma impressão cifrada do endereço de internet a partir do qual envia o formulário — nunca o endereço em si — para travar envios automáticos.",
      ],
      paragraphs: [
        "Não lhe pedimos dados de saúde, convicções políticas ou religiosas nem outras categorias especiais de dados. Se algum dos seus documentos mostrar informação que não é necessária para avaliar o pedido (por exemplo, uma quota sindical no recibo de vencimento), pode tapá-la antes de o enviar.",
      ],
    },
    {
      heading: "Para que os usamos",
      items: [
        "Gerir o seu pedido, comunicar consigo e avaliar a sua candidatura, incluindo uma orientação sobre solvência quando aplicável.",
        "Apresentar a sua candidatura ao proprietário do imóvel.",
        "Se avançar, preparar o contrato.",
        "Proteger o formulário contra envios automáticos e abusos.",
      ],
    },
    {
      heading: "Fundamento jurídico",
      items: [
        "Gerir e avaliar o seu pedido e apresentá-lo ao proprietário: diligências prévias a um possível contrato, a seu pedido (art. 6.º, n.º 1, alínea b), do RGPD).",
        "Proteger o formulário: o nosso interesse legítimo em manter o serviço seguro (alínea f)).",
        "Conservar o processo se celebrarmos um contrato consigo: o cumprimento de obrigações legais (alínea c)).",
      ],
    },
    {
      heading: "Tem de nos fornecer os dados?",
      paragraphs: [
        "Os dados assinalados como obrigatórios no formulário são necessários para avaliar o seu pedido: sem eles não o podemos tratar. Os documentos são opcionais no início; poderemos pedi-los mais tarde se a sua candidatura avançar.",
      ],
    },
    {
      heading: "Decisões automatizadas",
      paragraphs: [
        "Não tomamos decisões automatizadas sobre si. A orientação sobre solvência é um cálculo de apoio: decide sempre uma pessoa.",
      ],
    },
    {
      heading: "A quem os comunicamos",
      items: [
        "Ao proprietário do imóvel, para que avalie a sua candidatura. Normalmente entregamos-lhe um relatório com o seu perfil, sem os seus contactos nem o número do documento. Se precisar de ver um documento concreto para decidir, mostrar-lho-emos apenas para esse fim.",
        "Aos fornecedores que tratam dados por nossa conta: Google (armazenamento de documentos e correio eletrónico), Supabase (base de dados, alojada na Irlanda) e Vercel (servidor da aplicação, na Irlanda).",
        "Às autoridades, quando a lei o exigir.",
      ],
      paragraphs: [
        "Não vendemos os seus dados nem os cedemos para fins comerciais.",
      ],
    },
    {
      heading: "Transferências para fora da União Europeia",
      paragraphs: [
        "Alguns dos nossos fornecedores são empresas com sede nos Estados Unidos e podem aceder a dados a partir daí. Nesses casos, a transferência assenta no Quadro de Privacidade de Dados UE-EUA, reconhecido pela Comissão Europeia, ou nas cláusulas contratuais-tipo por ela aprovadas.",
      ],
    },
    {
      heading: "Durante quanto tempo os conservamos",
      items: [
        "Se o seu pedido não avançar, apagamo-lo com todos os seus documentos 3 meses após a última diligência. O apagamento é automático.",
        "Se celebrarmos um contrato consigo, os seus dados passam para o processo da operação e são conservados pelos prazos exigidos por lei (por exemplo, fiscais ou comerciais).",
      ],
      paragraphs: [
        'Por "última diligência" entendemos a última vez que nos enviou algo ou que trabalhámos no seu pedido.',
      ],
    },
    {
      heading: "Os seus direitos",
      paragraphs: [
        "Pode pedir-nos acesso aos seus dados, a sua retificação ou apagamento, opor-se ao tratamento ou limitá-lo, ou recebê-los num formato portável.",
        "Escreva para info@artikore.com indicando o que pretende. Se não conseguirmos confirmar a sua identidade a partir do e-mail que utiliza, pedir-lhe-emos que a comprove. Responderemos no prazo máximo de um mês.",
        "Se considerar que não tratámos bem o seu pedido, pode apresentar reclamação junto da Agência Espanhola de Proteção de Dados (www.aepd.es).",
      ],
    },
    {
      heading: "Segurança",
      paragraphs: [
        "A ligação é cifrada; os seus documentos ficam em pastas privadas que não são partilhadas com ninguém; só pessoal autorizado da Artiko pode aceder ao painel de gestão, com verificação da conta; o servidor e a base de dados estão na União Europeia.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Este formulário não usa cookies de análise nem de publicidade. Apenas guarda no seu próprio navegador um rascunho do que vai escrevendo, para não o perder, e apaga-o ao enviar.",
      ],
    },
    {
      heading: "Alterações",
      paragraphs: [
        "Se alterarmos esta informação, publicaremos aqui a nova versão com a respetiva data.",
      ],
    },
  ],
};

const nl: PrivacyPolicy = {
  title: "Gegevensbescherming",
  updated: "Laatst bijgewerkt: oktober 2026",
  intro:
    "Hier leggen we uitgebreid uit wat we doen met de gegevens en documenten die u ons via dit formulier stuurt. Dit is de volledige informatie; in het formulier vindt u een samenvatting.",
  sections: [
    {
      heading: "Wie is de verwerkingsverantwoordelijke",
      paragraphs: [CONTROLLER],
    },
    {
      heading: "Welke gegevens we verwerken",
      items: [
        "Identificatie- en contactgegevens: voornaam, achternaam, e-mailadres, telefoonnummer, nationaliteit en nummer van uw identiteitsbewijs.",
        "Gegevens over uw aanvraag: de woning, de data, hoeveel personen er zouden wonen, uw onderlinge relatie, beroep, arbeidssituatie, opgegeven inkomen, huisdieren en het doel van het verblijf. Bij koop: uw kopersprofiel en de financiering.",
        "De documenten die u vrijwillig aanlevert (identiteit, loonstroken, arbeidscontract, belastingaangiften, bankafschriften, enz.) en uw opmerkingen. Als meerdere personen tekenen of er een borg is, ook die van ieder van hen: als u ons documenten van een ander stuurt, laat die persoon dan eerst deze informatie zien.",
        "Een versleutelde vingerafdruk van het internetadres waarvandaan u het formulier verstuurt — nooit het adres zelf — om geautomatiseerde inzendingen tegen te gaan.",
      ],
      paragraphs: [
        "We vragen geen gezondheidsgegevens, politieke of religieuze overtuigingen of andere bijzondere categorieën van gegevens. Toont een van uw documenten informatie die niet nodig is om de aanvraag te beoordelen (bijvoorbeeld vakbondscontributie op een loonstrook), dan mag u die afdekken voordat u het verstuurt.",
      ],
    },
    {
      heading: "Waarvoor we ze gebruiken",
      items: [
        "Uw aanvraag behandelen, met u communiceren en uw kandidatuur beoordelen, zo nodig met een indicatie van uw betaalcapaciteit.",
        "Uw kandidatuur voorleggen aan de eigenaar van de woning.",
        "Als het doorgaat, het contract voorbereiden.",
        "Het formulier beschermen tegen geautomatiseerde inzendingen en misbruik.",
      ],
    },
    {
      heading: "Rechtsgrond",
      items: [
        "Uw aanvraag behandelen en beoordelen en aan de eigenaar voorleggen: stappen voorafgaand aan een mogelijk contract, waar u zelf om vraagt (art. 6, lid 1, onder b, AVG).",
        "Het formulier beschermen: ons gerechtvaardigd belang bij een veilige dienst (onder f).",
        "Het dossier bewaren als we een contract met u sluiten: het nakomen van wettelijke verplichtingen (onder c).",
      ],
    },
    {
      heading: "Moet u ons uw gegevens geven?",
      paragraphs: [
        "De velden die in het formulier als verplicht zijn aangegeven, zijn nodig om uw aanvraag te beoordelen: zonder die gegevens kunnen we haar niet behandelen. Documenten zijn in het begin vrijwillig; we kunnen er later om vragen als uw kandidatuur doorgaat.",
      ],
    },
    {
      heading: "Geautomatiseerde besluiten",
      paragraphs: [
        "We nemen geen geautomatiseerde besluiten over u. De indicatie van uw betaalcapaciteit is een ondersteunende berekening: er beslist altijd een mens.",
      ],
    },
    {
      heading: "Met wie we ze delen",
      items: [
        "Met de eigenaar van de woning, zodat die uw kandidatuur kan beoordelen. Meestal krijgt die een verslag van uw profiel, zonder uw contactgegevens en zonder het nummer van uw identiteitsbewijs. Heeft de eigenaar een bepaald document nodig om te beslissen, dan tonen we het alleen voor dat doel.",
        "Met leveranciers die gegevens namens ons verwerken: Google (opslag van documenten en e-mail), Supabase (database, gehost in Ierland) en Vercel (server van de applicatie, in Ierland).",
        "Met overheidsinstanties, als de wet ons daartoe verplicht.",
      ],
      paragraphs: [
        "We verkopen uw gegevens niet en geven ze niet door voor commerciële doeleinden.",
      ],
    },
    {
      heading: "Doorgifte buiten de Europese Unie",
      paragraphs: [
        "Sommige van onze leveranciers zijn in de Verenigde Staten gevestigd en kunnen van daaruit bij gegevens komen. In die gevallen is de doorgifte gebaseerd op het EU-VS-kader voor gegevensbescherming, erkend door de Europese Commissie, of op de door haar goedgekeurde modelcontractbepalingen.",
      ],
    },
    {
      heading: "Hoe lang we ze bewaren",
      items: [
        "Gaat uw aanvraag niet door, dan verwijderen we haar met al uw documenten 3 maanden na de laatste handeling. Het verwijderen gebeurt automatisch.",
        "Sluiten we een contract met u, dan worden uw gegevens onderdeel van het dossier van de transactie en bewaard zo lang als de wet voorschrijft (bijvoorbeeld fiscaal of handelsrechtelijk).",
      ],
      paragraphs: [
        'Met "laatste handeling" bedoelen we de laatste keer dat u ons iets stuurde of dat wij aan uw aanvraag werkten.',
      ],
    },
    {
      heading: "Uw rechten",
      paragraphs: [
        "U kunt ons vragen om inzage in uw gegevens, rectificatie of wissing, bezwaar maken tegen de verwerking of die laten beperken, of uw gegevens in een overdraagbaar formaat ontvangen.",
        "Schrijf naar info@artikore.com en vermeld wat u wilt. Als we aan de hand van uw e-mailadres niet kunnen vaststellen dat u het bent, vragen we u dat aan te tonen. We antwoorden uiterlijk binnen een maand.",
        "Vindt u dat we uw verzoek niet goed hebben behandeld, dan kunt u een klacht indienen bij de Spaanse toezichthouder (www.aepd.es).",
      ],
    },
    {
      heading: "Beveiliging",
      paragraphs: [
        "De verbinding is versleuteld; uw documenten staan in privémappen die met niemand worden gedeeld; alleen bevoegde medewerkers van Artiko hebben toegang tot het beheerpaneel, met verificatie van hun account; server en database staan in de Europese Unie.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Dit formulier gebruikt geen analyse- of advertentiecookies. Het bewaart alleen in uw eigen browser een concept van wat u invult, zodat u het niet kwijtraakt, en verwijdert dat bij het verzenden.",
      ],
    },
    {
      heading: "Wijzigingen",
      paragraphs: [
        "Als we deze informatie wijzigen, publiceren we hier de nieuwe versie met datum.",
      ],
    },
  ],
};

const ru: PrivacyPolicy = {
  title: "Защита данных",
  updated: "Последнее обновление: октябрь 2026 г.",
  intro:
    "Здесь мы подробно объясняем, что делаем с данными и документами, которые вы отправляете через эту форму. Это полная информация; в самой форме приведено краткое изложение.",
  sections: [
    { heading: "Кто отвечает за обработку", paragraphs: [CONTROLLER] },
    {
      heading: "Какие данные мы обрабатываем",
      items: [
        "Идентификационные и контактные данные: имя, фамилия, адрес электронной почты, телефон, гражданство и номер документа, удостоверяющего личность.",
        "Сведения о заявке: объект, даты, сколько человек будет проживать, ваши отношения, род занятий, трудовое положение, заявленный доход, домашние животные и цель проживания. При покупке — ваш профиль покупателя и финансирование.",
        "Документы, которые вы решите предоставить (удостоверение личности, расчётные листки, трудовой договор, налоговые декларации, банковские выписки и т. д.), и ваши комментарии. Если договор подписывают несколько человек или есть поручитель — также документы каждого из них: если вы присылаете нам документы другого человека, сначала покажите ему эту информацию.",
        "Зашифрованный отпечаток интернет-адреса, с которого отправлена форма, — никогда не сам адрес — чтобы препятствовать автоматическим отправкам.",
      ],
      paragraphs: [
        "Мы не запрашиваем данные о здоровье, политических или религиозных убеждениях и другие особые категории данных. Если в каком-либо документе есть сведения, не нужные для рассмотрения заявки (например, профсоюзный взнос в расчётном листке), вы можете закрыть их перед отправкой.",
      ],
    },
    {
      heading: "Для чего мы их используем",
      items: [
        "Чтобы обработать вашу заявку, связываться с вами и рассматривать вашу кандидатуру, в том числе с ориентировочной оценкой платёжеспособности, когда это уместно.",
        "Чтобы представить вашу кандидатуру собственнику объекта.",
        "Если всё сложится, — чтобы подготовить договор.",
        "Чтобы защищать форму от автоматических отправок и злоупотреблений.",
      ],
    },
    {
      heading: "Правовое основание",
      items: [
        "Обработка и рассмотрение заявки и её представление собственнику: действия, предшествующие возможному договору, о которых вы нас просите (ст. 6.1.b GDPR).",
        "Защита формы: наш законный интерес в безопасной работе сервиса (ст. 6.1.f).",
        "Хранение дела, если мы заключим с вами договор: выполнение требований закона (ст. 6.1.c).",
      ],
    },
    {
      heading: "Обязаны ли вы предоставлять данные",
      paragraphs: [
        "Поля, отмеченные в форме как обязательные, необходимы для рассмотрения заявки: без них мы не сможем её обработать. Документы на первом этапе предоставляются по желанию; мы можем запросить их позже, если ваша кандидатура пройдёт дальше.",
      ],
    },
    {
      heading: "Автоматизированные решения",
      paragraphs: [
        "Мы не принимаем в отношении вас автоматизированных решений. Оценка платёжеспособности — вспомогательный расчёт: решение всегда принимает человек.",
      ],
    },
    {
      heading: "Кому мы их передаём",
      items: [
        "Собственнику объекта — чтобы он рассмотрел вашу кандидатуру. Обычно мы передаём ему отчёт о вашем профиле без контактных данных и номера документа. Если для решения ему нужно посмотреть конкретный документ, мы покажем его только с этой целью.",
        "Поставщикам, обрабатывающим данные по нашему поручению: Google (хранение документов и электронная почта), Supabase (база данных, размещена в Ирландии) и Vercel (сервер приложения, в Ирландии).",
        "Государственным органам, если этого требует закон.",
      ],
      paragraphs: [
        "Мы не продаём ваши данные и не передаём их в коммерческих целях.",
      ],
    },
    {
      heading: "Передача за пределы Европейского союза",
      paragraphs: [
        "Некоторые наши поставщики — компании с головным офисом в США и могут получать доступ к данным оттуда. В таких случаях передача основывается на Рамочной программе ЕС–США по защите данных (Data Privacy Framework), признанной Европейской комиссией, или на утверждённых ею стандартных договорных положениях.",
      ],
    },
    {
      heading: "Сколько мы их храним",
      items: [
        "Если ваша заявка не будет продолжена, мы удалим её вместе со всеми документами через 3 месяца после последнего действия по ней. Удаление происходит автоматически.",
        "Если мы заключим с вами договор, ваши данные войдут в дело по сделке и будут храниться в течение сроков, установленных законом (например, налоговым или коммерческим).",
      ],
      paragraphs: [
        "Под «последним действием» мы понимаем последний раз, когда вы что-то нам отправили или мы работали с вашей заявкой.",
      ],
    },
    {
      heading: "Ваши права",
      paragraphs: [
        "Вы можете запросить доступ к своим данным, их исправление или удаление, возразить против обработки или ограничить её, а также получить данные в переносимом формате.",
        "Напишите на info@artikore.com, указав ваш запрос. Если по адресу электронной почты мы не сможем подтвердить, что это вы, мы попросим подтвердить личность. Мы ответим не позднее чем через месяц.",
        "Если вы считаете, что мы ненадлежащим образом рассмотрели ваш запрос, вы можете подать жалобу в Испанское агентство по защите данных (www.aepd.es).",
      ],
    },
    {
      heading: "Безопасность",
      paragraphs: [
        "Соединение зашифровано; ваши документы хранятся в закрытых папках, к которым нет доступа у посторонних; в панель управления может входить только уполномоченный персонал Artiko с проверкой учётной записи; сервер и база данных находятся в Европейском союзе.",
      ],
    },
    {
      heading: "Файлы cookie",
      paragraphs: [
        "Эта форма не использует аналитические и рекламные файлы cookie. Она лишь сохраняет в вашем собственном браузере черновик того, что вы вводите, чтобы он не потерялся, и удаляет его при отправке.",
      ],
    },
    {
      heading: "Изменения",
      paragraphs: [
        "Если мы изменим эту информацию, мы опубликуем здесь новую версию с датой.",
      ],
    },
  ],
};

const uk: PrivacyPolicy = {
  title: "Захист даних",
  updated: "Останнє оновлення: жовтень 2026 р.",
  intro:
    "Тут ми докладно пояснюємо, що робимо з даними та документами, які ви надсилаєте через цю форму. Це повна інформація; у самій формі наведено короткий виклад.",
  sections: [
    { heading: "Хто відповідає за обробку", paragraphs: [CONTROLLER] },
    {
      heading: "Які дані ми обробляємо",
      items: [
        "Ідентифікаційні та контактні дані: ім'я, прізвище, адреса електронної пошти, телефон, громадянство та номер документа, що посвідчує особу.",
        "Відомості про заявку: об'єкт, дати, скільки осіб проживатиме, ваші стосунки, рід занять, трудове становище, заявлений дохід, домашні тварини та мета проживання. У разі купівлі — ваш профіль покупця та фінансування.",
        "Документи, які ви вирішите надати (посвідчення особи, розрахункові листи, трудовий договір, податкові декларації, банківські виписки тощо), і ваші коментарі. Якщо договір підписують кілька людей або є поручитель — також документи кожного з них: якщо ви надсилаєте нам документи іншої людини, спершу покажіть їй цю інформацію.",
        "Зашифрований відбиток інтернет-адреси, з якої надіслано форму, — ніколи не саму адресу — щоб запобігати автоматичним надсиланням.",
      ],
      paragraphs: [
        "Ми не запитуємо дані про здоров'я, політичні чи релігійні переконання та інші особливі категорії даних. Якщо в якомусь документі є відомості, не потрібні для розгляду заявки (наприклад, профспілковий внесок у розрахунковому листку), ви можете закрити їх перед надсиланням.",
      ],
    },
    {
      heading: "Для чого ми їх використовуємо",
      items: [
        "Щоб опрацювати вашу заявку, зв'язуватися з вами та розглядати вашу кандидатуру, зокрема з орієнтовною оцінкою платоспроможності, коли це доречно.",
        "Щоб представити вашу кандидатуру власникові об'єкта.",
        "Якщо все складеться, — щоб підготувати договір.",
        "Щоб захищати форму від автоматичних надсилань і зловживань.",
      ],
    },
    {
      heading: "Правова підстава",
      items: [
        "Опрацювання та розгляд заявки і її представлення власникові: дії, що передують можливому договору, про які ви нас просите (ст. 6.1.b GDPR).",
        "Захист форми: наш законний інтерес у безпечній роботі сервісу (ст. 6.1.f).",
        "Зберігання справи, якщо ми укладемо з вами договір: виконання вимог закону (ст. 6.1.c).",
      ],
    },
    {
      heading: "Чи зобов'язані ви надавати дані",
      paragraphs: [
        "Поля, позначені у формі як обов'язкові, потрібні для розгляду заявки: без них ми не зможемо її опрацювати. Документи на першому етапі надаються за бажанням; ми можемо запросити їх пізніше, якщо ваша кандидатура пройде далі.",
      ],
    },
    {
      heading: "Автоматизовані рішення",
      paragraphs: [
        "Ми не ухвалюємо щодо вас автоматизованих рішень. Оцінка платоспроможності — допоміжний розрахунок: рішення завжди ухвалює людина.",
      ],
    },
    {
      heading: "Кому ми їх передаємо",
      items: [
        "Власникові об'єкта — щоб він розглянув вашу кандидатуру. Зазвичай ми передаємо йому звіт про ваш профіль без контактних даних і номера документа. Якщо для рішення йому потрібно переглянути конкретний документ, ми покажемо його лише з цією метою.",
        "Постачальникам, які обробляють дані за нашим дорученням: Google (зберігання документів і електронна пошта), Supabase (база даних, розміщена в Ірландії) та Vercel (сервер застосунку, в Ірландії).",
        "Державним органам, якщо цього вимагає закон.",
      ],
      paragraphs: [
        "Ми не продаємо ваші дані й не передаємо їх із комерційною метою.",
      ],
    },
    {
      heading: "Передавання за межі Європейського Союзу",
      paragraphs: [
        "Деякі наші постачальники — компанії з головним офісом у США і можуть отримувати доступ до даних звідти. У таких випадках передавання ґрунтується на Рамковій програмі ЄС–США щодо захисту даних (Data Privacy Framework), визнаній Європейською комісією, або на затверджених нею стандартних договірних положеннях.",
      ],
    },
    {
      heading: "Скільки ми їх зберігаємо",
      items: [
        "Якщо ваша заявка не матиме продовження, ми видалимо її разом з усіма документами через 3 місяці після останньої дії щодо неї. Видалення відбувається автоматично.",
        "Якщо ми укладемо з вами договір, ваші дані увійдуть до справи щодо угоди і зберігатимуться протягом строків, встановлених законом (наприклад, податковим або комерційним).",
      ],
      paragraphs: [
        "Під «останньою дією» ми розуміємо останній раз, коли ви щось нам надіслали або ми працювали з вашою заявкою.",
      ],
    },
    {
      heading: "Ваші права",
      paragraphs: [
        "Ви можете запросити доступ до своїх даних, їх виправлення чи видалення, заперечити проти обробки або обмежити її, а також отримати дані в переносному форматі.",
        "Напишіть на info@artikore.com, зазначивши ваш запит. Якщо за адресою електронної пошти ми не зможемо підтвердити, що це ви, ми попросимо підтвердити особу. Ми відповімо не пізніше ніж за місяць.",
        "Якщо ви вважаєте, що ми неналежним чином розглянули ваш запит, ви можете подати скаргу до Іспанського агентства із захисту даних (www.aepd.es).",
      ],
    },
    {
      heading: "Безпека",
      paragraphs: [
        "З'єднання зашифроване; ваші документи зберігаються в закритих папках, до яких немає доступу стороннім; до панелі керування може входити лише уповноважений персонал Artiko з перевіркою облікового запису; сервер і база даних розташовані в Європейському Союзі.",
      ],
    },
    {
      heading: "Файли cookie",
      paragraphs: [
        "Ця форма не використовує аналітичні та рекламні файли cookie. Вона лише зберігає у вашому власному браузері чернетку того, що ви вводите, щоб вона не загубилася, і видаляє її під час надсилання.",
      ],
    },
    {
      heading: "Зміни",
      paragraphs: [
        "Якщо ми змінимо цю інформацію, ми опублікуємо тут нову версію з датою.",
      ],
    },
  ],
};

/// Decision de Artiko (octubre de 2026): si hay diferencias entre idiomas,
/// prevalece el castellano. Va al final de la informacion completa en cada
/// idioma, en ese mismo idioma, para que quien la lea sepa cual es la
/// version de referencia.
///
/// No sustituye a traducir bien: la informacion tiene que entenderla quien la
/// recibe. Sirve para resolver dudas de interpretacion.
const LANGUAGE_NOTE: Record<Locale, PrivacySection> = {
  es: {
    heading: "Idioma",
    paragraphs: [
      "Esta información está disponible en varios idiomas para facilitar su lectura. Si hubiera alguna diferencia entre versiones, prevalece la versión en español.",
    ],
  },
  en: {
    heading: "Language",
    paragraphs: [
      "This information is available in several languages for your convenience. In the event of any discrepancy between versions, the Spanish version shall prevail.",
    ],
  },
  de: {
    heading: "Sprache",
    paragraphs: [
      "Diese Informationen stehen zur besseren Verständlichkeit in mehreren Sprachen zur Verfügung. Bei Abweichungen zwischen den Fassungen ist die spanische Fassung maßgeblich.",
    ],
  },
  fr: {
    heading: "Langue",
    paragraphs: [
      "Ces informations sont disponibles en plusieurs langues pour en faciliter la lecture. En cas de divergence entre les versions, la version espagnole prévaut.",
    ],
  },
  it: {
    heading: "Lingua",
    paragraphs: [
      "Queste informazioni sono disponibili in più lingue per facilitarne la lettura. In caso di differenze tra le versioni, prevale la versione in spagnolo.",
    ],
  },
  pt: {
    heading: "Idioma",
    paragraphs: [
      "Esta informação está disponível em várias línguas para facilitar a sua leitura. Em caso de divergência entre versões, prevalece a versão em espanhol.",
    ],
  },
  nl: {
    heading: "Taal",
    paragraphs: [
      "Deze informatie is voor uw gemak in meerdere talen beschikbaar. Bij verschillen tussen de versies is de Spaanse versie leidend.",
    ],
  },
  ru: {
    heading: "Язык",
    paragraphs: [
      "Эта информация доступна на нескольких языках для удобства чтения. В случае расхождений между версиями преимущественную силу имеет версия на испанском языке.",
    ],
  },
  uk: {
    heading: "Мова",
    paragraphs: [
      "Ця інформація доступна кількома мовами для зручності читання. У разі розбіжностей між версіями переважну силу має версія іспанською мовою.",
    ],
  },
};

const withLanguageNote = (
  locale: Locale,
  policy: PrivacyPolicy,
): PrivacyPolicy => ({
  ...policy,
  sections: [...policy.sections, LANGUAGE_NOTE[locale]],
});

export const privacyPolicies: Record<Locale, PrivacyPolicy> = {
  es: withLanguageNote("es", es),
  en: withLanguageNote("en", en),
  de: withLanguageNote("de", de),
  fr: withLanguageNote("fr", fr),
  it: withLanguageNote("it", it),
  pt: withLanguageNote("pt", pt),
  nl: withLanguageNote("nl", nl),
  ru: withLanguageNote("ru", ru),
  uk: withLanguageNote("uk", uk),
};
