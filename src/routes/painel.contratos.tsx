import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Pencil, Plus } from "lucide-react";
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
import { brl, PROFESSIONALS, roomById, ROOMS } from "@/lib/clinic";
import { pageMeta } from "@/lib/page-meta";
import { downloadCsv } from "@/lib/csv";

export const Route = createFileRoute("/painel/contratos")({
  head: () =>
    pageMeta("Contratos de locação", "Contratos, modalidades e condições de locação de salas."),
  component: Contracts,
});

type Contract = {
  id: string;
  professional: string;
  room: string;
  mode: string;
  value: string;
  due: string;
  grace: string;
  fine: string;
  interest: string;
  status: string;
};

const blank: Contract = {
  id: "",
  professional: PROFESSIONALS[0]?.name ?? "",
  room: ROOMS[0]?.name ?? "",
  mode: "Turno fixo",
  value: "",
  due: "5",
  grace: "0",
  fine: "0",
  interest: "0",
  status: "Ativo",
};

const SEED: [number, number, string, string][] = [
  [0, 1800, "05", "Ativo"],
  [3, 1600, "05", "Em renovação"],
  [7, 2100, "10", "Ativo"],
  [16, 1400, "10", "Inadimplente"],
];

function Contracts() {
  const [rows, setRows] = useState<Contract[]>(
    SEED.map(([index, value, due, status]) => {
      const professional = PROFESSIONALS[index]!;
      return {
        ...blank,
        id: professional.id,
        professional: professional.name,
        room: roomById(professional.roomId).name,
        mode: index === 16 ? "Avulso / hora" : "Turno fixo",
        value: String(value),
        due,
        fine: "2",
        interest: "0,033",
        status,
      };
    }),
  );
  const [edit, setEdit] = useState<Contract>();

  const update = (key: keyof Contract, value: string) => edit && setEdit({ ...edit, [key]: value });

  return (
    <>
      <PageTitle
        title="Contratos de locação"
        sub="Salas como ativos: modalidade, vigência e encargos"
      >
        <Button onClick={() => setEdit({ ...blank })}>
          <Plus /> Novo contrato
        </Button>
      </PageTitle>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Contratos ativos"
          value={String(rows.filter((row) => row.status === "Ativo").length)}
        />
        <Metric
          label="Em renovação"
          value={String(rows.filter((row) => row.status === "Em renovação").length)}
        />
        <Metric
          label="Valor base contratado"
          value={brl(
            rows
              .filter((row) => row.status !== "Encerrado")
              .reduce((sum, row) => sum + Number(row.value), 0),
          )}
          note="Valores demonstrativos"
        />
      </div>

      <DataTable
        headers={["Profissional", "Sala", "Modalidade", "Valor base", "Vencimento", "Situação", ""]}
        rows={rows.map((row) => [
          row.professional,
          row.room,
          row.mode,
          brl(Number(row.value)),
          `Dia ${row.due}`,
          <Badge
            variant={
              row.status === "Ativo"
                ? "done"
                : row.status === "Inadimplente"
                  ? "destructive"
                  : "pending"
            }
          >
            {row.status}
          </Badge>,
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Editar contrato de ${row.professional}`}
            onClick={() => setEdit({ ...row })}
          >
            <Pencil />
          </Button>,
        ])}
      />

      <Button
        className="mt-4"
        variant="outline"
        onClick={() =>
          downloadCsv("contratos-demonstracao", [
            ["Profissional", "Sala", "Modalidade", "Valor base", "Vencimento", "Situação"],
            ...rows.map((row) => [
              row.professional,
              row.room,
              row.mode,
              row.value,
              row.due,
              row.status,
            ]),
          ])
        }
      >
        <FileText /> Exportar contratos
      </Button>

      <Dialog open={!!edit} onOpenChange={(open) => !open && setEdit(undefined)}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Editar contrato" : "Novo contrato"}</DialogTitle>
            <DialogDescription>Condições contratuais · demonstração</DialogDescription>
          </DialogHeader>
          {edit && (
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                const saved = { ...edit, id: edit.id || crypto.randomUUID() };
                setRows(
                  edit.id
                    ? rows.map((row) => (row.id === edit.id ? saved : row))
                    : [...rows, saved],
                );
                setEdit(undefined);
                toast.success("Contrato atualizado nesta sessão");
              }}
            >
              <Choice
                label="Profissional"
                value={edit.professional}
                onChange={(value) => update("professional", value)}
                options={PROFESSIONALS.map((item) => item.name)}
              />
              <Choice
                label="Sala"
                value={edit.room}
                onChange={(value) => update("room", value)}
                options={ROOMS.map((room) => room.name)}
              />
              <Choice
                label="Modalidade"
                value={edit.mode}
                onChange={(value) => update("mode", value)}
                options={["Turno fixo", "Mensalidade integral", "Avulso / hora"]}
              />
              <Choice
                label="Situação"
                value={edit.status}
                onChange={(value) => update("status", value)}
                options={["Ativo", "Em renovação", "Inadimplente", "Encerrado"]}
              />
              {(
                [
                  ["value", "Valor base (R$)"],
                  ["due", "Dia de vencimento"],
                  ["grace", "Carência (dias)"],
                  ["fine", "Multa por atraso (%)"],
                  ["interest", "Juros diários (%)"],
                ] as const
              ).map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  type="number"
                  required
                  value={edit[key]}
                  onChange={(value) => update(key, value)}
                />
              ))}
              <div className="flex items-end sm:col-span-2">
                <Button type="submit">Salvar contrato</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
