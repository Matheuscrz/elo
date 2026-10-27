import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice, DataTable, Metric } from "@/components/management";
import { brl, RENTS, roomById, serviceById } from "@/lib/clinic";
import { PRODUCTION } from "@/lib/production";
import { downloadCsv } from "@/lib/csv";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/contabilidade")({
  head: () =>
    pageMeta("Contabilidade", "Conferência financeira, conciliação e exportações da clínica."),
  component: Accounting,
});

function Accounting() {
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState("DRE simplificado");

  const gross = PRODUCTION.reduce((sum, row) => sum + row.gross, 0);
  const retained = PRODUCTION.reduce((sum, row) => sum + row.retained, 0);
  const discrepancy = PRODUCTION.reduce((sum, row) => sum + row.gross - row.received, 0);
  const rentReceived = RENTS.filter((rent) => rent.paid).reduce((sum, rent) => sum + rent.value, 0);
  const rentOpen = RENTS.filter((rent) => !rent.paid).reduce((sum, rent) => sum + rent.value, 0);

  const reports: Record<string, (string | number)[][]> = {
    "DRE simplificado": [
      ["Categoria", "Valor demonstrativo"],
      ["Faturamento bruto de convênios e particular", gross],
      ["Receita de locação recebida", rentReceived],
      ["Receita total", gross + rentReceived],
      ["Retenções da clínica", retained],
      ["Repasses previstos aos profissionais", gross - retained],
      ["Locações em aberto", rentOpen],
      ["Diferença a conciliar", discrepancy],
    ],
    "Extrato de repasse por profissional PJ": [
      ["Profissional", "Convênio", "Bruto", "Retenção", "Repasse"],
      ...PRODUCTION.map((row) => [
        row.professional,
        row.plan,
        row.gross,
        row.retained,
        row.gross - row.retained,
      ]),
    ],
    "Livro caixa": [
      ["Descrição", "Entrada demonstrativa"],
      ...PRODUCTION.map((row) => [`${row.professional} / ${row.plan}`, row.received]),
      ...RENTS.filter((rent) => rent.paid).map((rent) => [
        `Locação · ${rent.professional} · ${roomById(rent.roomId).name}`,
        rent.value,
      ]),
    ],
    "Conciliação de locação e encargos": [
      ["Profissional", "Sala", "Vencimento", "Valor", "Situação"],
      ...RENTS.map((rent) => [
        rent.professional,
        roomById(rent.roomId).name,
        rent.due,
        rent.value,
        rent.paid ? "Recebido" : "Em aberto",
      ]),
    ],
  };

  return (
    <>
      <PageTitle title="Contabilidade" sub="Auditoria, conciliação e fechamento mensal" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Produção bruta" value={brl(gross)} />
        <Metric label="Retenções da clínica" value={brl(retained)} />
        <Metric label="Repasses previstos" value={brl(gross - retained)} />
        <Metric label="Diferença a conciliar" value={brl(discrepancy)} />
      </div>

      <Tabs defaultValue="conferencia">
        <TabsList className="mb-6 flex h-auto w-fit max-w-full flex-wrap">
          <TabsTrigger value="conferencia">Convênios e repasses</TabsTrigger>
          <TabsTrigger value="locacao">Locação e encargos</TabsTrigger>
          <TabsTrigger value="fechamento">Fechamento</TabsTrigger>
          <TabsTrigger value="exportacoes">Exportações</TabsTrigger>
        </TabsList>

        <TabsContent value="conferencia">
          <DataTable
            headers={[
              "Profissional / convênio",
              "Faturado",
              "Recebido",
              "Diferença",
              "Conferência",
            ]}
            rows={PRODUCTION.map((row) => [
              <div>
                <p className="font-medium">{row.professional}</p>
                <p className="text-xs text-muted-foreground">{row.plan}</p>
              </div>,
              brl(row.gross),
              brl(row.received),
              <span
                className={
                  row.gross !== row.received
                    ? "font-semibold text-destructive"
                    : "text-muted-foreground"
                }
              >
                {brl(row.gross - row.received)}
              </span>,
              reviewed.includes(row.id) ? (
                <Badge variant="done">Conferido</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewed([...reviewed, row.id])}
                >
                  <CheckCircle2 /> Marcar conferido
                </Button>
              ),
            ])}
          />
        </TabsContent>

        <TabsContent value="locacao">
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <Metric label="Locações recebidas" value={brl(rentReceived)} />
            <Metric label="Locações em aberto" value={brl(rentOpen)} />
            <Metric
              label="Encargos aplicados"
              value={brl(0)}
              note="Multas e juros calculados na emissão"
            />
          </div>
          <DataTable
            headers={["Profissional", "Sala", "Serviço", "Vencimento", "Valor", "Situação"]}
            rows={RENTS.map((rent) => [
              rent.professional,
              roomById(rent.roomId).name,
              serviceById(rent.serviceId).name,
              rent.due,
              brl(rent.value),
              <Badge variant={rent.paid ? "done" : "pending"}>
                {rent.paid ? "Recebido" : "Em aberto"}
              </Badge>,
            ])}
          />
        </TabsContent>

        <TabsContent value="fechamento">
          <section className="max-w-2xl space-y-6">
            <h2 className="text-xl font-semibold">Prévia de fechamento</h2>
            <div className="flex gap-3 border-l-4 border-accent bg-accent/10 p-4">
              <AlertTriangle className="shrink-0 text-accent" />
              <p className="text-sm">
                Fechamento demonstrativo. Nenhum período real será encerrado ou bloqueado nesta
                versão.
              </p>
            </div>
            <dl className="divide-y divide-border">
              <div className="flex justify-between py-4">
                <dt>Produções conferidas</dt>
                <dd>
                  {reviewed.length} de {PRODUCTION.length}
                </dd>
              </div>
              <div className="flex justify-between py-4">
                <dt>Diferenças pendentes</dt>
                <dd className="font-semibold text-destructive">{brl(discrepancy)}</dd>
              </div>
              <div className="flex justify-between py-4">
                <dt>Repasses previstos</dt>
                <dd>{brl(gross - retained)}</dd>
              </div>
              <div className="flex justify-between py-4">
                <dt>Locações em aberto</dt>
                <dd>{brl(rentOpen)}</dd>
              </div>
            </dl>
            <Button onClick={() => setConfirm(true)}>
              <LockKeyhole /> Revisar fechamento
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="exportacoes">
          <section className="grid max-w-xl gap-5">
            <h2 className="text-xl font-semibold">Central de relatórios</h2>
            <Choice
              label="Relatório"
              value={report}
              onChange={setReport}
              options={Object.keys(reports)}
            />
            <Button
              onClick={() => downloadCsv("relatorio-contabil-demonstracao", reports[report] ?? [])}
            >
              <Download /> Exportar CSV
            </Button>
            <p className="text-xs text-muted-foreground">
              Estrutura demonstrativa para integração contábil. Layouts oficiais (NFSe, livro caixa)
              devem ser validados com o contador da clínica.
            </p>
          </section>
        </TabsContent>
      </Tabs>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resumo da conferência</DialogTitle>
            <DialogDescription>
              Prévia demonstrativa, sem bloqueio de registros reais.
            </DialogDescription>
          </DialogHeader>
          <p>
            {reviewed.length} produções conferidas. Diferença a conciliar:{" "}
            <strong>{brl(discrepancy)}</strong>. Locações em aberto:{" "}
            <strong>{brl(rentOpen)}</strong>.
          </p>
          <Button
            onClick={() => {
              setConfirm(false);
              toast.info("Resumo conferido. O fechamento real ainda não está ativado.");
            }}
          >
            Concluir revisão
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
