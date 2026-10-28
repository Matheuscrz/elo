import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice, DataTable, Field, Metric } from "@/components/management";
import {
  calculateAppointmentFinancials,
  PLAN_NAMES,
  PRICING_RULES,
  SERVICES,
  serviceById,
  brl,
  type PricingRule,
} from "@/lib/clinic";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/planos")({
  head: () =>
    pageMeta("Planos e valores", "Regras de cobrança, autorização e repasse por procedimento."),
  component: Plans,
});

function Plans() {
  const [rows, setRows] = useState<PricingRule[]>(PRICING_RULES);
  const [plan, setPlan] = useState("Todos os planos");
  const [editing, setEditing] = useState<PricingRule>();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const filtered = useMemo(
    () => rows.filter((row) => plan === "Todos os planos" || row.plan === plan),
    [plan, rows],
  );
  const total = filtered.reduce((sum, row) => sum + row.amount, 0);
  const avgClinic = filtered.length
    ? filtered.reduce(
        (sum, row) =>
          sum + calculateAppointmentFinancials(row.amount, row.professionalShare).clinic,
        0,
      ) / filtered.length
    : 0;
  const update = (key: keyof PricingRule, value: string | number | boolean) =>
    editing && setEditing({ ...editing, [key]: value });

  return (
    <>
      <PageTitle
        title="Planos e valores"
        sub="Tabela de cobrança, autorização e repasse por procedimento"
      >
        <Button
          onClick={() => {
            setEditing({
              plan: "Particular",
              serviceId: SERVICES[0].id,
              amount: 0,
              professionalShare: 70,
              requiresAuthorization: false,
            });
            setEditingIndex(null);
          }}
        >
          <Plus /> Nova regra
        </Button>
      </PageTitle>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Regras cadastradas"
          value={String(filtered.length)}
          note="Valores desta sessão"
        />
        <Metric
          label="Valor médio de tabela"
          value={brl(filtered.length ? total / filtered.length : 0)}
        />
        <Metric
          label="Retenção média da clínica"
          value={brl(avgClinic)}
          note="Após repasse profissional"
        />
      </div>
      <div className="mb-4 max-w-sm">
        <Choice
          label="Filtrar por plano"
          value={plan}
          onChange={setPlan}
          options={["Todos os planos", ...PLAN_NAMES]}
        />
      </div>
      <DataTable
        headers={["Plano", "Procedimento", "Tabela", "Repasse", "Clínica", "Autorização", ""]}
        rows={filtered.map((row) => {
          const values = calculateAppointmentFinancials(row.amount, row.professionalShare);
          return [
            row.plan,
            serviceById(row.serviceId).name,
            brl(row.amount),
            `${row.professionalShare}% · ${brl(values.professional)}`,
            brl(values.clinic),
            <Badge variant={row.requiresAuthorization ? "pending" : "outline"}>
              {row.requiresAuthorization ? "Obrigatória" : "Não exige"}
            </Badge>,
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Editar ${row.plan} - ${serviceById(row.serviceId).name}`}
              onClick={() => {
                setEditing({ ...row });
                setEditingIndex(rows.indexOf(row));
              }}
            >
              <Pencil />
            </Button>,
          ];
        })}
      />
      <p className="mt-3 text-xs text-muted-foreground">
        As regras são demonstrativas e ficam disponíveis apenas enquanto a sessão estiver aberta.
      </p>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(undefined);
            setEditingIndex(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex === null ? "Nova regra" : "Editar regra"}</DialogTitle>
            <DialogDescription>
              Atualize a regra usada no pré-cálculo do atendimento.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setRows(
                  editingIndex === null
                    ? [...rows, editing]
                    : rows.map((row, index) => (index === editingIndex ? editing : row)),
                );
                setEditing(undefined);
                setEditingIndex(null);
                toast.success("Regra salva nesta sessão");
              }}
            >
              <Choice
                label="Plano"
                value={editing.plan}
                onChange={(value) => update("plan", value)}
                options={["Particular", ...PLAN_NAMES]}
              />
              <Choice
                label="Procedimento"
                value={serviceById(editing.serviceId).name}
                onChange={(value) =>
                  update(
                    "serviceId",
                    SERVICES.find((item) => item.name === value)?.id ?? editing.serviceId,
                  )
                }
                options={SERVICES.map((item) => item.name)}
              />
              <Field
                label="Valor de tabela (R$)"
                type="number"
                required
                value={String(editing.amount)}
                onChange={(value) => update("amount", Number(value.replace(",", ".")) || 0)}
              />
              <Field
                label="Repasse profissional (%)"
                type="number"
                required
                value={String(editing.professionalShare)}
                onChange={(value) =>
                  update("professionalShare", Number(value.replace(",", ".")) || 0)
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.requiresAuthorization}
                  onChange={(event) => update("requiresAuthorization", event.target.checked)}
                />{" "}
                Exige autorização antes do atendimento
              </label>
              <Button type="submit">
                <Save /> Salvar regra
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
