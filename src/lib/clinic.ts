/**
 * Dados de referência da clínica.
 *
 * Os dados institucionais (endereço, telefone, convênios e especialidades)
 * foram levantados em elosaudeintegrada.com.br. Agenda, valores, salas e
 * registros profissionais são DEMONSTRATIVOS e precisam ser confirmados
 * com a clínica antes de qualquer uso real.
 */

export const CLINIC = {
  name: "ELO Saúde Integrada",
  shortName: "ELO",
  founded: 2016,
  city: "Aracaju · Sergipe",
  address: "R. Dr. Célso Oliva, 471 — 13 de Julho, Aracaju/SE, 49020-090",
  mapsUrl: "https://share.google/HFvqp5QoinngBtuY5",
  phone: "(79) 3085-6878",
  whatsapp: "557930856878",
  whatsappMessage: "Olá! Vim pelo site. Gostaria de agendar uma consulta.",
  instagram: "https://www.instagram.com/elosaudeintegradaaju/",
  facebook: "https://www.facebook.com/elosaudeintegrada/",
  /** Horário ainda não publicado no site — confirmar com a recepção. */
  hours: "Seg a Sex · 07h às 20h",
};

export const waLink = (message: string = CLINIC.whatsappMessage) =>
  `https://api.whatsapp.com/send?phone=${CLINIC.whatsapp}&text=${encodeURIComponent(message)}`;

/**
 * Fotos reais do ambiente da clínica, publicadas no site institucional.
 * Usadas no protótipo para apresentar a estrutura física à família.
 */
export type GalleryImage = {
  slug: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
  wide?: boolean;
};

export const GALLERY: GalleryImage[] = [
  {
    slug: "equipe",
    src: "/media/clinic/equipe.webp",
    alt: "Profissionais da ELO Saúde Integrada na recepção da clínica, em Aracaju",
    title: "Recepção da ELO",
    tag: "Acolhimento",
    wide: true,
  },
  {
    slug: "sensorial",
    src: "/media/clinic/sensorial.webp",
    alt: "Sala de integração sensorial com balanço, bola terapêutica, tatame e prancha de equilíbrio",
    title: "Sala de integração sensorial",
    tag: "Estrutura",
  },
  {
    slug: "ludoteca",
    src: "/media/clinic/ludoteca.webp",
    alt: "Espaço lúdico com prateleiras de brinquedos, tapete e piscina de bolinhas",
    title: "Espaço lúdico",
    tag: "Brincar",
  },
  {
    slug: "infantil",
    src: "/media/clinic/infantil.webp",
    alt: "Sala de atendimento infantil com tapete azul, mesinha e árvore decorativa na parede",
    title: "Sala de atendimento infantil",
    tag: "Atendimento",
  },
  {
    slug: "consultorio",
    src: "/media/clinic/consultorio.webp",
    alt: "Consultório amplo e climatizado, com mesas, armários e tatame colorido",
    title: "Consultório multidisciplinar",
    tag: "Consultórios",
  },
  {
    slug: "recepcao",
    src: "/media/clinic/recepcao.webp",
    alt: "Recepção com poltronas, bebedouro e parede decorada com montanhas verdes",
    title: "Recepção e espera",
    tag: "Acolhimento",
  },
  {
    slug: "corredor",
    src: "/media/clinic/corredor.webp",
    alt: "Corredor da clínica com escada protegida por portão de segurança e ambientação infantil",
    title: "Circulação segura",
    tag: "Estrutura",
  },
];

/** Hours before the appointment after which online cancel is blocked. */
export const CANCEL_MIN_HOURS = 24;
/** Day of month by which health-plan billing must be sent. */
export const BILLING_DEADLINE_DAY = 25;

export function canCancel(appointment: Date, now: Date = new Date()) {
  return appointment.getTime() - now.getTime() >= CANCEL_MIN_HOURS * 3600_000;
}

/** Formata um CPF enquanto o usuário digita, limitando a 11 dígitos. */
export function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** Valida apenas o formato (11 dígitos), não os dígitos verificadores. */
export function isValidCpfShape(value: string) {
  return value.replace(/\D/g, "").length === 11;
}

