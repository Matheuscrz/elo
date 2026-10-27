import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageTitle } from "@/components/page-title";
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
import { Switch } from "@/components/ui/switch";
import { buildSlots, PROFESSIONALS, ROOMS, serviceById } from "@/lib/clinic";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/escalas")({
  head: () =>
    pageMeta(
      "Escalas da equipe",
      "Configuração demonstrativa de dias, turnos e salas dos profissionais.",
    ),
  component: Schedules,
});

const WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

function Schedules() {
  const [professionalId, setProfessionalId] = useState(PROFESSIONALS[0]!.id);
  const professional = PROFESSIONALS.find((item) => item.id === professionalId)!;
  const [interval, setInterval] = useState(professional.interval);
  const [days, setDays] = useState(() =>
    Object.fromEntries(
      ORDER.map((day) => [
        day,
        {
          on: professional.days.includes(day),
          t1: professional.shifts[0] ?? { start: "08:00", end: "12:00" },
          t2: professional.shifts[1] ?? { start: "", end: "" },
          roomId: professional.roomId,
        },
      ]),
    ),
  );

  const pick = (id: string) => {
    const next = PROFESSIONALS.find((item) => item.id === id)!;
    setProfessionalId(id);
    setInterval(next.interval);
    setDays(
      Object.fromEntries(
        ORDER.map((day) => [
          day,
          {
            on: next.days.includes(day),
            t1: next.shifts[0] ?? { start: "08:00", end: "12:00" },
            t2: next.shifts[1] ?? { start: "", end: "" },
            roomId: next.roomId,
          },
        ]),
      ),
    );
  };

  const update = (day: number, patch: Partial<(typeof days)[number]>) =>
    setDays({ ...days, [day]: { ...days[day]!, ...patch } });

  return (
    <>
      <PageTitle
        title="Escalas e disponibilidade"
        sub="Configuração que alimenta a agenda da recepção e o agendamento online"
      >
        <Button onClick={() => toast.success(`Escala de ${professional.name} salva`)}>
          Salvar escala
        </Button>
      </PageTitle>

      <div className="mb-6 grid gap-4 rounded-2xl bg-card p-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Profissional</Label>
          <Select value={professionalId} onValueChange={pick}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONALS.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} — {serviceById(item.serviceId).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Intervalo entre atendimentos (min)</Label>
          <Input
            type="number"
            min={10}
            step={5}
            value={interval}
            onChange={(event) => setInterval(Number(event.target.value) || 40)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {ORDER.map((day) => {
          const config = days[day]!;
          const slots = config.on
            ? buildSlots(
                [config.t1, config.t2].filter((shift) => shift.start && shift.end),
                interval,
              ).length
            : 0;
          return (
            <div
              key={day}
              className="grid items-center gap-4 rounded-2xl bg-card p-4 lg:grid-cols-[140px_1fr_1fr_220px_80px]"
            >
              <label className="flex items-center gap-3 font-semibold">
                <Switch checked={config.on} onCheckedChange={(on) => update(day, { on })} />
                {WEEK[day]}
              </label>
              {(["t1", "t2"] as const).map((shift, index) => (
                <div key={shift} className="flex items-center gap-2 text-sm">
                  <span className="w-14 text-muted-foreground">Turno {index + 1}</span>
                  <Input
                    type="time"
                    disabled={!config.on}
                    value={config[shift].start}
                    onChange={(event) =>
                      update(day, { [shift]: { ...config[shift], start: event.target.value } })
                    }
                  />
                  <span>–</span>
                  <Input
                    type="time"
                    disabled={!config.on}
                    value={config[shift].end}
                    onChange={(event) =>
                      update(day, { [shift]: { ...config[shift], end: event.target.value } })
                    }
                  />
                </div>
              ))}
              <Select
                disabled={!config.on}
                value={config.roomId}
                onValueChange={(roomId) => update(day, { roomId })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-right text-sm text-muted-foreground">{slots} vagas</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Cada profissional atende com duração fixa por serviço. As vagas calculadas são o que aparece
        no agendamento online.
      </p>
    </>
  );
}
