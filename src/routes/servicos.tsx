import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CtaBand, Faq, HowItWorks, PageHero, PlansStrip, SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { PROFESSIONALS, SERVICES, waLink } from "@/lib/clinic";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Serviços — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Terapia ocupacional, fonoaudiologia, psicologia, psicopedagogia, nutrição, fisioterapia, musicoterapia, psicomotricidade e avaliação interdisciplinar em Aracaju.",
      },
      { property: "og:title", content: "Serviços — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Oito especialidades integradas e avaliação interdisciplinar em Aracaju/SE.",
      },
    ],
  }),
  component: Services,
});

const FAQ = [
  {
    question: "Como sei qual serviço meu filho precisa?",
    answer:
      "Você não precisa decidir sozinho. O acolhimento inicial existe justamente para ouvir a demanda e indicar se o caso pede uma especialidade ou uma avaliação interdisciplinar.",
  },
  {
    question: "A frequência é semanal?",
    answer:
      "A maioria das terapias acontece uma vez por semana, com duração de 40 a 50 minutos. A frequência final é definida no plano terapêutico, considerando o caso e a cobertura do convênio.",
  },
  {
    question: "Todos os profissionais atendem por convênio?",
    answer:
      "A cobertura depende do plano e da especialidade. Para convênio é necessário encaminhamento médico. A recepção confere carteirinha, validade e guia antes de confirmar o agendamento.",
  },
  {
    question: "A ELO atende adultos?",
    answer:
      "Sim. Psicologia, nutrição, fisioterapia, terapia ocupacional e musicoterapia também atendem adolescentes, adultos e idosos.",
  },
];

function Services() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Serviços"
        title="Oito especialidades no mesmo espaço, com um plano terapêutico só"
        sub="A equipe da ELO trabalha de forma integrada: o que uma especialidade observa, as outras sabem. Isso reduz retrabalho para a família e dá continuidade ao cuidado."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link to="/agendar">Agendar atendimento</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a href={waLink()} target="_blank" rel="noreferrer">
            <Icons.MessageCircle /> Falar com a equipe
          </a>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-4">
          {SERVICES.map((service) => {
            const Icon =
              (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Heart;
            const team = PROFESSIONALS.filter((p) => p.serviceId === service.id);
            return (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8"
              >
                <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-start">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl">{service.name}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">{service.desc}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Sessão de {service.duration} min ·{" "}
                      {team.length > 0
                        ? `${team.length} profissional(is) na equipe`
                        : "equipe interdisciplinar"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <Button asChild className="rounded-full">
                      <Link to="/agendar" search={{ servico: service.id }}>
                        Agendar <ArrowRight />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="rounded-full">
                      <a
                        href={waLink(`Olá! Gostaria de saber mais sobre ${service.name} na ELO.`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tirar dúvida
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Diferenciais
          </p>
          <h2 className="mt-2 font-display text-3xl">Por que a integração importa</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                "Todos com ABA e TEA",
                "Não é uma ou duas especialidades: todos os profissionais têm formação em ABA e especialização em TEA.",
              ],
              [
                "Equipe que se fala",
                "Reuniões e comunicação contínua sobre cada caso, sem a família repetir a história a cada porta.",
              ],
              [
                "Metas e prazos",
                "Plano terapêutico individualizado, com reavaliações periódicas e devolutiva clara para a família.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-card p-6">
                <Check className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlansStrip />
      <HowItWorks />
      <Faq items={FAQ} />
      <CtaBand
        title="Não sabe qual serviço é o mais indicado?"
        text="Fale com a equipe antes de agendar. O acolhimento orienta o caminho mais adequado."
      />
      <SiteFooter />
    </div>
  );
}
