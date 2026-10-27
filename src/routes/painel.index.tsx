import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Eye, LogIn, Pencil, Repeat } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  brl,
  PLAN_NAMES,
  PROFESSIONALS,
  professionalById,
  professionalsByService,
  roomById,
  ROOMS,
  SERVICES,
  serviceById,
  STATUS_LABEL,
  TODAY,
  type Appointment,
  type Status,
} from "@/lib/clinic";

export const Route = createFileRoute("/painel/")({
  head: () => pageMeta("Agenda do dia", "Agenda diária, confirmação e check-in dos pacientes."),
  component: Agenda,
});

function Agenda() {
  const [rows, setRows] = useState(TODAY);
  const [professional, setProfessional] = useState("all");
  const [room, setRoom] = useState("all");
  const [status, setStatus] = useState("all");
  const [day, setDay] = useState("hoje");
  const [checkin, setCheckin] = useState<Appointment>();
  const [method, setMethod] = useState<string>();
  const [card, setCard] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [paidValue, setPaidValue] = useState("");
  const [details, setDetails] = useState<Appointment>();
  const [creating, setCreating] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Appointment>();
  const [priceValue, setPriceValue] = useState("");

  const shown = rows
    .filter(
      (row) =>
        (professional === "all" || row.professionalId === professional) &&
        (room === "all" || row.roomId === room) &&
        (status === "all" || row.status === status),
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const finishCheckin = (id: string, message: string, price?: number) => {
    setRows(
      rows.map((row) =>
        row.id === id
          ? { ...row, status: "waiting", ...(price !== undefined ? { price } : {}) }
          : row,
      ),
    );
    setCheckin(undefined);
    setMethod(undefined);
    setCard("");
    setAuthorization("");
    setPaidValue("");
    toast.success(message);
  };

  return (
    <>
      <PageTitle
        title="Agenda do dia"
        sub={`${shown.length} atendimentos · ${day === "hoje" ? "hoje" : "amanhã"}`}
      >
        <div className="flex flex-wrap gap-2">
          <ToggleGroup
            type="single"
            value={day}
            onValueChange={(value) => value && setDay(value)}
            variant="outline"
          >
            <ToggleGroupItem value="hoje">Hoje</ToggleGroupItem>
            <ToggleGroupItem value="amanha">Amanhã</ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={() => setCreating(true)}>
            <CalendarPlus /> Novo agendamento
          </Button>
        </div>
      </PageTitle>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Filter
          value={professional}
          onChange={setProfessional}
          placeholder="Todos os profissionais"
          items={PROFESSIONALS.map((item) => [
            item.id,
            `${item.name} · ${serviceById(item.serviceId).short}`,
          ])}
        />
        <Filter
          value={room}
          onChange={setRoom}
          placeholder="Todas as salas"
          items={ROOMS.map((item) => [item.id, item.name])}
        />
        <Filter
          value={status}
          onChange={setStatus}
          placeholder="Todos os status"
          items={Object.entries(STATUS_LABEL)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Hora",
                "Paciente",
                "Profissional",
                "Sala",
                "Serviço",
                "Convênio / tipo",
                "Valor",
                "Status",
                "",
              ].map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold tabular-nums">{row.time}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    {row.patient}
                    {row.recurring && (
                      <Repeat
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-label="sessão semanal"
                      />
                    )}
                  </span>
                </TableCell>
                <TableCell>{professionalById(row.professionalId).name}</TableCell>
                <TableCell className="max-w-40 truncate text-muted-foreground">
                  {roomById(row.roomId).name}
                </TableCell>
                <TableCell>{serviceById(row.serviceId).name}</TableCell>
                <TableCell>
                  <span className="block">{row.plan}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="tabular-nums">
                      {row.price > 0 ? brl(row.price) : "Tabela"}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      aria-label={`Editar valor de ${row.patient}`}
                      title="Editar valor"
                      onClick={() => {
                        setEditingPrice(row);
                        setPriceValue(row.price.toFixed(2).replace(".", ","));
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge s={row.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      disabled={!["pending", "confirmed"].includes(row.status)}
                      onClick={() => {
                        setCheckin(row);
                        setMethod(undefined);
                        setCard(row.card ?? "");
                        setAuthorization(row.authorization ?? "");
                        setPaidValue(row.price.toFixed(2).replace(".", ","));
                      }}
                    >
                      <LogIn /> Check-in
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Detalhes de ${row.patient}`}
                      onClick={() => setDetails(row)}
                    >
                      <Eye />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {shown.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  Nenhum atendimento com esses filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!details} onOpenChange={(open) => !open && setDetails(undefined)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do atendimento</SheetTitle>
          </SheetHeader>
          {details && (
            <dl className="grid gap-5 p-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Paciente</dt>
                <dd className="font-semibold">
                  {details.patient}{" "}
                  {details.recurring && <Badge variant="secondary">sessão semanal</Badge>}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Profissional</dt>
                <dd>{professionalById(details.professionalId).name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Serviço</dt>
                <dd>{serviceById(details.serviceId).name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Horário / sala</dt>
                <dd>
                  {details.time} · {roomById(details.roomId).name}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Cobertura</dt>
                <dd>{details.plan}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Valor do atendimento</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  {details.price > 0 ? brl(details.price) : "Cobrança pela tabela do convênio"}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPrice(details);
                      setPriceValue(details.price.toFixed(2).replace(".", ","));
                      setDetails(undefined);
                    }}
                  >
                    <Pencil /> Editar valor
                  </Button>
                </dd>
              </div>
              {details.card && (
                <div>
                  <dt className="text-muted-foreground">Carteirinha</dt>
                  <dd>{details.card}</dd>
                </div>
              )}
              {details.authorization && (
                <div>
                  <dt className="text-muted-foreground">Guia de autorização</dt>
                  <dd>{details.authorization}</dd>
                </div>
              )}
              <div>
                <dt className="mb-2 text-muted-foreground">Situação</dt>
                <dd>
                  <StatusBadge s={details.status} />
                </dd>
              </div>
            </dl>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!checkin} onOpenChange={(open) => !open && setCheckin(undefined)}>
        <SheetContent className="overflow-y-auto">
          {checkin && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Check-in</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-1 rounded-xl bg-muted p-4 text-sm">
                <p className="text-base font-semibold">{checkin.patient}</p>
                <p>
                  {checkin.time} · {professionalById(checkin.professionalId).name}
                </p>
                <p className="text-muted-foreground">
                  {serviceById(checkin.serviceId).name} · {roomById(checkin.roomId).name}
                </p>
                <p className="text-muted-foreground">
                  {checkin.plan}
                  {checkin.price > 0 && ` · ${brl(checkin.price)}`}
                </p>
              </div>

              {checkin.plan === "Particular" ? (
                <div className="mt-6 grid gap-4 px-1">
                  <div className="grid gap-1.5">
                    <Label>Valor pago</Label>
                    <Input
                      value={paidValue}
                      inputMode="decimal"
                      onChange={(event) => setPaidValue(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Método</Label>
                    <Select value={method ?? ""} onValueChange={setMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Pix", "Dinheiro", "Cartão de crédito", "Cartão de débito"].map(
                          (item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    disabled={!method}
                    onClick={() =>
                      finishCheckin(
                        checkin.id,
                        "Pagamento registrado — paciente liberado",
                        parsePrice(paidValue),
                      )
                    }
                  >
                    Confirmar pagamento e liberar paciente
                  </Button>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 px-1">
                  <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs">
                    Atendimento por convênio exige encaminhamento médico. Confira a guia quando o
                    procedimento pedir autorização.
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Número da carteirinha</Label>
                    <Input
                      value={card}
                      onChange={(event) => setCard(event.target.value)}
                      placeholder="Obrigatório"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Guia de autorização (opcional)</Label>
                    <Input
                      value={authorization}
                      onChange={(event) => setAuthorization(event.target.value)}
                    />
                  </div>
                  <Button
                    disabled={card.replace(/\D/g, "").length < 6}
                    onClick={() =>
                      finishCheckin(
                        checkin.id,
                        `Atendimento registrado · ${checkin.plan}${card ? ` · carteirinha ${card}` : ""}`,
                      )
                    }
                  >
                    Registrar atendimento
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      <NewAppointment
        open={creating}
        onOpenChange={setCreating}
        onCreate={(appointment) => {
          setRows([...rows, appointment]);
          setCreating(false);
          toast.success("Agendamento criado nesta sessão");
        }}
      />

      <Dialog open={!!editingPrice} onOpenChange={(open) => !open && setEditingPrice(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar valor do atendimento</DialogTitle>
            <DialogDescription>
              {editingPrice
                ? `${editingPrice.patient} · ${serviceById(editingPrice.serviceId).name} · ${editingPrice.plan}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editingPrice) return;
              const value = parsePrice(priceValue);
              setRows(
                rows.map((row) => (row.id === editingPrice.id ? { ...row, price: value } : row)),
              );
              setEditingPrice(undefined);
              toast.success(`Valor atualizado para ${brl(value)}`);
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="appointment-price">Valor (R$)</Label>
              <Input
                id="appointment-price"
                inputMode="decimal"
                value={priceValue}
                onChange={(event) => setPriceValue(event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Para convênio, informe o valor de tabela negociado. O faturamento continua vinculado
                à guia de autorização.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPrice(undefined)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar valor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function StatusBadge({ s }: { s: Status }) {
  return <Badge variant={s}>{STATUS_LABEL[s]}</Badge>;
}

function parsePrice(value: string) {
  const normalized = value.includes(",") ? value.replace(/\./g, "").replace(",", ".") : value;
  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function Filter({
  value,
  onChange,
  placeholder,
  items,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  items: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {items.map(([itemValue, label]) => (
          <SelectItem key={itemValue} value={itemValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function NewAppointment({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (appointment: Appointment) => void;
}) {
  const [patient, setPatient] = useState("");
  const [serviceId, setServiceId] = useState(SERVICES[0]!.id);
  const [professionalId, setProfessionalId] = useState(
    professionalsByService(SERVICES[0]!.id)[0]?.id ?? "",
  );
  const [plan, setPlan] = useState("Particular");
  const [time, setTime] = useState("08:00");
  const [price, setPrice] = useState("180");
  const professionals = professionalsByService(serviceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo agendamento</DialogTitle>
          <DialogDescription>
            Demonstração · o registro existe apenas nesta sessão.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!patient.trim() || !professionalId) return;
            onCreate({
              id: crypto.randomUUID(),
              time,
              patient: patient.trim(),
              professionalId,
              roomId: professionalById(professionalId).roomId,
              serviceId,
              plan,
              status: "pending",
              price: plan === "Particular" ? parsePrice(price) : 0,
            });
            setPatient("");
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="patient">Paciente</Label>
            <Input
              id="patient"
              required
              value={patient}
              onChange={(event) => setPatient(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Serviço</Label>
            <Select
              value={serviceId}
              onValueChange={(value) => {
                setServiceId(value);
                setProfessionalId(professionalsByService(value)[0]?.id ?? "");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Profissional</Label>
            <Select value={professionalId} onValueChange={setProfessionalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Cobertura</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Particular", ...PLAN_NAMES].map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
          {plan === "Particular" && (
            <div className="grid gap-1.5">
              <Label htmlFor="new-price">Valor (R$)</Label>
              <Input
                id="new-price"
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                A recepção pode ajustar o valor depois, na agenda do dia.
              </p>
            </div>
          )}
          <Button type="submit">Criar agendamento</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
