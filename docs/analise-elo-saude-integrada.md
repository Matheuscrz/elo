# Análise — ELO Saúde Integrada × Sistema de gestão clínica

> Documento de apoio comercial e de descoberta. Baseado no site público
> `elosaudeintegrada.com.br` (consultado em outubro/2026) e no protótipo deste
> repositório. **Nenhum dado operacional foi validado com a clínica ainda** —
> valores, agendas, contratos e registros profissionais são demonstrativos.

---

## 1. Resumo executivo

A ELO **já tem uma presença digital madura**: site WordPress bem estruturado, com
posicionamento claro em autismo (TEA) e neurodesenvolvimento, oito especialidades,
cinco convênios, equipe divulgada e blog ativo. O que ela **não tem** é operação
digital: todo agendamento termina no WhatsApp, não existe confirmação automática,
controle de guias de convênio, agenda por profissional/sala, faturamento por
operadora, contratos de locação de sala nem repasse.

O escopo inicial (documento de UI/UX) está correto na ambição, mas foi escrito
para uma **clínica médica com consultas avulsas**. A ELO é uma **clínica
multiprofissional de terapias recorrentes**. Ajustes indispensáveis:

1. Trocar “especialidades médicas” por “serviços/terapias” (TO, fono, psi,
   psicopedagogia, nutrição, fisio, musicoterapia, psicomotricidade).
2. Trocar a lista fictícia de convênios pelos reais (Petrobras, Caixa, Porto,
   SulAmérica, GEAP). **Unimed, Bradesco, Amil e Hapvida não aparecem no site** e
   não devem ser prometidos.
3. Incluir a regra de convênio: **encaminhamento médico obrigatório** e guia de
   autorização quando exigida.
4. Modelar **sessões semanais recorrentes**, com sala e profissional fixos, em vez
   de consultas de 30 minutos.
5. Tratar **avaliação interdisciplinar** como produto próprio (bloqueia equipe e
   sala por mais tempo).

Recomendação: manter o site atual no WordPress na fase 1 (ele funciona e ranqueia),
implantar primeiro **agenda + recepção + check-in + faturamento**, e só depois
migrar o portal e o blog. O protótipo deste repositório já segue essa estrutura.

---

## 2. O que a ELO já tem

### 2.1 Estrutura do site

| Página      | Conteúdo identificado                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home        | Hero TEA, convênios, 8 serviços, números (desde 2016), galeria, depoimentos, faixas etárias, “como funciona”, convênios + particular, FAQ, contato    |
| Serviços    | 9 páginas de serviço: TO, fono, psicologia infantil, psicologia adulto/idoso, psicopedagogia, nutrição, fisioterapia, musicoterapia, psicomotricidade |
| Convênios   | 5 operadoras, passo a passo do convênio (encaminhamento → autorização → contato), cobertura das 8 especialidades, FAQ                                 |
| Equipe      | 19 profissionais listados em 8 áreas, com mini-bio                                                                                                    |
| Autismo     | Sinais por faixa etária, explicação do TEA (CID-11 6A02), acompanhamento, especialidades, FAQ                                                         |
| Blog        | 10 artigos (WordPress), categorias Autismo, TO, Fono, Psicologia, Nutrição, Convênios                                                                 |
| Localização | Link para Google Maps                                                                                                                                 |

### 2.2 Dados institucionais confirmados

- **Nome:** ELO Saúde Integrada — Aracaju (SE), desde 2016.
- **Endereço:** R. Dr. Célso Oliva, 471 — 13 de Julho, Aracaju/SE, 49020-090.
- **Telefone/WhatsApp:** (79) 3085-6878.
- **Redes:** Instagram `@elosaudeintegradaaju`, Facebook `elosaudeintegrada`.
- **Convênios:** Saúde Petrobras, Saúde Caixa, Porto Saúde, SulAmérica, GEAP Saúde
  (+ particular).
- **Serviços:** Terapia Ocupacional, Fonoaudiologia, Psicologia, Psicopedagogia,
  Nutrição, Fisioterapia, Musicoterapia, Psicomotricidade (+ avaliação
  interdisciplinar, intervenção ABA quando indicada, CAA, orientação familiar).
