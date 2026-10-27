import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import {
  AutismTeaser,
  BlogSection,
  ClinicGallery,
  CtaBand,
  Faq,
  HomeHero,
  HowItWorks,
  PlansStrip,
  ServicesSection,
  SiteFooter,
  TeamSection,
} from "@/components/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ELO Saúde Integrada — Clínica multiprofissional em Aracaju/SE" },
      {
        name: "description",
        content:
          "Clínica especializada em autismo (TEA) e neurodesenvolvimento em Aracaju: 8 especialidades, 20+ profissionais, convênios e atendimento particular. Agende online.",
      },
      { property: "og:title", content: "ELO Saúde Integrada — Cuidado integrado em Aracaju" },
      {
        property: "og:description",
        content:
          "Terapia ocupacional, fonoaudiologia, psicologia, nutrição e mais, com equipe integrada e acolhimento à família.",
      },
    ],
  }),
  component: Index,
});

const FAQ = [
  {
    question: "Preciso de diagnóstico fechado para começar?",
    answer:
      "Não. O primeiro passo é o acolhimento com a equipe. A avaliação pode ser individual ou interdisciplinar, e o plano terapêutico é definido a partir do que a família relata e do que a avaliação identifica.",
  },
  {
    question: "Quais convênios a ELO aceita?",
    answer:
      "Saúde Petrobras, Saúde Caixa, Porto Saúde, SulAmérica e GEAP Saúde, além de atendimento particular. Para convênio é obrigatório encaminhamento médico da especialidade desejada.",
  },
  {
    question: "A ELO atende adultos e idosos?",
    answer:
      "Sim. Além de crianças e adolescentes, a clínica atende adultos e idosos com foco em estimulação cognitiva, funcionalidade, memória, equilíbrio e independência.",
  },
  {
    question: "Como funciona o agendamento?",
    answer:
      "Pelo site você escolhe serviço, profissional, forma de atendimento e horário. Também é possível falar com a recepção pelo WhatsApp (79) 3085-6878, especialmente se ainda não souber qual especialidade procurar.",
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <HomeHero />
      <PlansStrip />
      <ServicesSection />
      <HowItWorks />
      <AutismTeaser />
      <ClinicGallery preview />
      <TeamSection grouped={false} />
      <BlogSection />
      <Faq items={FAQ} />
      <CtaBand />
      <SiteFooter />
    </div>
  );
}
