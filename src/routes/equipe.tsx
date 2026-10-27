import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CtaBand, PageHero, SiteFooter, TeamSection } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/clinic";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Equipe multiprofissional — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Conheça os terapeutas ocupacionais, fonoaudiólogos, psicólogos, psicopedagogos, nutricionistas, fisioterapeutas, musicoterapeutas e psicomotricistas da ELO em Aracaju.",
      },
      { property: "og:title", content: "Equipe multiprofissional — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Mais de 20 profissionais de 8 especialidades em Aracaju/SE.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Equipe"
        title="Cada profissional é escolhido pela técnica e pelo compromisso com o cuidado integrado"
        sub="A equipe se comunica entre si sobre cada paciente, para que o plano terapêutico funcione como um todo — e a família não precise repetir a história a cada atendimento."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link to="/agendar">Agendar atendimento</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a href={waLink()} target="_blank" rel="noreferrer">
            <MessageCircle /> Falar com a equipe
          </a>
        </Button>
      </PageHero>
      <TeamSection />
      <CtaBand
        title="O primeiro passo é falar com a gente"
        text="Se você percebe sinais no desenvolvimento do seu filho ou já tem diagnóstico e busca acompanhamento em Aracaju, o acolhimento começa aqui."
      />
      <SiteFooter />
    </div>
  );
}
