import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Calculator,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/site-header";
import { CLINIC } from "@/lib/clinic";

export const Route = createFileRoute("/acesso")({
  head: () => ({
    meta: [
      { title: "Acesso da equipe — ELO Saúde Integrada" },
      {
        name: "description",
        content: "Acesso demonstrativo ao painel interno da ELO Saúde Integrada.",
      },
      { property: "og:title", content: "Acesso da equipe — ELO Saúde Integrada" },
      { property: "og:description", content: "Painel interno da clínica." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Access,
});

type Role = "recepcao" | "gestor" | "contador" | "admin";

const PROFILES: {
  role: Role;
  label: string;
  description: string;
  icon: typeof CalendarCheck;
}[] = [
  {
    role: "recepcao",
    label: "Recepcionista",
    description:
      "Operação completa: agenda, valores, check-in, salas, escalas, cadastros e dashboard.",
    icon: CalendarCheck,
  },
  {
    role: "gestor",
    label: "Gestor",
    description: "Usuários e permissões, auditoria dos módulos e correções.",
    icon: BarChart3,
  },
  {
    role: "contador",
    label: "Contador",
    description: "Faturamento, contratos, repasses, conciliação e fechamento.",
    icon: Calculator,
  },
  {
    role: "admin",
    label: "Administrador",
    description: "Acesso irrestrito aos módulos, permissões e configurações.",
    icon: ShieldCheck,
  },
];

function Access() {
  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1fr_1.05fr]">
        <aside className="hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <Logo light />
            <p className="mt-16 text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-primary">
              Acesso interno
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight">
              O cuidado também acontece nos bastidores.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
              Agenda, salas, contratos, repasses e contabilidade em um só lugar — com permissões
              diferentes para cada função da clínica.
            </p>
            <ul className="mt-8 grid gap-3 text-sm opacity-85">
              <li>• Recepção com agenda, valores, salas, escalas e cadastros.</li>
              <li>• Gestão de acessos e permissões, com auditoria dos módulos.</li>
              <li>• Contabilidade com conciliação e fechamento mensal.</li>
              <li>• Administração com visão completa dos módulos.</li>
            </ul>
          </div>
          <div className="text-sm opacity-70">
            <p>{CLINIC.address}</p>
            <p className="mt-1">{CLINIC.phone}</p>
            <Link to="/" className="mt-4 inline-block underline underline-offset-4">
              Voltar ao site
            </Link>
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <Logo />
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">
              <LockKeyhole className="h-3.5 w-3.5" /> Ambiente restrito à equipe
            </p>
            <h2 className="mt-4 font-display text-3xl">Entrar no painel</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecione um perfil para simular o acesso. Cada perfil mostra apenas os módulos da sua
              função.
            </p>

            <div className="mt-6 grid gap-3">
              {PROFILES.map((profile) => (
                <Link
                  key={profile.role}
                  to="/painel"
                  search={{ perfil: profile.role }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <profile.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{profile.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {profile.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>

            <p className="mt-6 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
              <b className="text-foreground">Demonstração:</b> não há autenticação real. Nenhuma
              senha é solicitada ou validada e os dados do painel não são salvos. O controle de
              acesso é simulado pelo perfil escolhido.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground lg:hidden"
            >
              Voltar ao site
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
