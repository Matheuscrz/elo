import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarHeart, Check, ChevronLeft, Info, MessageCircle, PartyPopper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  buildSlots,
  CLINIC,
  PLAN_NAMES,
  PROFESSIONALS,
  REFERRAL_REQUIRED_FOR_PLANS,
  SERVICES,
  serviceById,
  waLink,
  type Professional,
  type Service,
} from "@/lib/clinic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agendar")({
  validateSearch: (search: Record<string, unknown>): { servico?: string } => {
    const value = search["servico"];
    return typeof value === "string" && SERVICES.some((service) => service.id === value)
      ? { servico: value }
      : {};
  },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Agendar atendimento — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Escolha serviço, profissional, convênio e horário e agende seu atendimento na ELO em Aracaju.",
      },
      { property: "og:title", content: "Agendar atendimento — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Agendamento online com disponibilidade real da equipe.",
      },
    ],
  }),
  component: Wizard,
});

const STEPS = ["Serviço", "Profissional", "Atendimento", "Data e hora", "Seus dados"];

function Wizard() {
  const { servico } = Route.useSearch();
  const [step, setStep] = useState(servico ? 1 : 0);
  const [serviceId, setServiceId] = useState<string | undefined>(servico);
  const [professionalId, setProfessionalId] = useState<string>();
  const [kind, setKind] = useState<"particular" | "plano">();
  const [plan, setPlan] = useState<string>();
  const [hasReferral, setHasReferral] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", cpf: "", birth: "", phone: "", email: "" });

  const service = serviceId ? serviceById(serviceId) : undefined;
  const professional = PROFESSIONALS.find((p) => p.id === professionalId);
  const slots = useMemo(
    () => (professional ? buildSlots(professional.shifts, professional.interval) : []),
    [professional],
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const requiresReferral = kind === "plano" && REFERRAL_REQUIRED_FOR_PLANS;
  const canNext = [
    !!service,
    !!professional,
    kind === "particular" || (kind === "plano" && !!plan && (!requiresReferral || hasReferral)),
    !!date && !!time,
    form.name.trim().length > 3 &&
      form.cpf.replace(/\D/g, "").length >= 11 &&
      !!form.birth &&
      form.phone.replace(/\D/g, "").length >= 10,
  ][step];

  const pickService = (value: string) => {
    setServiceId(value);
    setProfessionalId(undefined);
    setDate(undefined);
    setTime(undefined);
  };

  if (step === 5 && service && professional && date && time) {
    return (
      <div className="min-h-screen bg-hero">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PartyPopper />
            </span>
            <h1 className="mt-6 font-display text-3xl">Atendimento agendado!</h1>
            <p className="mt-3 text-muted-foreground">
              {form.name.split(" ")[0]}, seu atendimento de{" "}
              <b className="text-foreground">{service.name}</b> com{" "}
              <b className="text-foreground">{professional.name}</b> está marcado para{" "}
              <b className="text-foreground">
                {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })} às {time}
              </b>
              .
            </p>
          </div>
          <div className="mt-6 rounded-2xl bg-card p-5 text-sm">
            <p className="font-semibold">Orientações de chegada</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Chegue 15 minutos antes, com documento com foto.</li>
              <li>
                {kind === "plano"
                  ? `Traga a carteirinha do ${plan} e o encaminhamento médico.`
                  : "O pagamento é feito na recepção (Pix, cartão ou dinheiro)."}
              </li>
              {kind === "plano" && (
                <li>Se o procedimento exigir autorização, traga a guia emitida pela operadora.</li>
              )}
              <li>Endereço: {CLINIC.address}</li>
              <li>Você receberá um lembrete pelo WhatsApp um dia antes.</li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild className="rounded-full">
              <Link to="/minhas-consultas">Ver meus atendimentos</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a
                href={waLink(
                  "Olá! Acabei de agendar pelo site e gostaria de confirmar alguns detalhes.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> Falar com a recepção
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Agendamento online
          </p>
          <h1 className="mt-2 font-display text-3xl">Vamos encontrar o melhor horário</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Em caso de dúvida sobre qual serviço escolher,{" "}
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href={waLink()}
              target="_blank"
              rel="noreferrer"
            >
              fale com a equipe
            </a>{" "}
            antes de concluir.
          </p>
        </div>

        <ol className="mb-8 flex gap-2">
          {STEPS.map((label, index) => (
            <li key={label} className="flex-1">
              <div
                className={cn("h-1.5 rounded-full", index <= step ? "bg-primary" : "bg-muted")}
              />
              <p
                className={cn(
                  "mt-2 text-xs",
                  index === step ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-2xl">Qual atendimento você procura?</h2>
            <Input
              placeholder="Buscar por serviço ou necessidade (ex.: fala, seletividade)"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              aria-label="Buscar serviço"
            />
            {SERVICES.filter((item) =>
              (item.name + item.desc + item.tags.join(" ")).toLowerCase().includes(q.toLowerCase()),
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => pickService(item.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border bg-card p-4 text-left transition",
                  serviceId === item.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="flex-1">
                  <b className="block">{item.name}</b>
                  <span className="text-sm text-muted-foreground">
                    {item.tags.slice(0, 3).join(" · ")}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Sessão de {item.duration} min
                  </span>
                </span>
                {serviceId === item.id && <Check className="mt-1 text-primary" />}
              </button>
            ))}
          </div>
        )}

        {step === 1 && service && (
          <div className="space-y-3">
            <h2 className="font-display text-2xl">Com quem você quer atendimento?</h2>
            <p className="text-sm text-muted-foreground">
              Profissionais de {service.name}. A agenda exibida é demonstrativa.
            </p>
            {PROFESSIONALS.filter((item) => item.serviceId === service.id).map((item) => (
              <ProfessionalOption
                key={item.id}
                professional={item}
                selected={professionalId === item.id}
                onSelect={() => {
                  setProfessionalId(item.id);
                  setDate(undefined);
                  setTime(undefined);
                }}
              />
            ))}
            {PROFESSIONALS.filter((item) => item.serviceId === service.id).length === 0 && (
              <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Este serviço é realizado pela equipe interdisciplinar. Fale com a recepção para
                montar a avaliação.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-display text-2xl">Como será o atendimento?</h2>
            {(["particular", "plano"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setKind(value)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left",
                  kind === value ? "border-primary ring-2 ring-primary/30" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full border-2",
                    kind === value ? "border-[6px] border-primary" : "border-muted-foreground",
                  )}
                />
                <span>
                  <b className="block">
                    {value === "particular" ? "Particular" : "Plano de saúde"}
                  </b>
                  <span className="text-sm text-muted-foreground">
                    {value === "particular"
                      ? "Pagamento na recepção, sem necessidade de encaminhamento"
                      : "Saúde Petrobras, Saúde Caixa, Porto Saúde, SulAmérica e GEAP"}
                  </span>
                </span>
              </button>
            ))}

            {kind === "plano" && (
              <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <div className="grid gap-1.5">
                  <Label>Plano de saúde</Label>
                  <Select value={plan ?? ""} onValueChange={setPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
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
                <div className="flex items-start gap-3 rounded-xl bg-accent/10 p-3 text-sm">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p>
                    Atendimento por convênio exige <strong>encaminhamento médico</strong> para a
                    especialidade. Alguns procedimentos também pedem guia de autorização.
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox
                    checked={hasReferral}
                    onCheckedChange={(checked) => setHasReferral(checked === true)}
                    className="mt-0.5"
                  />
                  Tenho o encaminhamento médico e vou apresentá-lo na recepção
                </label>
              </div>
            )}
          </div>
        )}

        {step === 3 && professional && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl">Escolha o dia e horário</h2>
            <div className="flex justify-center rounded-2xl border border-border bg-card p-2">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={date}
                onSelect={(value) => {
                  setDate(value);
                  setTime(undefined);
                }}
                disabled={(value) => value < today || !professional.days.includes(value.getDay())}
              />
            </div>
            {date && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Horários de {professional.name} em {format(date, "dd/MM", { locale: ptBR })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot, index) => {
                    const taken = (date.getDate() + index) % 4 === 0;
                    return (
                      <button
                        key={slot}
                        disabled={taken}
                        onClick={() => setTime(slot)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm",
                          time === slot
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card",
                          taken && "cursor-not-allowed opacity-40 line-through",
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Intervalo de {professional.interval} minutos entre atendimentos ·{" "}
              {professional.shifts.map((shift) => `${shift.start}–${shift.end}`).join(" / ")}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4">
            <h2 className="font-display text-2xl">Seus dados</h2>
            <div className="rounded-xl bg-muted p-4 text-sm">
              <p className="font-semibold">{service?.name}</p>
              <p className="text-muted-foreground">
                {professional?.name} · {date && format(date, "dd/MM/yyyy")} às {time}
              </p>
              <p className="text-muted-foreground">{kind === "plano" ? plan : "Particular"}</p>
            </div>
            {(
              [
                ["name", "Nome completo do paciente", "text"],
                ["cpf", "CPF", "text"],
                ["birth", "Data de nascimento", "date"],
                ["phone", "Telefone / WhatsApp", "tel"],
                ["email", "E-mail", "email"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key} className="grid gap-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Protótipo demonstrativo: os dados não são enviados nem armazenados. Na versão final, o
              cadastro segue a LGPD e a política de retenção da clínica.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
            <ChevronLeft /> Voltar
          </Button>
          <Button
            className="rounded-full px-8"
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
          >
            {step === 4 ? (
              <>
                <CalendarHeart /> Confirmar agendamento
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfessionalOption({
  professional,
  selected,
  onSelect,
}: {
  professional: Professional;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-primary/50",
      )}
    >
      {professional.image ? (
        <img
          src={professional.image}
          alt={professional.name}
          width={48}
          height={60}
          loading="lazy"
          className="h-14 w-12 shrink-0 rounded-xl object-cover object-top"
        />
      ) : (
        <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary font-display text-primary">
          {professional.initials}
        </span>
      )}
      <span className="flex-1">
        <b className="block">{professional.name}</b>
        <span className="text-sm text-muted-foreground">
          {serviceById(professional.serviceId).name} · {professional.bio}
        </span>
      </span>
      {selected && <Check className="text-primary" />}
    </button>
  );
}