export function daysUntilBillingDeadline(now: Date = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let deadline = new Date(now.getFullYear(), now.getMonth(), BILLING_DEADLINE_DAY);
  if (today > deadline)
    deadline = new Date(now.getFullYear(), now.getMonth() + 1, BILLING_DEADLINE_DAY);
  return Math.round((deadline.getTime() - today.getTime()) / 86400_000);
}

/** Split shifts like "08:00"-"12:00" into slots of `interval` minutes. */
export function buildSlots(shifts: { start: string; end: string }[], interval: number) {
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const out: string[] = [];
  for (const s of shifts) {
    for (let m = toMin(s.start); m + interval <= toMin(s.end); m += interval) {
      out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    }
  }
  return out;
}

export type Service = {
  id: string;
  name: string;
  short: string;
  desc: string;
  tags: string[];
  icon: string;
  duration: number;
};

/** As 8 especialidades divulgadas pela ELO + avaliação interdisciplinar. */
export const SERVICES: Service[] = [
  {
    id: "to",
    name: "Terapia Ocupacional",
    short: "TO",
    desc: "Autonomia, coordenação motora, regulação sensorial e habilidades do dia a dia — com integração sensorial, seletividade alimentar, desfralde e AVDs.",
    tags: ["Integração sensorial", "Seletividade alimentar", "Desfralde", "AVDs"],
    icon: "Hand",
    duration: 40,
  },
  {
    id: "fono",
    name: "Fonoaudiologia",
    short: "Fono",
    desc: "Avaliação e intervenção em fala, linguagem, comunicação e motricidade orofacial, incluindo Comunicação Alternativa e Aumentativa (CAA).",
    tags: ["Atraso de fala", "CAA", "PROMPT", "DENVER", "Motricidade orofacial"],
    icon: "MessageCircle",
    duration: 40,
  },
  {
    id: "psi",
    name: "Psicologia",
    short: "Psi",
    desc: "Acompanhamento do desenvolvimento emocional e comportamental, com intervenção ABA quando indicada, TCC e suporte à família.",
    tags: ["ABA", "TCC", "Habilidades sociais", "Orientação parental"],
    icon: "HeartHandshake",
    duration: 50,
  },
  {
    id: "psicoped",
    name: "Psicopedagogia",
    short: "Psicoped.",
    desc: "Avaliação e intervenção em dificuldades de aprendizagem, leitura, escrita e matemática, com articulação direta com a escola e a família.",
    tags: ["Dislexia", "Discalculia", "TDAH", "Rotina escolar"],
    icon: "BookOpen",
    duration: 50,
  },
  {
    id: "nutri",
    name: "Nutrição",
    short: "Nutri",
    desc: "Terapia alimentar com abordagem comportamental para seletividade alimentar, saúde intestinal, alergias e sensibilidades.",
    tags: ["Seletividade alimentar", "Saúde intestinal", "Terapia alimentar"],
    icon: "Apple",
    duration: 40,
  },
  {
    id: "fisio",
    name: "Fisioterapia",
    short: "Fisio",
    desc: "Desenvolvimento motor infantil e funcionalidade do idoso, com plano terapêutico individualizado e contexto familiar.",
    tags: ["Pediatria", "Geriatria", "Equilíbrio", "Funcionalidade"],
    icon: "Activity",
    duration: 40,
  },
  {
    id: "music",
    name: "Musicoterapia",
    short: "Musico",
    desc: "Intervenção terapêutica por meio da música, com foco em comunicação, interação social, regulação emocional e cognição.",
    tags: ["Comunicação", "Regulação emocional", "Interação social"],
    icon: "Music",
    duration: 40,
  },
  {
    id: "psicomot",
    name: "Psicomotricidade",
    short: "Psicomot.",
    desc: "Trabalho integrado entre corpo, movimento e cognição, com esquema corporal, coordenação, lateralidade e planejamento motor.",
    tags: ["Coordenação", "Lateralidade", "Planejamento motor"],
    icon: "Move",
    duration: 40,
  },
  {
    id: "aval",
    name: "Avaliação interdisciplinar",
    short: "Avaliação",
    desc: "Olhar conjunto de diferentes especialidades sobre o caso, com devolutiva para a família e plano terapêutico com metas e prazos.",
    tags: ["Avaliação em equipe", "Devolutiva à família", "Plano terapêutico"],
    icon: "ClipboardList",
    duration: 120,
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id)!;

export type Plan = {
  id: string;
  name: string;
  short: string;
  code: string;
  closingDay: number;
  note: string;
};

/** Convênios credenciados divulgados no site da ELO. */
export const PLANS: Plan[] = [
  {
    id: "petrobras",
    name: "Saúde Petrobras",
    short: "Petrobras",
    code: "PETROBRAS",
    closingDay: 25,
    note: "Exige encaminhamento médico e guia quando o procedimento pedir autorização.",
  },
  {
    id: "caixa",
    name: "Saúde Caixa",
    short: "Saúde Caixa",
    code: "CAIXA",
    closingDay: 25,
    note: "Exige encaminhamento médico; cobertura conforme plano do beneficiário.",
  },
  {
    id: "porto",
    name: "Porto Saúde",
    short: "Porto",
    code: "PORTO",
    closingDay: 25,
    note: "Exige encaminhamento médico e autorização prévia em parte das terapias.",
  },
  {
    id: "sulamerica",
    name: "SulAmérica",
    short: "SulAmérica",
    code: "SULAMERICA",
    closingDay: 25,
    note: "Exige encaminhamento médico; guia de autorização por especialidade.",
  },
  {
    id: "geap",
    name: "GEAP Saúde",
    short: "GEAP",
    code: "GEAP",
    closingDay: 25,
    note: "Exige encaminhamento médico; conferir autorização antes do agendamento.",
  },
];

export const PLAN_NAMES = PLANS.map((p) => p.name);
export const planByName = (name: string) => PLANS.find((p) => p.name === name);

export type PricingRule = {
  plan: string;
  serviceId: string;
  amount: number;
  professionalShare: number;
  requiresAuthorization: boolean;
};

/** Tabela demonstrativa usada para pré-calcular cobrança e repasse antes do atendimento. */
export const PRICING_RULES: PricingRule[] = [
  {
    plan: "Particular",
    serviceId: "to",
    amount: 180,
    professionalShare: 70,
    requiresAuthorization: false,
  },
  {
    plan: "Particular",
    serviceId: "fono",
    amount: 180,
    professionalShare: 70,
    requiresAuthorization: false,
  },
  {
    plan: "Particular",
    serviceId: "psi",
    amount: 200,
    professionalShare: 70,
    requiresAuthorization: false,
  },
  {
    plan: "Particular",
    serviceId: "aval",
    amount: 950,
    professionalShare: 60,
    requiresAuthorization: false,
  },
  {
    plan: "Saúde Petrobras",
    serviceId: "to",
    amount: 92,
    professionalShare: 70,
    requiresAuthorization: true,
  },
  {
    plan: "Saúde Petrobras",
    serviceId: "fono",
    amount: 96,
    professionalShare: 70,
    requiresAuthorization: true,
  },
  {
    plan: "SulAmérica",
    serviceId: "fono",
    amount: 88,
    professionalShare: 65,
    requiresAuthorization: true,
  },
  {
    plan: "GEAP Saúde",
    serviceId: "to",
    amount: 84,
    professionalShare: 65,
    requiresAuthorization: true,
  },
  {
    plan: "Saúde Caixa",
    serviceId: "fono",
    amount: 90,
    professionalShare: 65,
    requiresAuthorization: true,
  },
  {
    plan: "Porto Saúde",
    serviceId: "fisio",
    amount: 86,
    professionalShare: 65,
    requiresAuthorization: true,
  },
];

export function pricingRuleFor(plan: string, serviceId: string) {
  return PRICING_RULES.find((rule) => rule.plan === plan && rule.serviceId === serviceId);
}

export function calculateAppointmentFinancials(amount: number, professionalShare: number) {
  const safeAmount = Math.max(0, amount);
  const safeShare = Math.min(100, Math.max(0, professionalShare));
  const professional = Number(((safeAmount * safeShare) / 100).toFixed(2));
  return {
    gross: safeAmount,
    professional,
    clinic: Number((safeAmount - professional).toFixed(2)),
  };
}

/**
 * Regra de negócio confirmada no site: todo atendimento por convênio exige
 * encaminhamento médico. Atendimento particular não exige.
 */
export const REFERRAL_REQUIRED_FOR_PLANS = true;

export type Professional = {
  id: string;
  name: string;
  serviceId: string;
  reg: string;
  initials: string;
  days: number[];
  shifts: { start: string; end: string }[];
  interval: number;
  roomId: string;
  contract: "Locação" | "Porcentagem";
  bio: string;
  /**
   * Foto divulgada no site da clínica. Seis profissionais ainda não têm foto
   * individual publicada — nesses casos o card exibe as iniciais.
   */
  image?: string;
};

/**
 * Corpo clínico divulgado no site (20+ profissionais, 8 especialidades).
 * Registros e escalas são DEMONSTRATIVOS.
 */
export const PROFESSIONALS: Professional[] = [
  {
    id: "p01",
    name: "Rayane Gama",
    serviceId: "to",
    reg: "CREFITO 5/0000",
    initials: "RG",
    days: [1, 3, 5],
    shifts: [
      { start: "08:00", end: "12:00" },
      { start: "14:00", end: "18:00" },
    ],
    interval: 40,
    roomId: "r1",
    contract: "Locação",
    bio: "Terapeuta ocupacional com capacitações em ABA, integração sensorial e seletividade alimentar.",
    image: "/media/team/rayane.webp",
  },
  {
    id: "p02",
    name: "Márcio",
    serviceId: "to",
    reg: "CREFITO 5/0000",
    initials: "M",
    days: [2, 4],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 40,
    roomId: "r1",
    contract: "Locação",
    bio: "Terapeuta ocupacional pós-graduado em neuropsicologia, com atuação em neurodesenvolvimento.",
    image: "/media/team/marcio.webp",
  },
  {
    id: "p03",
    name: "Morgana",
    serviceId: "to",
    reg: "CREFITO 5/0000",
    initials: "M",
    days: [1, 2, 3, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r1",
    contract: "Porcentagem",
    bio: "Terapeuta ocupacional com aperfeiçoamento em desfralde e desenvolvimento infantil.",
  },
  {
    id: "p04",
    name: "Flávia",
    serviceId: "fono",
    reg: "CRFa 5/0000",
    initials: "F",
    days: [1, 3, 5],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r4",
    contract: "Locação",
    bio: "Fonoaudióloga com formação em CAA (core words) e capacitação em ABA.",
    image: "/media/team/flavia.webp",
  },
  {
    id: "p05",
    name: "Keila",
    serviceId: "fono",
    reg: "CRFa 5/0000",
    initials: "K",
    days: [2, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r5",
    contract: "Locação",
    bio: "Fonoaudióloga com formação no método PROMPT, focada em transtornos motores de fala.",
    image: "/media/team/keila.webp",
  },
  {
    id: "p06",
    name: "Thaís Lopes",
    serviceId: "fono",
    reg: "CRFa 5/0000",
    initials: "TL",
    days: [1, 2, 3],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 40,
    roomId: "r4",
    contract: "Porcentagem",
    bio: "Fonoaudióloga com mais de 7 anos de experiência em linguagem infantil.",
  },
  {
    id: "p07",
    name: "Thaynara",
    serviceId: "fono",
    reg: "CRFa 5/0000",
    initials: "T",
    days: [4, 5],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 40,
    roomId: "r5",
    contract: "Porcentagem",
    bio: "Fonoaudióloga com foco em distúrbios de fala e linguagem.",
  },
  {
    id: "p08",
    name: "Glória",
    serviceId: "psi",
    reg: "CRP 19/0000",
    initials: "G",
    days: [1, 2, 4],
    shifts: [{ start: "14:00", end: "19:00" }],
    interval: 50,
    roomId: "r6",
    contract: "Locação",
    bio: "Psicóloga com pós-graduação em intervenção ABA para autismo e deficiência intelectual.",
    image: "/media/team/gloria.webp",
  },
  {
    id: "p09",
    name: "Helen",
    serviceId: "psi",
    reg: "CRP 19/0000",
    initials: "H",
    days: [3, 5],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 50,
    roomId: "r6",
    contract: "Locação",
    bio: "Psicóloga com formação diversificada, incluindo especialização em sexualidade.",
  },
  {
    id: "p10",
    name: "Lilian",
    serviceId: "psi",
    reg: "CRP 19/0000",
    initials: "L",
    days: [2, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 50,
    roomId: "r6",
    contract: "Porcentagem",
    bio: "Psicóloga com formação em ABA e coautora do livro “Além do Diagnóstico”.",
    image: "/media/team/lilian.webp",
  },
  {
    id: "p11",
    name: "Mirian",
    serviceId: "psi",
    reg: "CRP 19/0000",
    initials: "M",
    days: [1, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 50,
    roomId: "r5",
    contract: "Porcentagem",
    bio: "Psicóloga com formação em ABA e coautora do livro “Além do Diagnóstico”.",
    image: "/media/team/mirian.webp",
  },
  {
    id: "p12",
    name: "Andrezza",
    serviceId: "psicoped",
    reg: "ABPp 0000",
    initials: "A",
    days: [1, 3, 5],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 50,
    roomId: "r5",
    contract: "Locação",
    bio: "Psicopedagoga graduada pela Universidade Tiradentes, com experiência clínica e escolar.",
    image: "/media/team/andrezza.webp",
  },
  {
    id: "p13",
    name: "Cláudia",
    serviceId: "psicoped",
    reg: "ABPp 0000",
    initials: "C",
    days: [2, 4],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 50,
    roomId: "r5",
    contract: "Porcentagem",
    bio: "Psicopedagoga com formação em pedagogia e especializações na área educacional.",
    image: "/media/team/claudia.webp",
  },
  {
    id: "p14",
    name: "Carolina",
    serviceId: "nutri",
    reg: "CRN 5/0000",
    initials: "C",
    days: [1, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r4",
    contract: "Locação",
    bio: "Nutricionista voltada às demandas alimentares do público neurodivergente.",
  },
  {
    id: "p15",
    name: "Iasmin",
    serviceId: "nutri",
    reg: "CRN 5/0000",
    initials: "I",
    days: [2, 5],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 40,
    roomId: "r3",
    contract: "Porcentagem",
    bio: "Nutricionista com formação em terapia alimentar com abordagem ABA.",
    image: "/media/team/iasmin.webp",
  },
  {
    id: "p16",
    name: "Thawanny",
    serviceId: "nutri",
    reg: "CRN 5/0000",
    initials: "T",
    days: [3],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r4",
    contract: "Porcentagem",
    bio: "Nutricionista com pós-graduação em nutrição materno-infantil e aplicada ao TEA.",
    image: "/media/team/thawanny.webp",
  },
  {
    id: "p17",
    name: "Yasmin",
    serviceId: "fisio",
    reg: "CREFITO 5/0000",
    initials: "Y",
    days: [1, 2, 3, 4, 5],
    shifts: [{ start: "14:00", end: "18:00" }],
    interval: 40,
    roomId: "r2",
    contract: "Locação",
    bio: "Fisioterapeuta com pós-graduação em psicomotricidade e capacitação em ABA.",
  },
  {
    id: "p18",
    name: "Carlos",
    serviceId: "music",
    reg: "AMT 0000",
    initials: "C",
    days: [2, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r3",
    contract: "Porcentagem",
    bio: "Musicoterapeuta formado em educação musical pela UFS, com pós em neuropsicopedagogia.",
    image: "/media/team/carlos.webp",
  },
  {
    id: "p19",
    name: "Cristiane",
    serviceId: "psicomot",
    reg: "ABP 0000",
    initials: "C",
    days: [1, 3, 5],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 40,
    roomId: "r2",
    contract: "Locação",
    bio: "Psicomotricista com formação em pedagogia e pós em ABA naturalista e neurociência.",
    image: "/media/team/cristiane.webp",
  },
  {
    id: "p20",
    name: "Equipe interdisciplinar",
    serviceId: "aval",
    reg: "—",
    initials: "EQ",
    days: [2, 4],
    shifts: [{ start: "08:00", end: "12:00" }],
    interval: 120,
    roomId: "r7",
    contract: "Porcentagem",
    bio: "Avaliação conjunta de diferentes especialidades, com devolutiva e plano terapêutico.",
  },
];

export const professionalById = (id: string) => PROFESSIONALS.find((p) => p.id === id)!;
export const professionalsByService = (serviceId: string) =>
  PROFESSIONALS.filter((p) => p.serviceId === serviceId);

export type RoomStatus = "Livre" | "Ocupada" | "Manutenção" | "Inativa";
export type Room = {
  id: string;
  name: string;
  type: string;
  equipment: string;
  status: RoomStatus;
  who: string;
  /** Motivo registrado pela recepção ao desativar a sala. */
  deactivationReason?: string;
};

export const ROOMS: Room[] = [
  {
    id: "r1",
    name: "Sala 01 · Integração Sensorial",
    type: "Sala terapêutica",
    equipment: "Plataforma, balanço, tatame, materiais sensoriais",
    status: "Ocupada",
    who: "Rayane Gama",
  },
  {
    id: "r2",
    name: "Sala 02 · Psicomotricidade",
    type: "Sala terapêutica",
    equipment: "Colchonetes, circuito motor, espelho, bolas",
    status: "Ocupada",
    who: "Cristiane",
  },
  {
    id: "r3",
    name: "Sala 03 · Musicoterapia",
    type: "Sala terapêutica",
    equipment: "Instrumentos musicais, caixa de som, tatame",
    status: "Manutenção",
    who: "—",
  },
  {
    id: "r4",
    name: "Consultório 04",
    type: "Consultório",
    equipment: "Mesa, cadeiras, maca, climatização",
    status: "Ocupada",
    who: "Flávia",
  },
  {
    id: "r5",
    name: "Consultório 05",
    type: "Consultório",
    equipment: "Mesa, cadeiras, materiais pedagógicos",
    status: "Livre",
    who: "—",
  },
  {
    id: "r6",
    name: "Consultório 06",
    type: "Consultório",
    equipment: "Mesa, cadeiras, sofá, climatização",
    status: "Ocupada",
    who: "Glória",
  },
  {
    id: "r7",
    name: "Sala de Avaliação",
    type: "Sala multiuso",
    equipment: "Mesa grande, testes, projetor",
    status: "Ocupada",
    who: "Equipe interdisciplinar",
  },
];

export const roomById = (id: string) => ROOMS.find((r) => r.id === id)!;

export type Status = "pending" | "confirmed" | "waiting" | "done" | "canceled";
export const STATUS_LABEL: Record<Status, string> = {
  pending: "Aguardando confirmação",
  confirmed: "Confirmado",
  waiting: "Na sala de espera",
  done: "Finalizado",
  canceled: "Cancelado/Faltou",
};

export type Appointment = {
  id: string;
  time: string;
  patient: string;
  professionalId: string;
  roomId: string;
  serviceId: string;
  plan: string;
  status: Status;
  price: number;
  recurring?: boolean;
  card?: string;
  authorization?: string;
};

/** Agenda demonstrativa de um dia típico (terapias semanais + avaliação). */
export const TODAY: Appointment[] = [
  {
    id: "a1",
    time: "08:00",
    patient: "Bernardo Costa (5a)",
    professionalId: "p01",
    roomId: "r1",
    serviceId: "to",
    plan: "Saúde Petrobras",
    status: "done",
    price: 0,
    recurring: true,
    card: "0000 0000 0000",
  },
  {
    id: "a2",
    time: "08:00",
    patient: "Miguel Andrade (7a)",
    professionalId: "p19",
    roomId: "r2",
    serviceId: "psicomot",
    plan: "Particular",
    status: "waiting",
    price: 180,
    recurring: true,
  },
  {
    id: "a3",
    time: "08:30",
    patient: "Helena Duarte (4a)",
    professionalId: "p04",
    roomId: "r4",
    serviceId: "fono",
    plan: "SulAmérica",
    status: "confirmed",
    price: 0,
    recurring: true,
  },
  {
    id: "a4",
    time: "09:00",
    patient: "Theo Nascimento (6a)",
    professionalId: "p03",
    roomId: "r1",
    serviceId: "to",
    plan: "GEAP Saúde",
    status: "confirmed",
    price: 0,
    recurring: true,
  },
  {
    id: "a5",
    time: "09:00",
    patient: "Lara Menezes (9a)",
    professionalId: "p10",
    roomId: "r6",
    serviceId: "psi",
    plan: "Particular",
    status: "pending",
    price: 200,
    recurring: true,
  },
  {
    id: "a6",
    time: "09:30",
    patient: "Davi Rocha (3a)",
    professionalId: "p05",
    roomId: "r5",
    serviceId: "fono",
    plan: "Saúde Caixa",
    status: "confirmed",
    price: 0,
    card: "0000 0000 0000",
  },
  {
    id: "a7",
    time: "14:00",
    patient: "Sofia Barreto (11a)",
    professionalId: "p17",
    roomId: "r2",
    serviceId: "fisio",
    plan: "Porto Saúde",
    status: "pending",
    price: 0,
    recurring: true,
  },
  {
    id: "a8",
    time: "10:00",
    patient: "Enzo Carvalho (5a)",
    professionalId: "p18",
    roomId: "r3",
    serviceId: "music",
    plan: "Particular",
    status: "canceled",
    price: 180,
    recurring: true,
  },
  {
    id: "a9",
    time: "10:30",
    patient: "Alice Fontes (8a)",
    professionalId: "p11",
    roomId: "r5",
    serviceId: "psi",
    plan: "Saúde Petrobras",
    status: "waiting",
    price: 0,
    recurring: true,
  },
  {
    id: "a10",
    time: "11:00",
    patient: "Ravi Souza",
    professionalId: "p14",
    roomId: "r4",
    serviceId: "nutri",
    plan: "Particular",
    status: "confirmed",
    price: 220,
  },
  {
    id: "a11",
    time: "11:20",
    patient: "Maria Helena (68a)",
    professionalId: "p01",
    roomId: "r1",
    serviceId: "to",
    plan: "GEAP Saúde",
    status: "done",
    price: 0,
  },
  {
    id: "a12",
    time: "14:00",
    patient: "Gabriel Lima (10a)",
    professionalId: "p08",
    roomId: "r6",
    serviceId: "psi",
    plan: "SulAmérica",
    status: "confirmed",
    price: 0,
    recurring: true,
  },
  {
    id: "a13",
    time: "10:00",
    patient: "Família Nogueira",
    professionalId: "p20",
    roomId: "r7",
    serviceId: "aval",
    plan: "Particular",
    status: "pending",
    price: 950,
  },
  {
    id: "a14",
    time: "15:20",
    patient: "Beatriz Alves (4a)",
    professionalId: "p17",
    roomId: "r2",
    serviceId: "fisio",
    plan: "Porto Saúde",
    status: "confirmed",
    price: 0,
    recurring: true,
  },
];

export type Rent = {
  id: string;
  professional: string;
  serviceId: string;
  roomId: string;
  mode: "Fixa" | "Avulsa";
  value: number;
  due: string;
  paid: boolean;
};

export const RENTS: Rent[] = [
  {
    id: "r1",
    professional: "Rayane Gama",
    serviceId: "to",
    roomId: "r1",
    mode: "Fixa",
    value: 1800,
    due: "05/11",
    paid: true,
  },
  {
    id: "r2",
    professional: "Flávia",
    serviceId: "fono",
    roomId: "r4",
    mode: "Fixa",
    value: 1600,
    due: "05/11",
    paid: false,
  },
  {
    id: "r3",
    professional: "Glória",
    serviceId: "psi",
    roomId: "r6",
    mode: "Fixa",
    value: 2100,
    due: "10/11",
    paid: false,
  },
  {
    id: "r4",
    professional: "Yasmin",
    serviceId: "fisio",
    roomId: "r2",
    mode: "Avulsa",
    value: 160,
    due: "10/11",
    paid: true,
  },
  {
    id: "r5",
    professional: "Andrezza",
    serviceId: "psicoped",
    roomId: "r5",
    mode: "Fixa",
    value: 1400,
    due: "05/11",
    paid: false,
  },
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
