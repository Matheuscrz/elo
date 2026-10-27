import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  MapPin,
  MessageCircle,
  Repeat,
  Search,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CANCEL_MIN_HOURS,
  buildSlots,
  canCancel,
  isValidCpfShape,
  maskCpf,
  professionalById,
  roomById,
  serviceById,
  waLink,
} from "@/lib/clinic";

export const Route = createFileRoute("/minhas-consultas")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Minhas consultas — ELO Saúde Integrada" },
      {
        name: "description",
        content: "Consulte seus atendimentos pelo CPF, reagende ou cancele na ELO.",
      },
      { property: "og:title", content: "Minhas consultas — ELO Saúde Integrada" },
      { property: "og:description", content: "Área do paciente da ELO Saúde Integrada." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Patient,
});

const inHours = (hours: number) => {
  const date = new Date(Date.now() + hours * 3600_000);
  date.setMinutes(0, 0, 0);
  return date;
};

const at = (days: number, hours: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date;
};

type Session = { id: string; date: Date; professionalId: string; plan: string; recurring: boolean };

const DEMO_PATIENT = { name: "Camila Andrade", cpf: "52998224725" };

const INITIAL: Session[] = [
  { id: "c1", date: inHours(6), professionalId: "p01", plan: "Saúde Petrobras", recurring: true },
  { id: "c2", date: at(6, 10), professionalId: "p08", plan: "SulAmérica", recurring: true },
  { id: "c3", date: at(20, 14), professionalId: "p20", plan: "Particular", recurring: false },
];

const maskedCpf = (digits: string) => `•••.•••.${digits.slice(6, 9)}-${digits.slice(9)}`;

