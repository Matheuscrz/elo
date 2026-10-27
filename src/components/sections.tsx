import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import {
  ArrowRight,
  Check,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CLINIC,
  GALLERY,
  PLANS,
  PROFESSIONALS,
  SERVICES,
  serviceById,
  waLink,
  type Service,
} from "@/lib/clinic";
import { POSTS } from "@/lib/blog";
import hero from "@/assets/hero.jpg";

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-hero">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function HomeHero() {
  return (
    <section className="bg-hero">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-4 w-4" /> {CLINIC.city} · desde {CLINIC.founded}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-foreground md:text-5xl">
            Cuidado integrado em <em className="text-accent">neurodesenvolvimento</em>, do
            acolhimento ao resultado.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Você não precisa descobrir sozinho qual especialidade seu filho precisa. A ELO reúne 8
            especialidades e mais de 20 profissionais no mesmo espaço, com um plano terapêutico
            único para cada família.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-soft">
              <Link to="/agendar">
                <Icons.CalendarHeart /> Agendar atendimento
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={waLink()} target="_blank" rel="noreferrer">
                <MessageCircle /> Falar no WhatsApp
              </a>
            </Button>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              ["8", "especialidades"],
              ["20+", "profissionais"],
              ["5", "convênios"],
              ["2016", "cuidando de famílias"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl text-primary">{value}</dt>
                <dd className="text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img
          src={hero}
          width={1600}
          height={1104}
          alt="Profissional da ELO em atendimento acolhedor com criança e mãe"
          className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
        />
      </div>
    </section>
  );
}

