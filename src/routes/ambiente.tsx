import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, Clock, MapPin, MessageCircle, ShieldCheck, Snowflake, Sofa } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ClinicGallery, CtaBand, PageHero, SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { CLINIC, waLink } from "@/lib/clinic";

export const Route = createFileRoute("/ambiente")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Ambiente da clínica — ELO Saúde Integrada em Aracaju" },
      {
        name: "description",
        content:
          "Conheça o ambiente da ELO Saúde Integrada em Aracaju: salas de integração sensorial, espaço lúdico, consultórios climatizados e recepção acolhedora.",
      },
      { property: "og:title", content: "Ambiente da clínica — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Fotos reais das salas e espaços da clínica na 13 de Julho, em Aracaju/SE.",
      },
    ],
  }),
  component: Ambiente,
});

const HIGHLIGHTS = [
  {
    icon: Blocks,
    title: "Integração sensorial",
    text: "Sala equipada com balanço, bola terapêutica, tatame e prancha de equilíbrio para o trabalho corporal.",
  },
  {
    icon: Sofa,
    title: "Espaço lúdico",
    text: "Brinquedos, jogos e piscina de bolinhas que ajudam a criança a se sentir à vontade durante a sessão.",
  },
  {
    icon: Snowflake,
    title: "Salas climatizadas",
    text: "Consultórios amplos e climatizados, organizados para atendimento individual e em equipe.",
  },
  {
    icon: ShieldCheck,
    title: "Circulação segura",
    text: "Escadas e corredores com proteção, pensados para crianças que circulam acompanhadas.",
  },
  {
    icon: MapPin,
    title: "13 de Julho",
    text: "Localização central em Aracaju, com acesso pela R. Dr. Célso Oliva, 471.",
  },
  {
    icon: Clock,
    title: "Horário estendido",
    text: "Atendimento de segunda a sexta e no sábado pela manhã, com agendamento prévio.",
  },
];

function Ambiente() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Ambiente"
        title="Um espaço que acolhe antes mesmo de a terapia começar"
        sub="Conheça as salas onde o cuidado acontece. Cada detalhe do ambiente foi pensado para reduzir a insegurança da criança e da família — do primeiro contato na recepção até a sessão."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link to="/agendar">Agendar uma visita</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a
            href={waLink("Olá! Gostaria de conhecer o ambiente da clínica.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Falar no WhatsApp
          </a>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <ClinicGallery />

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid items-center gap-6 rounded-[2rem] border border-border bg-card p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Como chegar
            </p>
            <h2 className="mt-2 font-display text-3xl">No coração de Aracaju</h2>
            <p className="mt-3 text-muted-foreground">
              Estamos na R. Dr. Célso Oliva, 471, no bairro 13 de Julho. Se preferir, fale com a
              recepção antes de vir para orientarmos sobre horários, convênio e documentação.
            </p>
            <div className="mt-5 grid gap-2 text-sm">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {CLINIC.address}
              </p>
              <p className="flex gap-2">
                <Clock className="h-4 w-4 shrink-0 text-primary" /> {CLINIC.hours}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer">
                  <MapPin /> Abrir no mapa
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/agendar">Agendar atendimento</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-secondary p-6">
            <p className="font-display text-2xl text-primary">Antes de vir</p>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>• Chegue com 10 minutos de antecedência para o acolhimento.</li>
              <li>• Para convênio, traga o encaminhamento médico e a guia autorizada.</li>
              <li>• Crianças devem estar acompanhadas por um responsável legal.</li>
              <li>• Em caso de remarcação, avise a recepção com antecedência.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Fotos divulgadas no site oficial da ELO Saúde Integrada e reproduzidas neste protótipo
          apenas para demonstrar o layout. As imagens retratam o ambiente real da clínica.
        </p>
      </section>

      <CtaBand
        title="Quer conhecer a clínica pessoalmente?"
        text="A recepção pode organizar uma visita guiada e tirar dúvidas sobre especialidades, convênios e horários antes do primeiro atendimento."
      />
      <SiteFooter />
    </div>
  );
}
