import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  Circle,
  Link2,
  MessageCircle,
  Send,
  Settings2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/painel/whatsapp")({
  head: () => pageMeta("Central WhatsApp", "Triagem, distribuição e acompanhamento das conversas."),
  component: WhatsApp,
});

type Sector = "Recepção" | "Agendamento" | "Financeiro" | "Pós-atendimento";
type Conversation = {
  id: string;
  name: string;
  phone: string;
  sector: Sector;
  preview: string;
  time: string;
  unread: number;
  priority: "Normal" | "Urgente";
  messages: { from: "contact" | "team"; text: string; time: string }[];
};

const SECTORS: Sector[] = ["Recepção", "Agendamento", "Financeiro", "Pós-atendimento"];
const SEED: Conversation[] = [
  {
    id: "c1",
    name: "Juliana Andrade",
    phone: "(21) 99812-4401",
    sector: "Agendamento",
    preview: "Gostaria de confirmar a avaliação do Pedro.",
    time: "08:42",
    unread: 2,
    priority: "Normal",
    messages: [
      {
        from: "contact",
        text: "Bom dia! Gostaria de confirmar a avaliação do Pedro.",
        time: "08:41",
      },
      { from: "contact", text: "Pode me informar quais documentos preciso levar?", time: "08:42" },
    ],
  },
  {
    id: "c2",
    name: "Marcos Vinícius",
    phone: "(21) 99701-2210",
    sector: "Financeiro",
    preview: "Não localizei o boleto deste mês.",
    time: "08:31",
    unread: 1,
    priority: "Urgente",
    messages: [{ from: "contact", text: "Não localizei o boleto deste mês.", time: "08:31" }],
  },
  {
    id: "c3",
    name: "Camila Nogueira",
    phone: "(21) 99621-0392",
    sector: "Recepção",
    preview: "Chegamos para o atendimento.",
    time: "08:05",
    unread: 0,
    priority: "Normal",
    messages: [
      { from: "contact", text: "Chegamos para o atendimento.", time: "08:05" },
      { from: "team", text: "Olá, Camila! Já vamos chamar vocês.", time: "08:06" },
    ],
  },
  {
    id: "c4",
    name: "Rafael Souza",
    phone: "(21) 99110-8002",
    sector: "Pós-atendimento",
    preview: "Como acesso o plano terapêutico?",
    time: "Ontem",
    unread: 0,
    priority: "Normal",
    messages: [{ from: "contact", text: "Como acesso o plano terapêutico?", time: "Ontem" }],
  },
];