- **Equipe divulgada:** 19 nomes (Rayane Gama, Márcio, Morgana — TO; Flávia, Keila,
  Thaís Lopes, Thaynara — fono; Glória, Helen, Lilian, Mirian — psi; Andrezza,
  Cláudia — psicopedagogia; Carolina, Iasmin, Thawanny — nutrição; Yasmin — fisio;
  Carlos — musicoterapia; Cristiane — psicomotricidade).

### 2.3 O que o site **não** resolve hoje

- Agendamento 100% via WhatsApp (todos os CTAs apontam para o mesmo link).
- Sem confirmação, lembrete ou política de cancelamento automatizada.
- Sem área do paciente (histórico, reagendamento).
- Sem controle de encaminhamento, carteirinha e guia de autorização.
- Sem agenda por profissional/sala nem visão de ocupação.
- Sem controle de faltas e remarcações.
- Sem fechamento por operadora (planilha manual até o dia 25).
- Sem gestão de contratos de locação de sala nem repasses.
- Blog e páginas de serviço mantidos manualmente no WordPress.

---

## 3. Ajustes no escopo original (documento de UI/UX)

| Item do escopo original                         | Situação na ELO                                                                   | Ajuste aplicado / recomendado                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Especialidades médicas (psiquiatria, TEA, TDAH) | Não há psiquiatra na equipe divulgada; TEA/TDAH são condições, não especialidades | Serviços multiprofissionais; TEA e TDAH viram páginas/linhas de cuidado   |
| Consulta de 30 min                              | Terapias de 40–50 min, semanais                                                   | Duração por serviço e recorrência semanal na agenda                       |
| Convênios Unimed, Bradesco, Amil, Hapvida       | Não atendidos                                                                     | Substituídos pelos 5 reais; particular com recibo                         |
| Passo “Plano de saúde” livre                    | Convênio exige encaminhamento médico                                              | Checkbox obrigatório + alerta de guia; pendência visível na recepção      |
| Agenda por médico/sala                          | Terapeutas e salas compartilhadas por turno                                       | Escala por profissional + sala padrão por turno                           |
| Check-in simples                                | Guia/carteirinha são críticos no convênio                                         | Check-in com carteirinha obrigatória, guia opcional e alerta de pendência |
| Corpo clínico com CRM                           | Conselhos profissionais (CREFITO, CRFa, CRP, CRN, ABPp, AMT)                      | Campo “registro profissional” genérico                                    |
| Faturamento por plano                           | Regra de dia 25 não confirmada por operadora                                      | Manter dia 25 como padrão e permitir regra por convênio                   |
| Blog institucional                              | WordPress ativo                                                                   | Fase 1: manter; fase 2: migrar ou integrar por API                        |
| Sem PEP / sem painel médico                     | Válido                                                                            | Mantido. Avaliar acesso somente-leitura à agenda do terapeuta             |
| Salas como ativos                               | Modelo real da clínica                                                            | Contratos por turno fixo, mensalidade ou avulso/hora                      |
| Repasse médico                                  | Modelo misto (locação e percentual)                                               | Matriz por profissional/procedimento                                      |

### Pontos que precisam de decisão antes do orçamento fechado

1. **Psiquiatria:** o site lista “psiquiatria infantojuvenil” entre os serviços mais
   buscados, mas não há psiquiatra na equipe. Haverá contratação/parceria? Isso muda
   agenda, repasse e comunicação.
2. **Horário de funcionamento:** não publicado no site. Precisa ser confirmado para
   footer, agenda e regras de slot.
3. **Tabela de valores:** particular e repasses não são públicos. Necessária para
   orçamento, faturamento e simulações.
4. **Regras por operadora:** dia de fechamento, exigência de guia, glosa e prazo de
   pagamento podem variar — o “dia 25” é premissa, não fato.
5. **Política de faltas/cancelamento:** 24h é suposição; clínicas de terapia costumam
   ter regras específicas (ex.: cobrança de sessão).
6. **Blog:** será gerenciado no novo sistema ou continuará no WordPress?
7. **Acesso do terapeuta:** o escopo negativo exclui painel médico. Com 20+
   profissionais, ao menos uma visão de agenda (somente leitura) tende a ser
   necessária.
