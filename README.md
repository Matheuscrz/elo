# ELO Saúde Integrada — protótipo de sistema de gestão e portal

Modelo navegável do sistema de gestão clínica e portal institucional da **ELO Saúde
Integrada** (Aracaju/SE), construído a partir da estrutura real do site
`elosaudeintegrada.com.br`: home, serviços, convênios, equipe, autismo e blog.

- **Análise do cliente, lacunas e ajustes de escopo:** [`docs/analise-elo-saude-integrada.md`](docs/analise-elo-saude-integrada.md)
- **Dados demonstrativos:** agenda, valores, contratos, salas e registros
  profissionais são fictícios. Nomes, convênios e serviços seguem o que a clínica
  divulga publicamente.

## O que está no protótipo

**Portal público (mobile-first)**

`/` · `/servicos` · `/convenios` · `/equipe` · `/autismo` · `/blog` ·
`/blog/:slug` · `/agendar` (wizard) · `/minhas-consultas`

**Painel interno (desktop-first, com perfis demonstrativos)**

`/painel` (agenda e check-in) · `/painel/faturamento` · `/painel/gestor` ·
`/painel/salas` · `/painel/escalas` · `/painel/contratos` · `/painel/cadastros` ·
`/painel/repasses` · `/painel/contabilidade`

Regras já modeladas: encaminhamento médico obrigatório para convênio, carteirinha e
guia no check-in, cancelamento até 24h, fechamento de convênios no dia 25, sessão
semanal recorrente, locação de salas e repasse por profissional.

## Stack

React 19 + TanStack Start/Router, Tailwind CSS 4, shadcn/ui, Vitest.

## Development

Need Node.js and npm.

```sh
npm i
npm run dev      # http://localhost:8080
npm run build
npm test
npm run lint
```

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0356fea2-fbcc-4422-9049-4b095d107a57).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.
