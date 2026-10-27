import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, DoorOpen, FileWarning, PieChart, Users } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { brl, daysUntilBillingDeadline, ROOMS, SERVICES, serviceById, TODAY } from "@/lib/clinic";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/gestor")({
  head: () =>
    pageMeta(
      "Dashboard executivo",
      "Indicadores demonstrativos de atendimentos, convênios e ocupação de salas.",
    ),
  component: Dashboard,
});

function Dashboard() {
  const days = daysUntilBillingDeadline();
  const activeRooms = ROOMS.filter((room) => room.status !== "Inativa");
  const occupancy = Math.round(
    (activeRooms.filter((room) => room.status === "Ocupada").length /
      Math.max(activeRooms.length, 1)) *
      100,
  );
  const active = TODAY.filter((appointment) => appointment.status !== "canceled");
  const planCount = active.filter((appointment) => appointment.plan !== "Particular").length;
  const privateRevenue = active
    .filter((appointment) => appointment.plan === "Particular")
    .reduce((sum, appointment) => sum + appointment.price, 0);
  const missingAuthorization = active.filter(
    (appointment) => appointment.plan !== "Particular" && !appointment.authorization,
  ).length;

  const byService = SERVICES.map((service) => ({
    service,
    count: active.filter((appointment) => appointment.serviceId === service.id).length,
  }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count);
  const max = Math.max(...byService.map((row) => row.count), 1);

  const cards = [
    {
      icon: Users,
      label: "Atendimentos no mês",
      value: "612",
      note: "+8% vs. mês anterior (demonstrativo)",
    },
    {
      icon: PieChart,
      label: "Convênio × particular",
      value: `${Math.round((planCount / active.length) * 100)}% / ${Math.round(((active.length - planCount) / active.length) * 100)}%`,
      note: `${planCount} de ${active.length} atendimentos de hoje pelo plano`,
    },
    {
      icon: DoorOpen,
      label: "Ocupação das salas",
      value: `${occupancy}%`,
      note: "status atual das salas",
    },
    {
      icon: Users,
      label: "Particular previsto hoje",
      value: brl(privateRevenue),
      note: "soma dos atendimentos particulares",
    },
  ];

  return (
    <>
      <PageTitle title="Dashboard executivo" sub="Visão geral da clínica" />

      {days <= 7 ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-destructive p-5 text-destructive-foreground">
          <AlertTriangle />
          <p className="font-semibold">
            Atenção: o prazo de envio das planilhas dos convênios se encerra em {days} dia
            {days === 1 ? "" : "s"}.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-accent p-5 text-accent-foreground">
          <AlertTriangle />
          <p className="font-semibold">Próximo fechamento de convênios em {days} dias (dia 25).</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-card p-6 shadow-soft">
            <card.icon className="text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{card.label}</p>
            <p className="font-display text-3xl">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-6">
          <h2 className="font-display text-xl">Atendimentos de hoje por serviço</h2>
          <div className="mt-4 space-y-3">
            {byService.map((row) => (
              <div key={row.service.id}>
                <div className="flex justify-between text-sm">
                  <span>{row.service.name}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(row.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6">
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl">Pendências de convênio</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Atendimentos de hoje sem guia de autorização registrada.
          </p>
          <p className="mt-4 font-display text-4xl">{missingAuthorization}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A recepção deve conferir encaminhamento médico e guia antes do check-in.
          </p>
          <div className="mt-4 space-y-2">
            {active
              .filter(
                (appointment) => appointment.plan !== "Particular" && !appointment.authorization,
              )
              .slice(0, 4)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    {appointment.time} · {appointment.patient}
                  </span>
                  <Badge variant="pending">{serviceById(appointment.serviceId).short}</Badge>
                </div>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
