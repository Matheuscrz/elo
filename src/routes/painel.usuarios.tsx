import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Minus, Pencil, Plus, Search, UserCheck, UserX } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, Metric } from "@/components/management";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/usuarios")({
  head: () =>
    pageMeta(
      "Usuários e permissões",
      "Quem pode acessar o painel, com qual perfil e em qual situação.",
    ),
  component: Users,
});

type AccessRole = "recepcao" | "gestor" | "contador" | "admin";
type UserStatus = "Ativo" | "Inativo";

type User = {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
  status: UserStatus;
  lastAccess: string;
};

const ROLE_LABEL: Record<AccessRole, string> = {
  recepcao: "Recepção",
  gestor: "Gestor",
  contador: "Contador",
  admin: "Administrador",
};

const ROLE_HINT: Record<AccessRole, string> = {
  recepcao: "Operação do dia a dia: agenda, valores, salas, escalas e dashboard.",
  gestor: "Gerencia acessos, audita os módulos e corrige informações.",
  contador: "Faturamento, repasses, conciliação e fechamento contábil.",
  admin: "Acesso irrestrito ao sistema e às configurações.",
};

const INITIAL_USERS: User[] = [
  {
    id: "u1",
    name: "Luciana Prado",
    email: "luciana@elosaudeintegrada.com.br",
    role: "recepcao",
    status: "Ativo",
    lastAccess: "Hoje, 08:12",
  },
  {
    id: "u2",
    name: "Camila Andrade",
    email: "camila@elosaudeintegrada.com.br",
    role: "recepcao",
    status: "Ativo",
    lastAccess: "Ontem, 17:40",
  },
  {
    id: "u3",
    name: "Marcos Vieira",
    email: "marcos@elosaudeintegrada.com.br",
    role: "gestor",
    status: "Ativo",
    lastAccess: "Hoje, 07:55",
  },
  {
    id: "u4",
    name: "Ana Paula Lima",
    email: "ana@elosaudeintegrada.com.br",
    role: "contador",
    status: "Ativo",
    lastAccess: "22/10, 16:30",
  },
  {
    id: "u5",
    name: "Matheus Lacerda",
    email: "matheus@elosaudeintegrada.com.br",
    role: "admin",
    status: "Ativo",
    lastAccess: "Hoje, 09:05",
  },
  {
    id: "u6",
    name: "Rafaela Souza",
    email: "rafaela@elosaudeintegrada.com.br",
    role: "recepcao",
    status: "Inativo",
    lastAccess: "12/09, 18:20",
  },
];

const MATRIX: {
  module: string;
  roles: Record<AccessRole, boolean>;
}[] = [
  {
    module: "Agenda, check-in e valores",
    roles: { recepcao: true, gestor: true, contador: false, admin: true },
  },
  {
    module: "Salas, cadastros e escalas",
    roles: { recepcao: true, gestor: true, contador: false, admin: true },
  },
  {
    module: "Contratos e repasses",
    roles: { recepcao: false, gestor: true, contador: true, admin: true },
  },
  {
    module: "Contabilidade e fechamento",
    roles: { recepcao: false, gestor: false, contador: true, admin: true },
  },
  {
    module: "Usuários e permissões",
    roles: { recepcao: false, gestor: true, contador: false, admin: true },
  },
];

type UserForm = { name: string; email: string; role: AccessRole; status: UserStatus };

const EMPTY_FORM: UserForm = {
  name: "",
  email: "",
  role: "recepcao",
  status: "Ativo",
};

