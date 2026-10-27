export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  excerpt: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

/**
 * Pautas publicadas no blog da ELO (títulos reais).
 * O corpo dos artigos aqui é DEMONSTRATIVO: o conteúdo atual continua no
 * WordPress e precisa ser migrado ou integrado antes de ir ao ar.
 */
export const POSTS: Post[] = [
  {
    slug: "melhores-clinicas-de-autismo-em-aracaju-como-escolher",
    title: "Melhores clínicas de autismo em Aracaju: como escolher a certa",
    category: "Autismo",
    date: "13 abr 2026",
    readingTime: "8 min",
    excerpt:
      "Critérios para avaliar equipe, abordagem, estrutura e comunicação com a família antes de escolher a clínica que vai acompanhar seu filho.",
    sections: [
      {
        heading: "O que observar além da estrutura",
        paragraphs: [
          "Sala bonita não é indicativo de plano terapêutico. Pergunte como a equipe define metas, com que frequência reavalia o caso e de que forma a família recebe devolutivas.",
          "Uma clínica multiprofissional precisa mostrar como os profissionais conversam entre si. Se cada especialidade trabalha isolada, o acompanhamento perde continuidade.",
        ],
      },
      {
        heading: "Perguntas que valem a visita",
        paragraphs: [
          "Quem são os profissionais que vão atender? Todos têm formação em ABA e experiência em TEA? Como funciona a troca entre terapeutas? O que acontece se meu filho não se adaptar?",
          "Também vale confirmar cobertura do convênio, exigência de encaminhamento e política de faltas antes de iniciar.",
        ],
      },
    ],
  },
  {
    slug: "terapeuta-ocupacional-infantil-em-aracaju-guia-completo-para-pais",
    title: "Terapeuta ocupacional infantil em Aracaju: guia completo para pais",
    category: "Terapia Ocupacional",
    date: "13 abr 2026",
    readingTime: "7 min",
    excerpt:
      "O que faz o terapeuta ocupacional, quando procurar e como funciona a integração sensorial, o desfralde e o treino de AVDs na prática.",
    sections: [
      {
        heading: "Quando procurar a Terapia Ocupacional",
        paragraphs: [
          "Dificuldade com texturas e sons, seletividade alimentar, atraso no desfralde, pouca autonomia para vestir e comer são sinais frequentes de demanda sensorial e ocupacional.",
          "A avaliação identifica o que está por trás do comportamento e define metas funcionais para casa e escola.",
        ],
      },
      {
        heading: "Como é a sessão",
        paragraphs: [
          "O brincar é a linguagem da infância. A sessão usa circuitos, materiais sensoriais e rotinas do dia a dia para treinar habilidades com significado para a família.",
          "A orientação aos cuidadores é parte do tratamento: o que é trabalhado na sala precisa continuar em casa.",
        ],
      },
    ],
  },
  {
    slug: "fonoaudiologo-infantil-em-aracaju-quando-levar-meu-filho",
    title: "Fonoaudiólogo infantil em Aracaju: quando levar meu filho?",
    category: "Fonoaudiologia",
    date: "13 abr 2026",
    readingTime: "6 min",
    excerpt:
      "Sinais por idade, atraso de fala, métodos como PROMPT e SENA System e a relação entre linguagem e autismo.",
    sections: [
      {
        heading: "Sinais que merecem avaliação",
        paragraphs: [
          "Ausência de balbucio até 12 meses, poucas palavras até 16 meses e nenhuma frase de duas palavras até 24 meses são marcos que pedem avaliação fonoaudiológica.",
          "Perda de habilidades já adquiridas exige investigação imediata, independentemente da idade.",
        ],
      },
      {
        heading: "Avaliação e plano terapêutico",
        paragraphs: [
          "A avaliação observa compreensão, expressão, motricidade orofacial e intenção comunicativa. A partir disso, o plano define frequência, método e metas.",
          "Quando a fala ainda não é funcional, a Comunicação Alternativa e Aumentativa (CAA) pode ser indicada para reduzir frustração e ampliar comunicação.",
        ],
      },
    ],
  },
  {
    slug: "como-usar-o-saude-petrobras-para-terapias-em-aracaju",
    title: "Como usar o Saúde Petrobras para terapias em Aracaju",
    category: "Convênios",
    date: "13 abr 2026",
    readingTime: "5 min",
    excerpt:
      "Passo a passo para usar o convênio: encaminhamento médico, autorização, documentação e agendamento na ELO.",
    sections: [
      {
        heading: "Antes de agendar",
        paragraphs: [
          "O atendimento por convênio exige encaminhamento médico para a especialidade desejada. Alguns procedimentos também pedem autorização prévia ou guia.",
          "Confirme com a operadora a cobertura e a documentação necessária para evitar remarcações.",
        ],
      },
      {
        heading: "Na clínica",
        paragraphs: [
          "Com o encaminhamento em mãos, a recepção confere carteirinha, validade e guia, registra o atendimento e orienta sobre a continuidade do plano terapêutico.",
          "Cada sessão realizada entra no fechamento mensal enviado à operadora até o dia 25.",
        ],
      },
    ],
  },
  {
    slug: "seletividade-alimentar-no-autismo-como-a-nutricao-pode-ajudar",
    title: "Seletividade alimentar no autismo: como a nutrição pode ajudar",
    category: "Nutrição",
    date: "13 abr 2026",
    readingTime: "6 min",
    excerpt:
      "Por que a seletividade acontece, como identificar e como a terapia alimentar com abordagem ABA amplia o repertório alimentar.",
    sections: [
      {
        heading: "Não é só “frescura”",
        paragraphs: [
          "A recusa alimentar pode envolver sensibilidade a texturas, cheiros, cores e temperaturas, além de rigidez de rotina. Forçar a criança tende a aumentar a resistência.",
          "A avaliação nutricional olha crescimento, exames, saúde intestinal e o contexto das refeições.",
        ],
      },
      {
        heading: "Como funciona a terapia alimentar",
        paragraphs: [
          "O trabalho é gradual: aproximação, exploração sensorial e exposição repetida sem pressão, sempre em parceria com a família.",
          "A abordagem ABA ajuda a estruturar metas e reforços, respeitando o tempo da criança.",
        ],
      },
    ],
  },
  {
    slug: "o-que-e-aba-e-como-funciona-para-criancas-com-tea",
    title: "O que é ABA e como funciona para crianças com TEA",
    category: "Autismo",
    date: "13 abr 2026",
    readingTime: "9 min",
    excerpt:
      "O que é Análise do Comportamento Aplicada, como ela é usada no acompanhamento do autismo e quais mitos precisam ser esclarecidos.",
    sections: [
      {
        heading: "ABA não é um método único",
        paragraphs: [
          "A Análise do Comportamento Aplicada reúne princípios e procedimentos para ensinar habilidades e reduzir comportamentos que prejudicam a qualidade de vida.",
          "O plano é individualizado: parte da avaliação de repertório, define metas observáveis e revisa dados com frequência.",
        ],
      },
      {
        heading: "O papel da família",
        paragraphs: [
          "Generalizar habilidades exige consistência entre clínica, casa e escola. Por isso a orientação familiar é parte do processo, não um extra.",
          "A ELO não promete cura. Trabalha com evidência, metas claras e comunicação transparente.",
        ],
      },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
