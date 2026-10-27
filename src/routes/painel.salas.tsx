import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, PowerOff, RotateCcw } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { brl, RENTS, ROOMS, roomById, serviceById, type Room } from "@/lib/clinic";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/salas")({
  head: () =>
    pageMeta(
      "Salas e locação",
      "Situação das salas, cadastro, desativação e pagamentos demonstrativos de locação.",
    ),
  component: Rooms,
});

const ROOM_TYPES = [
  "Sala terapêutica",
  "Consultório",
  "Sala de integração sensorial",
  "Sala de psicomotricidade",
  "Sala de musicoterapia",
  "Recepção",
  "Administrativo",
];

type RoomForm = {
  name: string;
  type: string;
  equipment: string;
  status: Exclude<Room["status"], "Inativa">;
};

const EMPTY_FORM: RoomForm = {
  name: "",
  type: ROOM_TYPES[0]!,
  equipment: "",
  status: "Livre",
};

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [rents, setRents] = useState(RENTS);
  const [form, setForm] = useState<RoomForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Room>();
  const [deactivating, setDeactivating] = useState<Room>();
  const [reason, setReason] = useState("");

  const active = rooms.filter((room) => room.status !== "Inativa");
  const occupied = rooms.filter((room) => room.status === "Ocupada").length;
  const inactive = rooms.length - active.length;

  function openCreate() {
    setForm(EMPTY_FORM);
    setCreating(true);
  }

  function openEdit(room: Room) {
    setForm({
      name: room.name,
      type: room.type,
      equipment: room.equipment,
      status: room.status === "Inativa" ? "Manutenção" : room.status,
    });
    setEditing(room);
  }

  function saveRoom() {
    const name = form.name.trim();
    if (!name) return;
    if (editing) {
      setRooms(
        rooms.map((room) =>
          room.id === editing.id
            ? {
                ...room,
                ...form,
                name,
                who: form.status === "Ocupada" ? room.who : "—",
              }
            : room,
        ),
      );
      setEditing(undefined);
      toast.success("Sala atualizada nesta sessão");
      return;
    }
    setRooms([
      ...rooms,
      {
        id: crypto.randomUUID(),
        ...form,
        name,
        who: "—",
      },
    ]);
    setCreating(false);
    toast.success("Sala cadastrada nesta sessão");
  }

  function deactivateRoom() {
    if (!deactivating || reason.trim().length < 3) return;
    setRooms(
      rooms.map((room) =>
        room.id === deactivating.id
          ? {
              ...room,
              status: "Inativa",
              who: "—",
              deactivationReason: reason.trim(),
            }
          : room,
      ),
    );
    setDeactivating(undefined);
    setReason("");
    toast.success("Sala desativada. Ela não aparece mais como disponível.");
  }

  function reactivateRoom(room: Room) {
    setRooms(
      rooms.map((item) => {
        if (item.id !== room.id) return item;
        const next: Room = { ...item, status: "Livre", who: "—" };
        delete next.deactivationReason;
        return next;
      }),
    );
    toast.success("Sala reativada e disponível para agendamentos.");
  }

  return (
    <>
      <PageTitle
        title="Salas e locação"
        sub={`${occupied} ocupadas · ${active.length} ativas · ${inactive} inativas`}
      >
        <Button onClick={openCreate}>
          <Plus /> Nova sala
        </Button>
      </PageTitle>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={cn(
              "flex flex-col rounded-2xl border-l-4 bg-card p-5",
              room.status === "Livre"
                ? "border-status-done"
                : room.status === "Ocupada"
                  ? "border-primary"
                  : room.status === "Manutenção"
                    ? "border-accent"
                    : "border-destructive",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{room.name}</p>
              <Badge
                variant={
                  room.status === "Livre"
                    ? "done"
                    : room.status === "Ocupada"
                      ? "default"
                      : room.status === "Manutenção"
                        ? "pending"
                        : "canceled"
                }
              >
                {room.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{room.type}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {room.status === "Inativa" ? "Desativada pela recepção" : `Turno atual: ${room.who}`}
            </p>
            {room.equipment && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{room.equipment}</p>
            )}
            {room.status === "Inativa" && room.deactivationReason && (
              <p className="mt-2 rounded-lg bg-muted p-2 text-xs text-muted-foreground">
                Motivo: {room.deactivationReason}
              </p>
            )}
            <div className="mt-auto flex flex-wrap gap-1 border-t border-border/60 pt-3">
              <Button variant="ghost" size="sm" onClick={() => openEdit(room)}>
                <Pencil /> Editar
              </Button>
              {room.status === "Inativa" ? (
                <Button variant="ghost" size="sm" onClick={() => reactivateRoom(room)}>
                  <RotateCcw /> Reativar
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    setDeactivating(room);
                    setReason("");
                  }}
                >
                  <PowerOff /> Desativar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-display text-2xl">Contas a receber</h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {["Profissional", "Serviço", "Sala", "Modo", "Valor", "Vencimento", "Status", ""].map(
                (header) => (
                  <TableHead key={header}>{header}</TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rents.map((rent) => (
              <TableRow key={rent.id}>
                <TableCell className="font-medium">{rent.professional}</TableCell>
                <TableCell>{serviceById(rent.serviceId).name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {roomById(rent.roomId).name}
                </TableCell>
                <TableCell>{rent.mode}</TableCell>
                <TableCell>{brl(rent.value)}</TableCell>
                <TableCell>{rent.due}</TableCell>
                <TableCell>
                  <Badge variant={rent.paid ? "done" : "pending"}>
                    {rent.paid ? "Pago" : "Aguardando"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={rent.paid}
                    onClick={() => {
                      setRents(
                        rents.map((item) => (item.id === rent.id ? { ...item, paid: true } : item)),
                      );
                      toast.success("Baixa registrada");
                    }}
                  >
                    Dar baixa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Contratos por turno fixo, mensalidade integral ou avulso/hora. Multas e juros são calculados
        na emissão da fatura. Cadastros e desativações valem apenas nesta sessão de demonstração.
      </p>

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
            <DialogTitle>{editing ? "Editar sala" : "Nova sala"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Altere os dados e a situação do espaço."
                : "Cadastre um novo espaço para a operação da clínica."}{" "}
              Dados demonstrativos.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveRoom();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="room-name">Nome da sala</Label>
              <Input
                id="room-name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ex.: Sala 08 · Consultório"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Tipo de estrutura</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger aria-label="Tipo de estrutura">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="room-equipment">Equipamentos e estrutura</Label>
              <Input
                id="room-equipment"
                value={form.equipment}
                onChange={(event) => setForm({ ...form, equipment: event.target.value })}
                placeholder="Ex.: tatame, espelho, maca"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Situação</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value as RoomForm["status"] })}
              >
                <SelectTrigger aria-label="Situação da sala">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Livre", "Ocupada", "Manutenção"].map((status) => (
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
              <Button type="submit">{editing ? "Salvar alterações" : "Cadastrar sala"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deactivating}
        onOpenChange={(open) => {
          if (!open) {
            setDeactivating(undefined);
            setReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar {deactivating?.name}?</DialogTitle>
            <DialogDescription>
              A sala deixa de aparecer como disponível para novos agendamentos. O histórico e a
              possibilidade de reativar são mantidos.
            </DialogDescription>
          </DialogHeader>
          {deactivating?.status === "Ocupada" && (
            <p className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs">
              Atenção: há atendimento no turno atual. Confirme a realocação antes de desativar.
            </p>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="deactivation-reason">Motivo da desativação</Label>
            <Input
              id="deactivation-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ex.: manutenção elétrica, troca de piso, sala interditada"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivating(undefined)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={reason.trim().length < 3}
              onClick={deactivateRoom}
            >
              <PowerOff /> Desativar sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
