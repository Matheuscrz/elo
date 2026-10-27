import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CtaBand, Faq, HowItWorks, PageHero, PlansStrip, SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { SERVICES, waLink } from "@/lib/clinic";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/autismo")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Autismo (TEA) em Aracaju — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Avaliação e acompanhamento multiprofissional de autismo (TEA) em Aracaju: sinais por idade, avaliação interdisciplinar, ABA e orientação familiar.",
      },
      { property: "og:title", content: "Autismo (TEA) em Aracaju — ELO Saúde Integrada" },
      {
        property: "og:description",
        content:
          "Acolhimento, avaliação e plano terapêutico individualizado para famílias atípicas.",
      },
    ],
  }),
  component: Autism,
});

const SIGNS = [
  {
    age: "Até 12 meses",
    items: [
      "Pouco ou nenhum contato visual",
      "Não responde ao nome quando chamado",
      "Não aponta, não acena e não imita gestos simples",
      "Ausência de balbucio",
    ],
  },
  {
    age: "De 1 a 2 anos",
    items: [
      "Não fala palavras isoladas até 16 meses",
      "Não forma frases de duas palavras até 24 meses",
      "Perda de habilidades já adquiridas (regressão)",
      "Movimentos repetitivos",
    ],
  },
  {
    age: "De 2 a 5 anos",
    items: [
      "Dificuldade em manter conversas",
      "Brincadeiras repetitivas ou com foco restrito",
      "Sensibilidade a sons, texturas ou luzes",
      "Dificuldade com mudanças de rotina",
    ],
  },
  {
    age: "Crianças maiores e adolescentes",
    items: [
      "Dificuldade com regras sociais e expressões figuradas",
      "Interesses intensos e restritos",
      "Ansiedade em situações sociais",
      "Dificuldade com organização escolar",
    ],
  },
];

const FAQ = [
  {
    question: "Preciso de diagnóstico fechado para iniciar?",
    answer:
      "Não. O primeiro passo é o acolhimento. A equipe avalia se o caso pede uma especialidade ou uma avaliação interdisciplinar, sem exigir diagnóstico prévio.",
  },
  {
    question: "Com que idade pode começar o atendimento?",
    answer:
      "Desde os primeiros anos de vida. A intervenção precoce é uma das abordagens com mais evidência em neurodesenvolvimento e autismo.",
  },
  {
    question: "A ELO emite relatórios para a escola?",
    answer:
      "Sim, quando necessário, para a escola, outros profissionais ou processos de avaliação. A comunicação entre clínica, família e escola faz parte do processo.",
  },
  {
    question: "O convênio cobre o acompanhamento?",
    answer:
      "Os cinco convênios credenciados cobrem as especialidades da clínica, mediante encaminhamento médico e autorização quando exigida. A recepção confere a documentação antes de agendar.",
  },
];

function Autism() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Autismo (TEA)"
        title="O cuidado com o autismo começa pelo acolhimento da família"
        sub="Avaliamos, planejamos e acompanhamos cada etapa do desenvolvimento com equipe integrada e comunicação transparente. Sem promessas de cura, com metas reais e respeito ao tempo de cada pessoa."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link to="/agendar" search={{ servico: "aval" }}>
            Agendar avaliação
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a
            href={waLink("Olá! Estou com dúvidas sobre o atendimento de autismo (TEA) na ELO.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Falar com a equipe
          </a>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <img
            src={hero}
            width={1600}
            height={1104}
            alt="Criança em atividade terapêutica acompanhada por profissional da ELO"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Entenda o TEA
            </p>
            <h2 className="mt-2 font-display text-3xl">O que é o Transtorno do Espectro Autista</h2>
            <p className="mt-3 text-muted-foreground">
              O TEA é uma condição do neurodesenvolvimento que afeta a forma como a pessoa se
              comunica, interage socialmente e percebe o mundo. É chamado de espectro porque se
              manifesta de maneiras muito diferentes em cada pessoa.
            </p>
            <p className="mt-3 text-muted-foreground">
              Não é uma doença e não tem cura. O que muda a trajetória é a qualidade do
              acompanhamento: intervenção adequada, orientação familiar e equipe especializada
              desenvolvem comunicação, autonomia e qualidade de vida em qualquer idade.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Na CID-11, o TEA é identificado pelo código 6A02.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Sinais de atenção
          </p>
          <h2 className="mt-2 font-display text-3xl">Quando buscar avaliação</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Um ou mais sinais não significam diagnóstico, mas indicam que vale buscar avaliação
            profissional. Cada criança se desenvolve no seu ritmo.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SIGNS.map((group) => (
              <div key={group.age} className="rounded-2xl bg-card p-5">
                <h3 className="font-display text-lg">{group.age}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm">
            Percebeu algum sinal?{" "}
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href={waLink(
                "Olá! Percebi alguns sinais no desenvolvimento do meu filho e gostaria de orientação.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Fale com a equipe da ELO
            </a>
            . Não é preciso ter diagnóstico fechado para iniciar.
          </p>
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Equipe integrada
        </p>
        <h2 className="mt-2 font-display text-3xl">Especialidades envolvidas no acompanhamento</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Cada especialidade contribui para uma visão completa do caso, com comunicação constante
          entre os profissionais.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.filter((service) => service.id !== "aval").map((service) => (
            <Link
              key={service.id}
              to="/servicos"
              hash={service.id}
              className="rounded-xl border border-border bg-card p-4 text-sm transition hover:border-primary/50 hover:shadow-soft"
            >
              <span className="font-semibold">{service.name}</span>
              <p className="mt-1 text-xs text-muted-foreground">
                {service.tags.slice(0, 2).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/servicos">
            Ver todos os serviços <ArrowRight />
          </Link>
        </Button>
      </section>

      <PlansStrip />
      <Faq items={FAQ} />
      <CtaBand
        title="Seu filho não precisa ser um diagnóstico para ser acolhido"
        text="A avaliação interdisciplinar reúne o olhar de diferentes especialidades e devolve um plano com metas claras para a família."
      />
      <SiteFooter />
    </div>
  );
}
