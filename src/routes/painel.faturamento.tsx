import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlarmClock, Download } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BILLING_DEADLINE_DAY,
  daysUntilBillingDeadline,
  PLAN_NAMES,
  planByName,
  professionalById,
  serviceById,
  TODAY,
} from "@/lib/clinic";
import { downloadCsv } from "@/lib/csv";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/faturamento")({
  head: () =>
    pageMeta(
      "Faturamento de convênios",
      "Exportação demonstrativa de atendimentos por plano de saúde.",
    ),
  component: Billing,
});

function Billing() {
  const [plan, setPlan] = useState<string>();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const selected = plan ? planByName(plan) : undefined;
  const rows = TODAY.filter((appointment) => appointment.plan === plan);

  const exportCsv = () => {
    downloadCsv(`convenio-${selected?.id ?? "plano"}-${month}`, [
      [
        "Paciente",
        "Profissional",
        "Serviço",
        "Data/hora",
        "Carteirinha",
        "Guia de autorização",
        "Plano",
      ],
      ...rows.map((appointment) => [
        appointment.patient,
        professionalById(appointment.professionalId).name,
        serviceById(appointment.serviceId).name,
        appointment.time,
        appointment.card ?? "",
        appointment.authorization ?? "",
        appointment.plan,
      ]),
    ]);
    toast.success(`Planilha gerada (${rows.length} atendimentos)`);
  };

  return (
    <>
      <PageTitle title="Gerar relatório de convênios" sub="Fechamento mensal por operadora" />

      <div className="mb-6 flex items-start gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5">
        <AlarmClock className="mt-0.5 text-accent" />
        <div>
          <p className="font-semibold">Envio das guias até o dia {BILLING_DEADLINE_DAY}</p>
          <p className="text-sm text-muted-foreground">
            Faltam {daysUntilBillingDeadline()} dias para o fechamento deste mês.
          </p>
        </div>
      </div>

      <div className="grid max-w-xl gap-4 rounded-2xl bg-card p-6">
        <div className="grid gap-1.5">
          <Label>Plano de saúde</Label>
          <Select value={plan ?? ""} onValueChange={setPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {PLAN_NAMES.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Mês / ano</Label>
          <Input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </div>
        <Button size="lg" disabled={!plan} onClick={exportCsv}>
          <Download /> Gerar planilha (Excel/CSV)
        </Button>
        {selected && (
          <p className="text-xs text-muted-foreground">
            {rows.length} atendimentos de demonstração · {selected.name}. {selected.note}
          </p>
        )}
      </div>
    </>
  );
}