function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<User>();

  const filtered = users.filter((user) =>
    `${user.name} ${user.email} ${ROLE_LABEL[user.role]}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const active = users.filter((user) => user.status === "Ativo").length;

  function openCreate() {
    setForm(EMPTY_FORM);
    setCreating(true);
  }

  function openEdit(user: User) {
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditing(user);
  }

  function saveUser() {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setUsers(
        users.map((user) =>
          user.id === editing.id
            ? { ...user, ...form, name: form.name.trim(), email: form.email.trim() }
            : user,
        ),
      );
      setEditing(undefined);
      toast.success("Acesso atualizado nesta sessão");
      return;
    }
    setUsers([
      ...users,
      {
        id: crypto.randomUUID(),
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        lastAccess: "Nunca acessou",
      },
    ]);
    setCreating(false);
    toast.success("Novo acesso criado nesta sessão");
  }

  function toggleStatus(user: User) {
    const next: UserStatus = user.status === "Ativo" ? "Inativo" : "Ativo";
    setUsers(users.map((item) => (item.id === user.id ? { ...item, status: next } : item)));
    toast.success(
      next === "Ativo" ? `Acesso de ${user.name} reativado` : `Acesso de ${user.name} desativado`,
    );
  }

  return (
    <>
      <PageTitle
        title="Usuários e permissões"
        sub="Controle quem entra no painel e qual perfil cada pessoa usa"
      >
        <Button onClick={openCreate}>
          <Plus /> Novo acesso
        </Button>
      </PageTitle>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Acessos cadastrados" value={String(users.length)} note="Equipe ELO" />
        <Metric label="Acessos ativos" value={String(active)} note="Podem entrar no painel" />
        <Metric
          label="Bloqueados"
          value={String(users.length - active)}
          note="Sem acesso até reativação"
        />
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          aria-label="Buscar usuários"
          className="pl-9"
          placeholder="Buscar por nome, e-mail ou perfil"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <DataTable
        headers={["Nome", "E-mail", "Perfil", "Situação", "Último acesso", "Ações"]}
        rows={filtered.map((user) => [
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_HINT[user.role]}</p>
          </div>,
          <span className="text-muted-foreground">{user.email}</span>,
          <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>,
          <Badge variant={user.status === "Ativo" ? "done" : "canceled"}>{user.status}</Badge>,
          <span className="text-muted-foreground">{user.lastAccess}</span>,
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Editar acesso de ${user.name}`}
              title="Editar acesso"
              onClick={() => openEdit(user)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={user.status === "Ativo" ? "text-destructive" : "text-primary"}
              aria-label={
                user.status === "Ativo"
                  ? `Desativar acesso de ${user.name}`
                  : `Reativar acesso de ${user.name}`
              }
              title={user.status === "Ativo" ? "Desativar acesso" : "Reativar acesso"}
              onClick={() => toggleStatus(user)}
            >
              {user.status === "Ativo" ? <UserX /> : <UserCheck />}
            </Button>
          </div>,
        ])}
      />

      <section className="mt-10">
        <h2 className="font-display text-2xl">Matriz de permissões</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Referência rápida do que cada perfil acessa no painel. A recepção concentra a operação
          diária; o gestor cuida dos acessos e da conferência.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Módulo</th>
                {(Object.keys(ROLE_LABEL) as AccessRole[]).map((role) => (
                  <th
                    key={role}
                    className="px-4 py-3 text-center font-medium text-muted-foreground"
                  >
                    {ROLE_LABEL[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.module} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{row.module}</td>
                  {(Object.keys(ROLE_LABEL) as AccessRole[]).map((role) => (
                    <td key={role} className="px-4 py-3 text-center">
                      {row.roles[role] ? (
                        <Check className="mx-auto h-4 w-4 text-primary" aria-label="Permitido" />
                      ) : (
                        <Minus
                          className="mx-auto h-4 w-4 text-muted-foreground/50"
                          aria-label="Sem acesso"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Demonstração: os usuários e permissões são fictícios, não há senha real e as alterações
          valem apenas nesta sessão. O gestor mantém acesso de conferência aos módulos operacionais;
          a rotina diária é da recepção.
        </p>
      </section>

      <Dialog
        open={creating || !!editing}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar acesso" : "Novo acesso"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Ajuste o perfil ou bloqueie o acesso desta pessoa."
                : "Cadastre quem pode entrar no painel e com qual perfil."}{" "}
              Demonstração.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveUser();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="user-name">Nome completo</Label>
              <Input
                id="user-name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="user-email">E-mail de acesso</Label>
              <Input
                id="user-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="nome@elosaudeintegrada.com.br"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Perfil</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value as AccessRole })}
              >
                <SelectTrigger aria-label="Perfil de acesso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABEL) as AccessRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABEL[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{ROLE_HINT[form.role]}</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Situação</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value as UserStatus })}
              >
                <SelectTrigger aria-label="Situação do acesso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Ativo", "Inativo"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreating(false);
                  setEditing(undefined);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">{editing ? "Salvar alterações" : "Criar acesso"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