function WhatsApp() {
  const { perfil = "admin" } = useSearch({ from: "/painel" });
  const allowedSectors = useMemo<Sector[]>(
    () => (perfil === "recepcao" ? ["Recepção", "Agendamento"] : SECTORS),
    [perfil],
  );
  const [conversations, setConversations] = useState(SEED);
  const [selectedId, setSelectedId] = useState(SEED[0].id);
  const [sector, setSector] = useState<"Todos" | Sector>("Todos");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const selected =
    conversations.find((item) => item.id === selectedId && allowedSectors.includes(item.sector)) ??
    conversations.find((item) => allowedSectors.includes(item.sector)) ??
    conversations[0];
  const visible = useMemo(
    () =>
      conversations.filter(
        (item) =>
          allowedSectors.includes(item.sector) &&
          (sector === "Todos" || item.sector === sector) &&
          `${item.name} ${item.phone}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    [allowedSectors, conversations, search, sector],
  );

  const updateConversation = (patch: Partial<Conversation>) =>
    setConversations((items) =>
      items.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)),
    );

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    updateConversation({
      preview: text,
      time: "agora",
      messages: [...selected.messages, { from: "team", text, time: "agora" }],
    });
    setDraft("");
    toast.success("Mensagem enviada na demonstração");
  };

  return (
    <>
      <PageTitle
        title="Central WhatsApp"
        sub={
          perfil === "recepcao"
            ? "Fila da recepção: novos clientes e agendamentos"
            : "Triagem por setor, histórico e distribuição da equipe"
        }
      >
        <Button
          variant={connected ? "outline" : "default"}
          onClick={() => setConnected((value) => !value)}
        >
          <Link2 /> {connected ? "WhatsApp conectado" : "Conectar WhatsApp"}
        </Button>
      </PageTitle>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Conversas abertas</p>
          <p className="mt-1 text-2xl font-semibold">
            {conversations.filter((item) => allowedSectors.includes(item.sector)).length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Aguardando resposta</p>
          <p className="mt-1 text-2xl font-semibold">
            {
              conversations.filter(
                (item) => allowedSectors.includes(item.sector) && item.unread > 0,
              ).length
            }
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Canal</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <Circle
              className={cn(
                "h-3 w-3 fill-current",
                connected ? "text-emerald-500" : "text-amber-500",
              )}
            />
            {connected ? "Conectado" : "Modo demonstração"}
          </p>
        </div>
      </div>

      <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[300px_1fr_240px]">
        <section className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-4">
            <Label htmlFor="search">Conversas</Label>
            <Input
              id="search"
              className="mt-2"
              placeholder="Buscar nome ou telefone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
              {(["Todos", ...allowedSectors] as const).map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={sector === item ? "default" : "outline"}
                  className="shrink-0 rounded-full"
                  onClick={() => setSector(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {visible.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "w-full p-4 text-left hover:bg-muted/50",
                  item.id === selected.id && "bg-muted",
                )}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{item.preview}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant={item.priority === "Urgente" ? "destructive" : "outline"}>
                    {item.sector}
                  </Badge>
                  {item.unread > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="flex min-h-[560px] flex-col">
          <header className="flex items-center justify-between border-b border-border p-4">
            <div>
              <p className="font-semibold">{selected.name}</p>
              <p className="text-sm text-muted-foreground">{selected.phone}</p>
            </div>
            <Badge variant="outline">
              <MessageCircle /> WhatsApp
            </Badge>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
            {selected.messages.map((message, index) => (
              <div
                key={`${message.time}-${index}`}
                className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-sm",
                  message.from === "team"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-card",
                )}
              >
                <p>{message.text}</p>
                <p
                  className={cn(
                    "mt-1 flex items-center justify-end gap-1 text-[11px]",
                    message.from === "team"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {message.time} {message.from === "team" && <CheckCheck className="h-3 w-3" />}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Digite uma resposta..."
                className="min-h-12 resize-none"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
              />
              <Button
                size="icon"
                className="h-12 w-12 shrink-0"
                onClick={send}
                aria-label="Enviar mensagem"
              >
                <Send />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter envia · Shift+Enter quebra linha
            </p>
          </div>
        </section>

        <aside className="border-t border-border p-4 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <h2 className="font-semibold">Organização</h2>
          </div>
          <div className="mt-5 grid gap-2">
            <Label>Setor responsável</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={selected.sector}
              onChange={(event) => updateConversation({ sector: event.target.value as Sector })}
            >
              {allowedSectors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="mt-5 grid gap-2">
            <Label>Prioridade</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={selected.priority}
              onChange={(event) =>
                updateConversation({ priority: event.target.value as Conversation["priority"] })
              }
            >
              <option>Normal</option>
              <option>Urgente</option>
            </select>
          </div>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => {
              updateConversation({ unread: 0 });
              toast.success("Conversa marcada como lida");
            }}
          >
            <Check /> Marcar como lida
          </Button>
          <Button variant="ghost" className="mt-2 w-full">
            <Settings2 /> Configurar setor
          </Button>
          <p className="mt-6 text-xs text-muted-foreground">
            {perfil === "recepcao"
              ? "Seu perfil tem acesso apenas às filas de recepção e agendamento. Outras conversas ficam restritas à gestão."
              : "A conexão oficial requer credenciais da API do WhatsApp Business e webhook no backend. Este protótipo não envia mensagens reais."}
          </p>
        </aside>
      </div>
    </>
  );
}
