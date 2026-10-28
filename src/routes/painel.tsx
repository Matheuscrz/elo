import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  CalendarDays,
  CalendarRange,
  Calculator,
  DoorOpen,
  FileSpreadsheet,
  Files,
  FolderOpen,
  Globe,
  LogOut,
  MessageCircle,
  Tags,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/painel")({
  validateSearch: (search: Record<string, unknown>): { perfil?: Role } => {
    const perfil = search["perfil"];
    if (
      perfil === "recepcao" ||
      perfil === "gestor" ||
      perfil === "contador" ||
      perfil === "admin"
    ) {
      return { perfil };
    }
    return {};
  },
  head: () => ({
    meta: [
      { title: "Painel da equipe — ELO Saúde Integrada" },
      {
        name: "description",
        content: "Gestão interna: agenda, check-in, faturamento, salas, escalas e repasses.",
      },
      { property: "og:title", content: "Painel da equipe — ELO Saúde Integrada" },
      { property: "og:description", content: "Gestão interna da clínica." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Layout,
});

type Role = "recepcao" | "gestor" | "contador" | "admin";

const ROLES: { value: Role; label: string }[] = [
  { value: "recepcao", label: "Recepcionista" },
  { value: "gestor", label: "Gestor" },
  { value: "contador", label: "Contador" },
  { value: "admin", label: "Administrador" },
];

const ALL: Role[] = ["recepcao", "gestor", "contador", "admin"];

const NAV: {
  group: string;
  items: { to: string; label: string; icon: typeof CalendarDays; roles: Role[] }[];
}[] = [
  {
    group: "Recepção",
    items: [
      {
        to: "/painel",
        label: "Agenda do dia",
        icon: CalendarDays,
        roles: ["recepcao", "gestor", "admin"],
      },
      {
        to: "/painel/faturamento",
        label: "Faturamento convênios",
        icon: FileSpreadsheet,
        roles: ["recepcao", "gestor", "admin", "contador"],
      },
    ],
  },
  {
    group: "Operação",
    items: [
      {
        to: "/painel/gestor",
        label: "Dashboard",
        icon: BarChart3,
        roles: ["recepcao", "gestor", "admin", "contador"],
      },
      {
        to: "/painel/salas",
        label: "Salas e locação",
        icon: DoorOpen,
        roles: ["recepcao", "gestor", "admin"],
      },
      {
        to: "/painel/escalas",
        label: "Escalas da equipe",
        icon: CalendarRange,
        roles: ["recepcao", "gestor", "admin"],
      },
      {
        to: "/painel/cadastros",
        label: "Cadastros e valores",
        icon: FolderOpen,
        roles: ["recepcao", "gestor", "admin"],
      },
      {
        to: "/painel/planos",
        label: "Planos e valores",
        icon: Tags,
        roles: ["gestor", "admin", "contador"],
      },
      {
        to: "/painel/contratos",
        label: "Contratos de locação",
        icon: Files,
        roles: ["gestor", "admin", "contador"],
      },
    ],
  },
  {
    group: "Relacionamento",
    items: [
      {
        to: "/painel/whatsapp",
        label: "Central WhatsApp",
        icon: MessageCircle,
        roles: ["recepcao", "gestor", "admin"],
      },
    ],
  },
  {
    group: "Financeiro",
    items: [
      {
        to: "/painel/repasses",
        label: "Produção e repasses",
        icon: ArrowLeftRight,
        roles: ["gestor", "admin", "contador"],
      },
      {
        to: "/painel/contabilidade",
        label: "Contabilidade",
        icon: Calculator,
        roles: ["contador", "admin"],
      },
    ],
  },
  {
    group: "Sistema",
    items: [
      {
        to: "/painel/usuarios",
        label: "Usuários e permissões",
        icon: Users,
        roles: ["gestor", "admin"],
      },
    ],
  },
];

function Layout() {
  const { perfil } = Route.useSearch();
  const [role, setRole] = useState<Role>(perfil ?? "admin");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = NAV.flatMap((group) => group.items).find(
    (item) => item.to === pathname || (item.to !== "/painel" && pathname.startsWith(item.to)),
  );
  const canAccess = !current || current.roles.includes(role);
  const roleLabel = ROLES.find((item) => item.value === role)?.label ?? "Perfil";

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <div className="px-2 py-3">
          <Logo light />
        </div>
        <nav className="mt-6 flex-1 space-y-6" aria-label="Navegação do painel">
          {NAV.map((group) => {
            const items = group.items.filter((item) => item.roles.includes(role));
            if (items.length === 0) return null;
            return (
              <div key={group.group}>
                <p className="px-3 text-xs uppercase tracking-widest opacity-60">{group.group}</p>
                <div className="mt-2 space-y-1">
                  {items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to as "/painel"}
                      activeOptions={{ exact: item.to === "/painel" }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"
                      activeProps={{
                        className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="mt-2 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent"
          >
            <Globe className="h-4 w-4" /> Ver site
          </Link>
          <Link
            to="/acesso"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" /> Sair do painel
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-8">
          <div>
            <span className="text-sm font-semibold">
              ELO{" "}
              <span className="font-normal text-muted-foreground">
                / {current?.label ?? "Painel"}
              </span>
            </span>
            <p className="text-xs text-muted-foreground">
              Demonstração · {roleLabel} · dados não salvos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <Select
              value={role}
              onValueChange={(value) => {
                const nextRole = value as Role;
                setRole(nextRole);
                void navigate({
                  search: (previous) => ({ ...previous, perfil: nextRole }),
                  replace: true,
                });
              }}
            >
              <SelectTrigger className="h-9 w-44" aria-label="Perfil de acesso (demonstração)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <nav
          className="flex gap-2 overflow-x-auto border-b border-border bg-card p-2 lg:hidden"
          aria-label="Navegação mobile do painel"
        >
          {NAV.map((group) =>
            group.items
              .filter((item) => item.roles.includes(role))
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to as "/painel"}
                  activeOptions={{ exact: item.to === "/painel" }}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm"
                  activeProps={{ className: "bg-primary text-primary-foreground" }}
                >
                  {item.label}
                </Link>
              )),
          )}
        </nav>

        <main className="p-4 md:p-8">
          {canAccess ? (
            <Outlet />
          ) : (
            <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 font-display text-2xl">Acesso não liberado para {roleLabel}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Esta área faz parte de outro perfil. No protótipo, use o seletor de perfil no topo
                para simular outro acesso.
              </p>
              <Button asChild variant="outline" className="mt-5 rounded-full">
                <Link to="/painel">Voltar para a agenda</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
