import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice, DataTable, Field } from "@/components/management";
import { PLAN_NAMES, PLANS, PROFESSIONALS, ROOMS, SERVICES, serviceById } from "@/lib/clinic";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/cadastros")({
  head: () => pageMeta("Cadastros", "Profissionais, salas, convênios e procedimentos da clínica."),
  component: Registries,
});

type Entry = { id: string; values: string[] };

const schemas = {
  profissionais: {
    title: "Profissionais",
    fields: ["Nome", "Serviço", "Registro profissional", "Modelo de contrato"],
    choices: { 1: SERVICES.map((service) => service.name), 3: ["Locação", "Porcentagem"] },
    rows: PROFESSIONALS.map((item) => ({
      id: item.id,
      values: [item.name, serviceById(item.serviceId).name, item.reg, item.contract],
    })),
  },
  salas: {
    title: "Salas",
    fields: ["Nome", "Tipo de estrutura", "Equipamentos", "Status"],
    choices: { 3: ["Livre", "Ocupada", "Manutenção", "Inativa"] },
    rows: ROOMS.map((room) => ({
      id: room.id,
      values: [room.name, room.type, room.equipment, room.status],
    })),
  },
  convenios: {
    title: "Convênios",
    fields: ["Nome", "Código da operadora", "Fechamento", "Situação"],
    choices: { 3: ["Ativo", "Em análise", "Inativo"] },
    rows: PLANS.map((plan) => ({
      id: plan.id,
      values: [plan.name, plan.code, `Dia ${plan.closingDay}`, "Ativo"],
    })),
  },
  procedimentos: {
    title: "Procedimentos",
    fields: ["Procedimento", "Plano", "Código", "Valor de tabela (R$)"],
    choices: { 1: ["Particular", ...PLAN_NAMES] },
    rows: SERVICES.map((service, index) => ({
      id: `proc${index + 1}`,
      values: [
        service.name,
        "Particular",
        `${service.id.toUpperCase()}-001`,
        String([180, 180, 200, 200, 220, 180, 180, 180, 950][index] ?? 180),
      ],
    })),
  },
};

type Kind = keyof typeof schemas;

function Registries() {
  const [kind, setKind] = useState<Kind>("profissionais");
  const [entries, setEntries] = useState<Record<Kind, Entry[]>>({
    profissionais: schemas.profissionais.rows,
    salas: schemas.salas.rows,
    convenios: schemas.convenios.rows,
    procedimentos: schemas.procedimentos.rows,
  });
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Entry>();
  const [deleting, setDeleting] = useState<Entry>();

  const schema = schemas[kind];
  const options = schema.choices as Partial<Record<number, string[]>>;
  const rows = entries[kind].filter((row) =>
    row.values.join(" ").toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")),
  );

  return (
    <>
      <PageTitle title="Cadastros" sub="Base da operação: equipe, salas, convênios e tabelas">
        <Button
          onClick={() =>
            setEditing({
              id: "",
              values: schema.fields.map((_, index) => options[index]?.[0] ?? ""),
            })
          }
        >
          <Plus /> Novo cadastro
        </Button>
      </PageTitle>

      <Tabs
        value={kind}
        onValueChange={(value) => {
          setKind(value as Kind);
          setSearch("");
        }}
      >
        <TabsList className="mb-6 flex h-auto w-fit max-w-full flex-wrap">
          {Object.entries(schemas).map(([key, item]) => (
            <TabsTrigger key={key} value={key}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          aria-label="Buscar cadastros"
          className="pl-9"
          placeholder={`Buscar ${schema.title.toLowerCase()}`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <DataTable
        headers={[...schema.fields, "Ações"]}
        rows={rows.map((row) => [
          ...row.values,
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Editar ${row.values[0]}`}
              title="Editar"
              onClick={() => setEditing({ ...row, values: [...row.values] })}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              aria-label={`Excluir ${row.values[0]}`}
              title="Excluir"
              onClick={() => setDeleting(row)}
            >
              <Trash2 />
            </Button>
          </div>,
        ])}
      />
      <p className="mt-3 text-xs text-muted-foreground">
        {rows.length} registros · dados demonstrativos
      </p>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(undefined)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar cadastro" : "Novo cadastro"}</DialogTitle>
            <DialogDescription>{schema.title} · dados demonstrativos</DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                const saved = { ...editing, id: editing.id || crypto.randomUUID() };
                setEntries({
                  ...entries,
                  [kind]: editing.id
                    ? entries[kind].map((row) => (row.id === editing.id ? saved : row))
                    : [...entries[kind], saved],
                });
                setEditing(undefined);
                toast.success("Cadastro atualizado nesta sessão");
              }}
            >
              {schema.fields.map((label, index) =>
                options[index] ? (
                  <Choice
                    key={label}
                    label={label}
                    value={editing.values[index] ?? ""}
                    options={options[index] ?? []}
                    onChange={(value) =>
                      setEditing({
                        ...editing,
                        values: editing.values.map((item, position) =>
                          position === index ? value : item,
                        ),
                      })
                    }
                  />
                ) : (
                  <Field
                    key={label}
                    label={label}
                    required
                    value={editing.values[index] ?? ""}
                    onChange={(value) =>
                      setEditing({
                        ...editing,
                        values: editing.values.map((item, position) =>
                          position === index ? value : item,
                        ),
                      })
                    }
                  />
                ),
              )}
              <Button type="submit">Salvar cadastro</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cadastro?</DialogTitle>
            <DialogDescription>
              {deleting?.values[0]} será removido desta demonstração.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(undefined)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setEntries({
                  ...entries,
                  [kind]: entries[kind].filter((row) => row.id !== deleting?.id),
                });
                setDeleting(undefined);
              }}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