export function PlansStrip() {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Convênios</p>
          <p className="mt-1 font-display text-xl">Atendemos pelo seu plano e também particular</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PLANS.map((plan) => (
            <span
              key={plan.id}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
            >
              {plan.name}
            </span>
          ))}
          <Link
            to="/convenios"
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver regras
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Heart;
  return (
    <Link
      to="/servicos"
      hash={service.id}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-xl">{service.name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{service.desc}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        Sessão de {service.duration} min · infantil, adolescente e adulto
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Saber mais <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function ServicesSection({ heading = "Nossos serviços" }: { heading?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="servicos">
      <SectionTitle
        eyebrow="Serviços"
        title={heading}
        sub="Oito especialidades que conversam entre si, mais avaliação interdisciplinar quando o caso pede um olhar conjunto."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Não sabe qual serviço é o mais indicado?{" "}
        <a
          className="font-semibold text-primary underline-offset-4 hover:underline"
          href={waLink()}
          target="_blank"
          rel="noreferrer"
        >
          Fale com a equipe
        </a>{" "}
        antes de agendar.
      </p>
    </section>
  );
}

const STEPS = [
  {
    title: "Acolhimento inicial, sem burocracia",
    text: "Você conta o que está vivendo. A equipe orienta o caminho mais adequado antes de qualquer agendamento formal.",
  },
  {
    title: "Plano terapêutico com metas e prazos reais",
    text: "A avaliação define objetivos claros, profissionais envolvidos e reavaliações periódicas — com a família por dentro.",
  },
  {
    title: "Acompanhamento e evolução contínua",
    text: "A equipe revisa dados, ajusta metas e mantém comunicação aberta entre profissionais, escola e cuidadores.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          eyebrow="Como funciona"
          title="O primeiro passo na ELO"
          sub="Sem diagnóstico fechado? Não é obstáculo. O acolhimento começa pela escuta da família."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-2xl bg-card p-6">
              <span className="font-display text-3xl text-accent">0{index + 1}</span>
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AutismTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-card p-6 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Autismo (TEA)
          </p>
          <h2 className="mt-2 font-display text-3xl">
            Sinais merecem avaliação, não diagnóstico pela internet.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A ELO acompanha famílias com TEA desde 2016. A avaliação é individual ou
            interdisciplinar, e não exige diagnóstico fechado para começar. O que muda a trajetória
            é a qualidade do acompanhamento.
          </p>
          <ul className="mt-5 grid gap-2 text-sm">
            {[
              "Todos os profissionais têm formação em ABA e especialização em TEA",
              "Equipe integrada com comunicação sobre cada paciente",
              "Orientação familiar em todas as etapas",
              "Atendimento para crianças, adolescentes e idosos",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/autismo">
              Entender o TEA na ELO <ArrowRight />
            </Link>
          </Button>
        </div>
        <img
          src={hero}
          width={1600}
          height={1104}
          alt="Ambiente acolhedor de atendimento infantil da ELO"
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  );
}

function ProfessionalCard({ professionalId }: { professionalId: string }) {
  const professional = PROFESSIONALS.find((p) => p.id === professionalId)!;
  const service = serviceById(professional.serviceId);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card">
      {professional.image ? (
        <img
          src={professional.image}
          alt={`${professional.name} — ${service.name}`}
          width={480}
          height={597}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1 bg-secondary">
          <span className="font-display text-4xl text-primary">{professional.initials}</span>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Foto em breve
          </span>
        </div>
      )}
      <div className="p-5">
        <p className="font-semibold">{professional.name}</p>
        <p className="text-sm text-accent">{service.name}</p>
        <p className="mt-3 text-sm text-muted-foreground">{professional.bio}</p>
      </div>
    </article>
  );
}

export function TeamSection({ grouped = true }: { grouped?: boolean }) {
  const groups = SERVICES.filter((service) => service.id !== "aval").map((service) => ({
    service,
    people: PROFESSIONALS.filter((p) => p.serviceId === service.id),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="equipe">
      <SectionTitle
        eyebrow="Equipe"
        title="Mais de 20 profissionais, 8 especialidades"
        sub="Todos atuando no mesmo espaço físico e com comunicação constante sobre cada paciente."
      />
      {grouped ? (
        <div className="space-y-10">
          {groups.map(({ service, people }) => (
            <div key={service.id}>
              <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-border pb-2">
                <h3 className="font-display text-2xl">{service.name}</h3>
                <span className="text-xs text-muted-foreground">{people.length} profissionais</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((person) => (
                  <ProfessionalCard key={person.id} professionalId={person.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROFESSIONALS.filter((p) => p.id !== "p20" && p.image)
            .slice(0, 6)
            .map((person) => (
              <ProfessionalCard key={person.id} professionalId={person.id} />
            ))}
        </div>
      )}
    </section>
  );
}

export function ClinicGallery({ preview = false }: { preview?: boolean }) {
  const feature = preview ? undefined : GALLERY.find((image) => image.wide);
  const rooms = GALLERY.filter((image) => !image.wide);
  const shown = preview ? rooms.slice(0, 3) : rooms;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="ambiente">
      <SectionTitle
        eyebrow="Ambiente"
        title="Um espaço pensado para o desenvolvimento"
        sub="Salas climatizadas, integração sensorial e um ambiente lúdico que acolhe a criança e tranquiliza a família — na 13 de Julho, em Aracaju."
      />
      {feature && (
        <figure className="relative mb-4 overflow-hidden rounded-[2rem] border border-border">
          <img
            src={feature.src}
            alt={feature.alt}
            width={1536}
            height={533}
            loading="lazy"
            className="h-56 w-full object-cover md:h-72"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 text-sm font-medium text-white">
            {feature.title}
          </figcaption>
        </figure>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((image) => (
          <figure
            key={image.slug}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card"
          >
            <img
              src={image.src}
              alt={image.alt}
              width={1400}
              height={933}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-4">
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/75">
                {image.tag}
              </span>
              <p className="text-sm font-medium text-white">{image.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      {preview && (
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/ambiente">
            Conhecer a clínica <ArrowRight />
          </Link>
        </Button>
      )}
    </section>
  );
}

export function BlogSection({ limit = 3 }: { limit?: number }) {
  const posts = POSTS.slice(0, limit);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="blog">
      <SectionTitle
        eyebrow="Blog"
        title="Informação para decidir com segurança"
        sub="Conteúdo sobre desenvolvimento, autismo, terapias e convênios — escrito para famílias."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {post.category}
            </span>
            <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-primary">
              {post.title}
            </h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              {post.date} · {post.readingTime} de leitura
            </p>
          </Link>
        ))}
      </div>
      <Button asChild variant="outline" className="mt-6 rounded-full">
        <Link to="/blog">
          Ver todos os artigos <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}

export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle eyebrow="Dúvidas frequentes" title="Perguntas que as famílias sempre fazem" />
      <Accordion
        type="single"
        collapsible
        className="rounded-2xl border border-border bg-card px-5"
      >
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function CtaBand({
  title = "Cada fase tem suas necessidades. A ELO atende todas elas.",
  text = "Crianças, adolescentes e idosos, com plano individualizado e suporte à família.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm opacity-80">{text}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/agendar">Agendar atendimento</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <a href={waLink()} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <img
            src="/media/logo-white.png"
            alt={CLINIC.name}
            width={304}
            height={110}
            className="h-9 w-auto"
          />
          <p className="text-sm opacity-80">
            Clínica multiprofissional em Aracaju (SE), com foco em autismo (TEA),
            neurodesenvolvimento e reabilitação.
          </p>
          <p className="flex gap-2 text-sm opacity-90">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {CLINIC.address}
            </a>
          </p>
          <p className="flex gap-2 text-sm opacity-90">
            <Clock className="h-4 w-4 shrink-0" />
            {CLINIC.hours}
          </p>
          <p className="flex gap-2 text-sm opacity-90">
            <Phone className="h-4 w-4 shrink-0" />
            <a href={`tel:+55${CLINIC.phone.replace(/\D/g, "")}`} className="hover:underline">
              {CLINIC.phone}
            </a>
          </p>
          <div className="flex gap-2 pt-2">
            <Button asChild variant="secondary" className="rounded-full">
              <a href={waLink()} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <a href={CLINIC.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram />
              </a>
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Navegação</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {[
              ["Início", "/"],
              ["Serviços", "/servicos"],
              ["Convênios", "/convenios"],
              ["Equipe", "/equipe"],
              ["Ambiente", "/ambiente"],
              ["Autismo (TEA)", "/autismo"],
              ["Blog", "/blog"],
              ["Área do paciente", "/minhas-consultas"],
              ["Acesso da equipe", "/acesso"],
              ["Agendar atendimento", "/agendar"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to as "/"} className="opacity-90 hover:opacity-100 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Convênios</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {PLANS.map((plan) => (
              <li key={plan.id}>
                <Link to="/convenios" className="opacity-90 hover:opacity-100 hover:underline">
                  {plan.name}
                </Link>
              </li>
            ))}
            <li className="opacity-70">Particular (com recibo para reembolso)</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Onde estamos</p>
          <iframe
            title="Mapa da ELO Saúde Integrada"
            className="mt-3 h-44 w-full rounded-xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=R.+Dr.+C%C3%A9lso+Oliva,+471,+13+de+Julho,+Aracaju+-+SE,+49020-090&output=embed"
          />
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs opacity-70">
          © {new Date().getFullYear()} {CLINIC.name} · {CLINIC.city} · Protótipo de demonstração
        </p>
      </div>
    </footer>
  );
}