8. **Contabilidade:** integração real (NFSe, livro caixa) ou apenas exportação CSV?
9. **LGPD:** dados de crianças e laudos exigem política de retenção, consentimento
   e controle de acesso — não previsto no escopo original.

---

## 4. Estrutura entregue no protótipo

### Portal público (mobile-first)

```
/                 Home — hero TEA, convênios, serviços, como funciona, equipe, blog, FAQ
/servicos         Detalhe dos 8 serviços + avaliação interdisciplinar
/convenios        5 convênios, regras de encaminhamento, cobertura, FAQ
/equipe           Equipe agrupada por serviço (19 profissionais)
/autismo          Sinais por idade, TEA, acompanhamento, especialidades, FAQ
/blog             Lista com filtro por categoria
/blog/:slug       Artigo (conteúdo demonstrativo)
/agendar          Wizard: serviço → profissional → atendimento → data/hora → dados
/minhas-consultas Área do paciente: reagendar e cancelar (regra de 24h)
```

### Painel interno (desktop-first, com perfis demonstrativos)

```
/painel                    Agenda do dia, filtros, check-in, novo agendamento
/painel/faturamento        Relatório por convênio + prazo dia 25
/painel/gestor             Dashboard: atendimentos, convênio × particular, ocupação, pendências de guia
/painel/salas              Status das salas + contas a receber de locação
/painel/escalas            Dias, turnos, intervalo e sala padrão por profissional
/painel/contratos          Contratos de locação, modalidades e encargos
/painel/cadastros          Profissionais, salas, convênios e procedimentos
/painel/repasses           Espelho de produção e retenção
/painel/contabilidade      Conciliação, locação, fechamento e exportações
```

O seletor de perfil no topo do painel demonstra a segregação prevista:
Recepcionista, Gestor, Contador e Administrador.

---

## 5. Regras de negócio já modeladas

- **Encaminhamento obrigatório** para convênio (site da ELO), validado no wizard e
  no check-in.
- **Carteirinha** obrigatória no check-in por convênio; **guia de autorização**
  registrada quando houver, com alerta de pendência no dashboard.
- **Particular** com valor, método de pagamento e recibo.
- **Cancelamento online até 24h** antes; depois disso, somente recepção.
- **Fechamento de convênios no dia 25** (premissa configurável por operadora).
- **Sessão semanal recorrente** identificada na agenda e na área do paciente.
- **Sala como ativo**: status (livre/ocupada/manutenção), ocupante do turno,
  contrato por turno fixo/mensalidade/avulso e baixa de pagamento.
- **Repasse** com valor bruto, retenção e líquido por profissional e convênio.

---

## 6. Faseamento sugerido

**Fase 1 — Operação (maior dor, menor risco)**
Agenda por profissional/sala, check-in, cadastro de pacientes, convênios reais,
faturamento e exportação. Substitui planilhas e o controle manual de guias.

**Fase 2 — Gestão**
Contratos de locação, escalas, repasses, dashboard e conciliação. Depende da
tabela de valores e das regras de cada operadora.

**Fase 3 — Portal e paciente**
Wizard de agendamento, área do paciente, lembretes e comunicação automática.
Avaliar migração do blog e SEO (o WordPress atual já tem autoridade).

**Fora de escopo (mantido)**
Prontuário eletrônico (PEP) e painel clínico do profissional.

---

## 7. Checklist de dados para a próxima reunião

- [ ] Tabela particular por serviço e avaliação interdisciplinar.
- [ ] Integração com API do WhatsApp
- [ ] Modelo de contrato dos profissionais (locação, percentual, misto).
- [ ] Regras de cada convênio: fechamento, guia, glosa, prazo.
- [ ] Registros profissionais e escalas reais da equipe.
- [ ] Quantidade e planta das salas (para reserva e locação).
- [ ] Política de cancelamento, falta e remarcação.
- [ ] Se haverá psiquiatria e como ela entra na agenda.
- [ ] Necessidade de acesso do terapeuta à própria agenda.
- [ ] Requisitos de LGPD e de integração contábil/NFSe.
