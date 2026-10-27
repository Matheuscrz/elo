import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  FileText,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CtaBand, Faq, PageHero, SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { PLANS, SERVICES, waLink } from "@/lib/clinic";

export const Route = createFileRoute("/convenios")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Convênios e particular — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Convênios aceitos pela ELO em Aracaju: Saúde Petrobras, Saúde Caixa, Porto Saúde, SulAmérica, GEAP Saúde e atendimento particular. Veja como agendar.",
      },
      { property: "og:title", content: "Convênios e particular — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Cinco convênios credenciados e atendimento particular em Aracaju/SE.",
      },
    ],
  }),
  component: Plans,
});

const FAQ = [
  {
    question: "Quais convênios a ELO aceita?",
    answer:
      "Saúde Petrobras, Saúde Caixa, Porto Saúde, SulAmérica e GEAP Saúde. Também atendemos particular, com recibo para solicitação de reembolso.",
  },
  {
    question: "Preciso de encaminhamento médico?",
    answer:
      "Sim. Para qualquer atendimento por convênio é obrigatório encaminhamento médico para a especialidade desejada. Para atendimento particular não é necessário.",
  },
  {
    question: "Todas as especialidades são cobertas?",
    answer:
      "As oito especialidades da clínica podem ser acessadas pelos convênios aceitos, mas a cobertura específica depende do plano e pode exigir autorização prévia. A recepção confere antes de agendar.",
  },
  {
    question: "Meu plano não está na lista. E agora?",
    answer:
      "Você pode optar pelo atendimento particular ou verificar com a operadora a possibilidade de reembolso. A equipe ajuda a orientar a documentação necessária.",
  },
];

function Plans() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Convênios"
        title="Atendimento pelo seu convênio ou particular, com orientação antes do agendamento"
        sub="A ELO é credenciada junto aos principais convênios de Sergipe. Todas as especialidades podem ser acessadas pelo plano, mediante encaminhamento médico e autorização quando exigida."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link to="/agendar">Agendar atendimento</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a
            href={waLink("Olá! Gostaria de verificar a cobertura do meu convênio na ELO.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Verificar meu plano
          </a>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Credenciado</span>
              </div>
              <h2 className="mt-3 font-display text-xl">{plan.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{plan.note}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Fechamento mensal: dia {plan.closingDay}
              </p>
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <a
                  href={waLink(`Olá! Gostaria de verificar a cobertura do ${plan.name} na ELO.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar cobertura
                </a>
              </Button>
            </article>
          ))}
          <article className="flex flex-col justify-between rounded-2xl border border-accent/40 bg-accent/10 p-6">
            <div>
              <div className="flex items-center gap-2 text-accent-foreground">
                <BadgeCheck className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Sem convênio</span>
              </div>
              <h2 className="mt-3 font-display text-xl">Atendimento particular</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sem necessidade de encaminhamento. Valores por sessão informados pela recepção e
                recibo para reembolso.
              </p>
            </div>
            <Button asChild className="mt-4 rounded-full">
              <a
                href={waLink("Olá! Gostaria de saber os valores do atendimento particular na ELO.")}
                target="_blank"
                rel="noreferrer"
              >
                Falar sobre valores
              </a>
            </Button>
          </article>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Passo a passo
          </p>
          <h2 className="mt-2 font-display text-3xl">Como agendar pelo convênio</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Stethoscope,
                title: "Encaminhamento médico",
                text: "Solicite ao médico um encaminhamento para a especialidade desejada. Sem ele, o convênio não autoriza o atendimento.",
              },
              {
                icon: FileText,
                title: "Autorização e guia",
                text: "Confirme com a operadora se o procedimento exige autorização prévia. Em algumas terapias, a guia é obrigatória.",
              },
              {
                icon: MessageCircle,
                title: "Agendamento na ELO",
                text: "Com encaminhamento e documentação em mãos, agende pelo site ou WhatsApp. A recepção confere carteirinha, validade e guia.",
              },
            ].map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-card p-6">
                <div className="flex items-center justify-between">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="font-display text-2xl text-accent">0{index + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p>
              <strong>Regra da clínica:</strong> todo atendimento por convênio exige encaminhamento
              médico. O agendamento online fica condicionado à apresentação do documento na
              recepção.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Cobertura</p>
        <h2 className="mt-2 font-display text-3xl">Especialidades disponíveis</h2>
        <p className="mt-2 text-muted-foreground">
          Todos os convênios credenciados cobrem as mesmas oito especialidades, respeitando as
          regras do plano.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <li
              key={service.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
            >
              <Check className="h-4 w-4 shrink-0 text-primary" />
              {service.name}
            </li>
          ))}
        </ul>
      </section>

      <Faq items={FAQ} />
      <CtaBand
        title="Agende pelo seu convênio ou particular"
        text="Tenha o encaminhamento em mãos (convênio) ou fale direto com a recepção (particular). A ELO cuida do resto."
      />
      <SiteFooter />
    </div>
  );
}
