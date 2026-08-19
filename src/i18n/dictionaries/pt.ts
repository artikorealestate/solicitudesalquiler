import type { Dictionary } from "./es";

export const pt: Dictionary = {
  meta: { languageName: "Português" },

  chooser: {
    eyebrow: "Formulário de contacto",
    title: "Em que idioma prefere continuar?",
    subtitle:
      "Escolha o seu idioma para preencher o formulário. Poderá alterá-lo a qualquer momento.",
    continueIn: "Continuar em português",
  },

  common: {
    next: "Continuar",
    back: "Voltar",
    submit: "Enviar pedido",
    sending: "A enviar…",
    optional: "opcional",
    required: "obrigatório",
    yes: "Sim",
    no: "Não",
    stepOf: "Passo {current} de {total}",
    changeLanguage: "Mudar de idioma",
    selectPlaceholder: "Selecione uma opção",
  },

  steps: {
    operation: "Pedido",
    property: "Imóvel",
    personal: "Os seus dados",
    questions: "A sua situação",
    documents: "Documentos",
    consent: "Proteção de dados",
    review: "Resumo",
  },

  operation: {
    title: "O que procura?",
    subtitle: "As perguntas adaptam-se à sua escolha.",
    rent: {
      label: "Arrendar uma casa",
      description: "Pretendo arrendar um dos imóveis disponíveis",
    },
    sale: {
      label: "Comprar uma casa",
      description: "Pretendo comprar um dos imóveis à venda",
    },
  },

  property: {
    title: "Que imóvel lhe interessa?",
    subtitle: "Estes são os imóveis disponíveis neste momento.",
    empty:
      "De momento não há imóveis disponíveis para este tipo de pedido. Tente novamente dentro de alguns dias.",
    perMonth: "/mês",
    viewOnIdealista: "Ver o anúncio completo",
    selected: "Selecionado",
  },

  personal: {
    title: "Os seus contactos",
    subtitle: "Precisamos deles para lhe podermos responder.",
    firstName: "Nome",
    lastName: "Apelidos",
    email: "Endereço de email",
    phone: "Telemóvel",
    nationality: "Nacionalidade",
    idDocument: "Cartão de cidadão, NIE ou passaporte",
    idDocumentHint: "Ajuda-nos a preparar a documentação do contrato.",
  },

  rentQuestions: {
    title: "Fale-nos da sua situação",
    subtitle:
      "Estas informações permitem-nos avaliar se o imóvel se adequa a si.",

    householdSize: "Quantas pessoas viveriam no imóvel?",
    relationship: "Que relação existe entre vocês?",
    relationshipOptions: {
      couple: "Casal",
      family: "Família",
      flatmates: "Colegas de casa",
      alone: "Viveria sozinho ou sozinha",
      other: "Outra",
    },

    moveInDate: "A partir de que data precisariam de entrar?",
    occupation: "Qual é a sua atividade profissional?",

    employmentType: "Que tipo de contrato ou situação laboral têm?",
    employmentOptions: {
      permanent: "Contrato sem termo",
      temporary: "Contrato a termo",
      selfEmployed: "Trabalhador independente",
      civilServant: "Funcionário público",
      retired: "Reformado ou pensionista",
      student: "Estudante",
      unemployed: "Atualmente sem emprego",
      other: "Outra situação",
    },

    provableIncome:
      "Os rendimentos podem ser comprovados com recibos de vencimento ou documentos equivalentes?",
    monthlyIncome: "Qual é o rendimento líquido mensal do agregado? (€)",

    solvencyHelp:
      "O critério habitual é que a renda não ultrapasse cerca de 30% dos rendimentos líquidos comprováveis do agregado.",
    solvencyForProperty:
      "Para este imóvel, de {rent} € por mês, isso corresponderia a cerca de {recommended} € líquidos mensais no total.",
    solvencyMet: "Com o que indicou, cumprem o critério habitual.",
    solvencyNotMet:
      "Fica abaixo do critério habitual. Pode continuar na mesma: iremos avaliá-lo em conjunto com a restante informação.",

    pets: "Têm animais de estimação?",
    petsDetail: "Quais?",
    searchDuration: "Há quanto tempo procuram casa para arrendar?",
    searchDurationOptions: {
      justStarted: "Começámos agora",
      lessThanMonth: "Menos de um mês",
      oneToThree: "Entre um e três meses",
      moreThanThree: "Mais de três meses",
    },

    visitedOthers: "Já visitaram outras casas?",
    documentsReady: "Têm a documentação preparada?",
    documentsReadyOptions: {
      yes: "Sim, está tudo pronto",
      partly: "Em parte",
      no: "Ainda não",
    },
  },

  saleQuestions: {
    title: "Fale-nos da sua situação",
    subtitle:
      "Estas informações ajudam-nos a acompanhá-lo melhor durante a compra.",

    buyerProfile: "Quem faria a compra e qual é o vosso perfil?",
    buyerProfileHint:
      "Por exemplo: casal jovem, família com filhos, investidor, segunda habitação…",

    searchDuration: "Há quanto tempo procuram casa?",
    searchDurationOptions: {
      justStarted: "Começámos agora",
      lessThanThree: "Menos de três meses",
      threeToTwelve: "Entre três meses e um ano",
      moreThanYear: "Mais de um ano",
    },

    propertiesVisited: "Aproximadamente quantas casas já visitaram?",
    madeOffer: "Já fizeram alguma proposta?",
    needToSell: "Precisam de vender outro imóvel para poderem comprar?",
    needsFinancing: "Precisam de financiamento?",
    financingApproved: "Já está pré-aprovado?",
    financingApprovedHint:
      "Ter o financiamento pré-aprovado acelera bastante o processo.",

    firstPurchase: "É a vossa primeira compra?",
    firstPurchaseOptions: {
      first: "Sim, é a nossa primeira compra",
      experienced: "Não, já conhecemos o processo de compra e venda",
    },

    occupation: "Qual é a sua atividade profissional?",
  },

  documents: {
    title: "Documentos",
    subtitleRent:
      "Anexar a documentação acelera bastante a resposta. Pode enviá-la agora ou mais tarde.",
    subtitleSale:
      "Se tiver documentação relevante pode anexá-la. Não é obrigatório.",
    addFiles: "Adicionar ficheiros",
    dropHint: "Arraste os ficheiros para aqui, ou clique para os selecionar",
    accepted: "Aceitam-se PDF e imagens, até 10 MB por ficheiro.",
    remove: "Remover",
    suggestionsRent: "Documentação habitual para arrendamento:",
    suggestionsRentList: [
      "Últimos recibos de vencimento ou comprovativos de rendimento",
      "Contrato de trabalho",
      "Cartão de cidadão, NIE ou passaporte",
      "Última declaração de IRS (se trabalhador independente)",
    ],
    skip: "Continuar sem anexar nada",
    tooLarge: "«{name}» ultrapassa os 10 MB e não pode ser anexado.",
    wrongType: "«{name}» não é um tipo de ficheiro aceite.",
    uploading: "A carregar o documento {current} de {total}…",
    uploadWait:
      "Não feche esta página enquanto os ficheiros estão a ser carregados. Avisamos assim que o pedido estiver enviado.",
    uploadPartial:
      "O seu pedido foi enviado com sucesso, mas {count} documento(s) não foi possível carregar. Entraremos em contacto para os pedir.",
    uploadUnavailable:
      "O seu pedido foi enviado com sucesso. Pediremos a documentação por email.",
  },

  comment: {
    label: "Quer acrescentar mais alguma coisa?",
    placeholder: "Tudo o que considere que devemos saber…",
  },

  consent: {
    title: "Proteção de dados",
    subtitle: "Antes de enviar, precisamos da sua confirmação.",

    gdprVersion: "2026-08-rgpd-pt-v3",
    gdprText:
      "Aceito que a INMOARTIKO SL (NIF B56527930), com sede em Sagunto (Valência, Espanha), trate os meus dados pessoais e a documentação fornecida com a finalidade de gerir o meu pedido de informação sobre o imóvel selecionado. Poderei exercer os meus direitos de acesso, retificação, apagamento, oposição, limitação e portabilidade escrevendo para info@artikore.com.",

    ownerVersion: "2026-08-proprietario-pt-v2",
    ownerText:
      "Autorizo a INMOARTIKO SL a partilhar os meus dados e a documentação fornecida com o proprietário do imóvel, com o único fim de avaliar a minha candidatura.",

    requiredError:
      "Precisamos do seu consentimento para podermos tratar o pedido.",
  },

  review: {
    title: "Reveja o seu pedido",
    subtitle: "Confirme que está tudo correto antes de enviar.",
    edit: "Alterar",
    sectionOperation: "Pedido",
    sectionProperty: "Imóvel",
    sectionPersonal: "Os seus dados",
    sectionQuestions: "A sua situação",
    sectionDocuments: "Documentos",
    noDocuments: "Sem documentos anexados",
    documentCount: "{count} ficheiro(s) anexado(s)",
  },

  success: {
    title: "Recebemos o seu pedido",
    body: "Obrigado pelo seu interesse em {property}. Vamos rever a informação e entraremos em contacto consigo nos próximos dias.",
    emailSent: "Enviámos uma confirmação para {email}.",
    signature: "Artiko Real Estate",
  },

  email: {
    subject: "Recebemos o seu pedido · Artiko Real Estate",
    greeting: "Olá {name},",
    received:
      "obrigado pelo seu interesse. Recebemos corretamente o seu pedido de {operation} para o seguinte imóvel:",
    operationRent: "arrendamento",
    operationSale: "compra",
    nextSteps:
      "Vamos rever a informação enviada e entraremos em contacto nos próximos dias se o seu perfil corresponder ao que a propriedade procura.",
    documentsPending:
      "Se não conseguiu anexar toda a documentação, não se preocupe: pedimos-lha se for necessário.",
    noReply:
      "Esta mensagem foi gerada automaticamente. Pode responder a este email se quiser dizer-nos algo mais.",
    signature: "Artiko Real Estate",
    signatureTagline: "Valencia · artikore.com",
    personalTouch: "Prefere falar com uma pessoa?",
    whatsappCta: "Fale connosco por WhatsApp",
    /// Enlace personal para volver a la propia solicitud y anadir lo que falte.
    selfServiceIntro:
      "Falta-lhe enviar algum documento? Pode adicioná-lo quando quiser a partir desta ligação, sem voltar a preencher o formulário.",
    selfServiceCta: "Adicionar documentos",
    visitWebsite: "Ver os nossos imóveis",
  },

  docs: {
    eyebrow: "Documentos",
    greeting: "Olá, {name}",
    intro:
      "O seu pedido para {property} está a avançar. Só nos falta rever alguns documentos.",
    weNeed: "O que precisamos",
    abroadNote:
      "Se trabalha ou já viveu fora de Espanha, envie-nos o documento equivalente do seu país. Não faz mal que esteja noutro idioma: se precisarmos de tradução, pedimos-lha.",
    spanishNameLabel: "em Espanha:",
    selfServiceHere:
      "Esta é a sua candidatura para {property}, enviada a {date}. Pode acrescentar aqui os documentos em falta: não precisa de preencher o formulário outra vez.",
    alreadySent: "Já nos enviou",
    addFiles: "Adicionar ficheiros",
    dropHint:
      "Arraste os seus documentos para aqui, ou clique para os selecionar",
    accepted:
      "PDF e imagens, até 10 MB por ficheiro. Uma fotografia nítida do documento serve.",
    remove: "Remover",
    send: "Enviar documentos",
    sending: "A carregar…",
    successTitle: "Documentos recebidos",
    successBody:
      "Obrigado. Estamos a revê-los e daremos notícias nos próximos dias.",
    successPartial:
      "{count} ficheiro(s) não foi possível carregar. Volte a abrir a ligação do email e tente novamente.",
    uploadMore: "Enviar mais",
    sessionExpired:
      "A sessão expirou por segurança. Recarregue esta página e tente de novo: não se perdeu nada.",
    unavailableTitle: "Esta ligação já não está disponível",
    unavailableBody:
      "Podemos ter enviado uma mais recente. Verifique o seu email, ou escreva-nos e reenviamos.",
    expiredTitle: "A ligação expirou",
    expiredBody:
      "Por segurança estas ligações duram um tempo limitado. Escreva-nos e enviamos uma nova de imediato.",
    completedTitle: "Já recebemos os seus documentos",
    completedBody:
      "Obrigado. Estamos a revê-los e daremos notícias nos próximos dias.",
    emailSubject: "Documentos para {property} · Artiko Real Estate",
    emailIntro:
      "obrigado pelo seu interesse. O seu pedido corresponde ao que procuramos, por isso o passo seguinte é rever a documentação.",
    emailCta: "Carregar os meus documentos",
    emailExpiry:
      "A ligação é pessoal e expira a {date}. Não precisa de enviar tudo de uma vez: pode voltar a entrar.",
    items: {
      id: "Documento de identidade (cartão de cidadão, passaporte ou equivalente)",
      nie: "Número de identidade de estrangeiro em Espanha (NIE)",
      residencePermit: "Autorização de residência ou de trabalho",
      incomeProof: "Comprovativos dos seus rendimentos dos últimos três meses",
      employmentContract:
        "Contrato de trabalho ou declaração da entidade patronal",
      workHistory: "Histórico profissional ou certificado de antiguidade",
      taxReturn: "Última declaração de impostos",
      selfEmployedProof: "Comprovativo da sua atividade por conta própria",
      quarterlyTax: "Últimas declarações fiscais trimestrais",
      pensionProof: "Certificado ou comprovativo de pensão",
      companyDocs: "Escritura de constituição e poderes de representação",
      representativeId: "Documento de identidade de quem irá assinar",
      companyAccounts: "Últimas contas anuais ou imposto sobre sociedades",
      guarantorDocuments: "Documentação do fiador",
      other: "Outra documentação",
    },
  },

  footer: {
    agency: "Agência imobiliária em Valência, Espanha",
    website: "Conheça-nos em artikore.com",
    questionsLabel: "Tem dúvidas antes de enviar?",
    contact: "Escreva-nos para",
    whatsapp: "Fale connosco por WhatsApp",
  },

  errors: {
    required: "Este campo é obrigatório",
    invalidEmail: "Introduza um endereço de email válido",
    invalidPhone: "Introduza um número de telefone válido",
    invalidNumber: "Introduza apenas números",
    selectProperty: "Escolha um imóvel para continuar",
    selectOperation: "Escolha arrendamento ou compra para continuar",
    submitFailed:
      "Não conseguimos enviar o seu pedido. Verifique a ligação e tente novamente.",
    fixFields: "Reveja os campos assinalados antes de continuar.",
    tooManySubmissions:
      "Enviou vários pedidos em pouco tempo. Aguarde um momento e tente novamente, ou fale connosco por WhatsApp.",
  },
};