function Patient() {
  const [cpf, setCpf] = useState("");
  const [patient, setPatient] = useState<typeof DEMO_PATIENT>();
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState(INITIAL);
  const [editing, setEditing] = useState<string>();
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState<string>();
  const [canceling, setCanceling] = useState<string>();
  const current = list.find((session) => session.id === editing);
  const cancelCurrent = list.find((session) => session.id === canceling);
  const currentProfessional = current ? professionalById(current.professionalId) : undefined;
  const cancelProfessional = cancelCurrent
    ? professionalById(cancelCurrent.professionalId)
    : undefined;

  const slots =
    currentProfessional && newDate
      ? buildSlots(currentProfessional.shifts, currentProfessional.interval).filter((time) => {
          const [hours, minutes] = time.split(":").map(Number) as [number, number];
          const candidate = new Date(newDate);
          candidate.setHours(hours, minutes, 0, 0);
          return candidate > new Date();
        })
      : [];

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setSearched(true);
    if (!isValidCpfShape(cpf)) {
      setError("Informe um CPF com 11 dígitos para consultar.");
      setPatient(undefined);
      return;
    }
    setError("");
    if (cpf.replace(/\D/g, "") !== DEMO_PATIENT.cpf) {
      setPatient(undefined);
      return;
    }
    setPatient(DEMO_PATIENT);
  }

  function resetSearch() {
    setPatient(undefined);
    setSearched(false);
    setError("");
    setCpf("");
  }

  function openReschedule(session: Session) {
    setEditing(session.id);
    setNewDate(undefined);
    setNewTime(undefined);
  }

  function confirmReschedule() {
    if (!editing || !newDate || !newTime) return;
    const [hours, minutes] = newTime.split(":").map(Number) as [number, number];
    const next = new Date(newDate);
    next.setHours(hours, minutes, 0, 0);
    setList(list.map((item) => (item.id === editing ? { ...item, date: next } : item)));
    setEditing(undefined);
    toast.success(`Atendimento reagendado para ${format(next, "dd/MM 'às' HH:mm")}`);
  }

  function confirmCancel() {
    if (!canceling) return;
    setList(list.filter((item) => item.id !== canceling));
    setCanceling(undefined);
    toast.success("Atendimento cancelado. A recepção foi avisada.");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10">
        {!patient ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Área do paciente
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">
              Consulte seus atendimentos pelo CPF
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Veja data, profissional e sala, e reagende ou cancele sem precisar ligar. Para
              localizar a agenda, informe o CPF do paciente.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <Label htmlFor="cpf">CPF do paciente</Label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(event) => setCpf(maskCpf(event.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={!!error}
                  aria-describedby={error ? "cpf-error" : undefined}
                />
                <Button type="submit" className="rounded-full">
                  <Search /> Consultar
                </Button>
              </div>
              {error && (
                <p id="cpf-error" className="mt-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Seus dados são usados apenas para localizar a agenda. Ambiente demonstrativo:{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline underline-offset-2"
                  onClick={() => {
                    setCpf(maskCpf(DEMO_PATIENT.cpf));
                    setError("");
                  }}
                >
                  use o CPF 529.982.247-25
                </button>{" "}
                para testar.
              </p>
            </form>

            {searched && !patient && !error && (
              <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-5 w-5 text-accent" /> Nenhum atendimento encontrado
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confira o CPF informado. Se preferir, fale com a recepção para localizar o
                  cadastro pelo nome ou telefone.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="rounded-full">
                    <a
                      href={waLink("Olá! Não encontrei meus atendimentos pelo CPF no site.")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle /> Falar com a recepção
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/agendar">Agendar atendimento</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" /> Regras de reagendamento e
                cancelamento
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <li>• O cancelamento online é permitido até {CANCEL_MIN_HOURS} horas antes.</li>
                <li>
                  • Depois desse prazo, fale com a recepção pelo WhatsApp para avaliar a remarcação.
                </li>
                <li>
                  • O reagendamento respeita os dias e horários de atendimento do profissional.
                </li>
                <li>• A confirmação é imediata, mas a recepção pode entrar em contato.</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Olá, {patient.name.split(" ")[0]}</p>
                <h1 className="font-display text-3xl">Meus atendimentos</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  CPF {maskedCpf(patient.cpf)} · dados de demonstração
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" onClick={resetSearch}>
                <ArrowLeft /> Consultar outro CPF
              </Button>
            </div>

            <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
              Os atendimentos abaixo são fictícios e ficam apenas nesta sessão do navegador.
            </p>

            <div className="mt-5 space-y-4">
              {list.map((session) => {
                const professional = professionalById(session.professionalId);
                const service = serviceById(professional.serviceId);
                const room = roomById(professional.roomId);
                const ok = canCancel(session.date);
                return (
                  <article
                    key={session.id}
                    className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft sm:flex-row sm:items-center"
                  >
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <span className="text-xl font-bold leading-none">
                        {format(session.date, "dd")}
                      </span>
                      <span className="text-xs uppercase">
                        {format(session.date, "MMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-accent">{professional.name}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" />
                          {format(session.date, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {room.name}
                        </span>
                        {session.recurring && (
                          <span className="flex items-center gap-1">
                            <Repeat className="h-3.5 w-3.5" /> sessão semanal
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cobertura: {session.plan}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openReschedule(session)}
                      >
                        Reagendar
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full text-destructive"
                                disabled={!ok}
                                onClick={() => setCanceling(session.id)}
                              >
                                Cancelar
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!ok && (
                            <TooltipContent className="max-w-56">
                              Cancelamento online só até {CANCEL_MIN_HOURS}h antes. Fale com a
                              recepção pelo WhatsApp.
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </article>
                );
              })}

              {list.length === 0 && (
                <div className="rounded-2xl bg-card p-8 text-center">
                  <p className="font-semibold">Nenhum atendimento futuro.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Você pode agendar um novo atendimento quando precisar.
                  </p>
                  <Button asChild className="mt-4 rounded-full">
                    <Link to="/agendar">Agendar atendimento</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-5 text-sm">
              <p className="text-muted-foreground">
                Precisa de ajuda com um atendimento ou convênio?
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={waLink("Olá! Preciso de ajuda com um atendimento agendado.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Falar com a recepção
                </a>
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(undefined)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reagendar atendimento</DialogTitle>
            <DialogDescription>
              {currentProfessional?.name} ·{" "}
              {current ? serviceById(professionalById(current.professionalId).serviceId).name : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              locale={ptBR}
              selected={newDate}
              onSelect={(value) => {
                setNewDate(value);
                setNewTime(undefined);
              }}
              disabled={(value) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value < today || !currentProfessional?.days.includes(value.getDay());
              }}
            />
          </div>
          {newDate ? (
            <div>
              <p className="text-sm font-medium">Horários disponíveis</p>
              {slots.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {slots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setNewTime(time)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        newTime === time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/60"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Não há horários livres neste dia. Escolha outra data.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Escolha um dia de atendimento do profissional.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(undefined)}>
              Voltar
            </Button>
            <Button disabled={!newDate || !newTime} onClick={confirmReschedule}>
              <Check /> Confirmar novo horário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!canceling} onOpenChange={(open) => !open && setCanceling(undefined)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar este atendimento?</DialogTitle>
            <DialogDescription>
              {cancelCurrent && cancelProfessional
                ? `${serviceById(cancelProfessional.serviceId).name} com ${cancelProfessional.name} em ${format(cancelCurrent.date, "dd/MM 'às' HH:mm")}.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            A vaga será liberada para outros pacientes. Se precisar, você pode agendar novamente
            pelo site.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCanceling(undefined)}>
              Manter atendimento
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
