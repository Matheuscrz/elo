import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Choice, DataTable, Metric } from "@/components/management";
import { brl } from "@/lib/clinic";
import { PRODUCTION } from "@/lib/production";
import { downloadCsv } from "@/lib/csv";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/repasses")({
  head: () =>
    pageMeta("Produção e repasses", "Espelho demonstrativo de produção e retenções da clínica."),
  component: Production,
});

function Production() {
  const [professional, setProfessional] = useState("Todos os profissionais");
  const [plan, setPlan] = useState("Todos os planos");

  const rows = PRODUCTION.filter(
    (row) =>
      (professional === "Todos os profissionais" || row.professional === professional) &&
      (plan === "Todos os planos" || row.plan === plan),
  );
  const gross = rows.reduce((sum, row) => sum + row.gross, 0);
  const retained = rows.reduce((sum, row) => sum + row.retained, 0);

  return (
    <>
      <PageTitle
        title="Produção e repasses"
        sub="Espelho demonstrativo por profissional e convênio"
      >
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv("producao-demonstracao", [
              ["Profissional", "Plano", "Atendimentos", "Bruto", "Retenção", "Líquido"],
              ...rows.map((row) => [
                row.professional,
                row.plan,
                row.count,
                row.gross,
                row.retained,
                row.gross - row.retained,
              ]),
            ])
          }
        >
          <Download /> Exportar espelho
        </Button>
      </PageTitle>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Produção bruta" value={brl(gross)} />
        <Metric label="Retenção da clínica" value={brl(retained)} />
        <Metric label="Líquido dos profissionais" value={brl(gross - retained)} />
      </div>

      <div className="mb-4 grid max-w-3xl gap-4 sm:grid-cols-2">
        <Choice
          label="Profissional"
          value={professional}
          onChange={setProfessional}
          options={["Todos os profissionais", ...PRODUCTION.map((row) => row.professional)]}
        />
        <Choice
          label="Convênio / atendimento"
          value={plan}
          onChange={setPlan}
          options={["Todos os planos", ...new Set(PRODUCTION.map((row) => row.plan))]}
        />
      </div>

      <DataTable
        headers={[
          "Profissional",
          "Convênio",
          "Atendimentos",
          "Valor bruto",
          "Retenção",
          "Valor líquido",
        ]}
        rows={rows.map((row) => [
          row.professional,
          row.plan,
          row.count,
          brl(row.gross),
          brl(row.retained),
          <span className="font-semibold text-primary">{brl(row.gross - row.retained)}</span>,
        ])}
      />
      <p className="mt-3 text-xs text-muted-foreground">
        A matriz de repasse permite retenção fixa em R$ ou percentual por profissional e por
        procedimento.
      </p>
    </>
  );
}
