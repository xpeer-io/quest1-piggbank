# Spec Doc: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir seleção de data inicial e data final para filtrar todas as métricas exibidas no dashboard financeiro do piggbank.
**Status:** Draft
**Owner:** [a definir]
**Created:** 2026-05-20
**Updated:** 2026-05-20

**Link PRD:** ../PRD-filtro-periodo.md
**Link Figma:** [a definir]

## Goals

- [ ] Goal 1: permitir que o usuário escolha um intervalo de datas personalizado para filtrar métricas e transações.
- [ ] Goal 2: manter o comportamento padrão de "últimos 30 dias" quando nenhum intervalo estiver definido.
- [ ] Goal 3: evitar resultados incorretos por intervalo inválido ou datas futuras.

## Scope & Non-Scope

**In Scope:**

- Adicionar um componente de seleção de período no dashboard principal.
- Filtrar todas as métricas exibidas (`Faturamento`, `Despesas`, `Lucro Líquido`, `Transações`) com base no intervalo selecionado.
- Filtrar a lista de transações exibida na tabela pelo mesmo intervalo.
- Exibir estado vazio quando não houver transações para o período selecionado.
- Validar intervalos inválidos e alertar o usuário.
- Reusar utilitários de data existentes em `src/lib/date.ts` e o tipo `DashboardFilters` em `src/types/index.ts`.

**Out of Scope:**

- Persistência do filtro para outras telas ou entre sessões.
- Presets avançados como "Últimos 7 dias" ou "Últimos 90 dias".
- Criação de endpoint API externo novo além de suportar filtro no caminho existente de dados.
- Redesenho completo de dashboard mobile além da responsividade básica.

## Architecture Decisions

### 1. UI State em `DashboardPage`

**Decision:** manter `src/app/dashboard/page.tsx` como client component para controlar seleção do intervalo e renderizar métricas em tempo real.

**Alternatives considered:**

1. Usar server component com query string para filtro — trade-off: melhor SEO e cache, mas adiciona complexidade e requer sincronização de URL.
2. Usar estado global/Context — trade-off: mais boilerplate para algo local ao dashboard.
3. Manter client component e delegar apenas a lógica de filtro para serviços — escolhido pelo equilíbrio entre simplicidade e compatibilidade com o código atual.

**Rationale:** o dashboard já usa `useState` e o filtro de período envolve interatividade que justifica a camada client. A página client pode orquestrar chamadas a `src/lib/api.ts` sem alterar a arquitetura principal.

### 2. Reuso de utilitários de data

**Decision:** usar `src/lib/date.ts` para toda a validação e formatação de datas.

**Alternatives considered:**

1. Criar utilitários de data separados no componente — trade-off: duplicação e risco de inconsistência.
2. Usar `new Date()` diretamente no UI — trade-off: violação de padrão do projeto e bugs de timezone.

**Rationale:** o projeto já define `DATE_DISPLAY_FORMAT`, `DATE_URL_FORMAT`, `getDefaultDateRange`, `isValidDateRange`, `exceedsMaxRange`, `isDateInFuture` em `src/lib/date.ts`. Reutilizar esses utilitários mantém consistência e reduz risco.

### 3. Contrato de dados localizado em `src/lib/api.ts`

**Decision:** estender `getTransactions` e `getMetrics` em `src/lib/api.ts` para receber `DashboardFilters` e aplicar o filtro por intervalo.

**Alternatives considered:**

1. Filtrar apenas no componente — trade-off: menos reusable e menos alinhado com separação de responsabilidades.
2. Criar novo serviço de filtro de período — trade-off: mais código para manutenção.

**Rationale:** `src/lib/api.ts` já é o local oficial de acesso a dados segundo o CLAUDE.md. Isso mantém a separação de responsabilidade entre apresentação e dados.

### 4. UI picker com componentes existentes

**Decision:** criar um novo componente `DateRangeFilter` que use `Calendar` e `Popover` da UI existente.

**Alternatives considered:**

1. Implementar picker custom sem shadcn/ui — trade-off: mais esforço e inconsistência.
2. Usar inputs nativos de data — trade-off: UX inferior e formato inconsistente.

**Rationale:** o projeto já inclui `src/components/ui/calendar.tsx` e `src/components/ui/popover.tsx`, o que facilita criar um filtro com bom comportamento e responsividade.

### API Contract

```
GET /api/dashboard?from=yyyy-MM-dd&to=yyyy-MM-dd

Request:
{
  "from": "string — data inicial no formato yyyy-MM-dd",
  "to": "string — data final no formato yyyy-MM-dd"
}

Response (200):
{
  "metrics": [
    { "label": "Faturamento", "value": 1234.56, "currency": true },
    { "label": "Despesas", "value": 789.00, "currency": true },
    { "label": "Lucro Líquido", "value": 445.56, "currency": true },
    { "label": "Transações", "value": 12, "currency": false }
  ],
  "transactions": [
    {
      "id": "string",
      "description": "string",
      "amount": 0,
      "type": "income" | "expense",
      "date": "yyyy-MM-dd",
      "category": "string"
    }
  ]
}

Errors:
400: data inválida ou intervalo inválido
422: intervalo maior que 12 meses
500: erro interno
```

### Database Schema

```sql
-- Não há mudanças de schema previstas para essa feature.
-- O filtro é aplicado sobre registros de transações existentes.
```

## UI/UX

**Telas afetadas:**

- Dashboard principal (`src/app/dashboard/page.tsx`)

**Componentes novos:**

- `DateRangeFilter` — controle de seleção de data inicial e data final.
- `DateRangeSummary` (opcional) — resumo do período aplicado acima das métricas.

**Componentes afetados:**

- `src/app/dashboard/page.tsx`
- `src/components/dashboard/MetricsCard.tsx`
- `src/components/dashboard/TransactionsTable.tsx`
- `src/lib/api.ts`
- `src/lib/date.ts`
- `src/types/index.ts`

**Estados:**

- Loading: estado de carregamento após a seleção do intervalo e antes de exibir dados.
- Success: métricas e transações filtradas carregadas corretamente.
- Empty: não há transações no período selecionado; exibe mensagem de tabela vazia.
- Invalid Range: usuário escolhe `from` posterior a `to` ou data futura; exibe feedback de validação.
- Default: nenhum intervalo definido, mostra últimos 30 dias.

## Fluxo de Dados

1. `DashboardPage` inicializa `filters.dateRange` com `getDefaultDateRange()`.
2. `DashboardPage` renderiza `DateRangeFilter` passando o `dateRange` atual e callbacks de atualização.
3. Usuário atualiza `from` ou `to` no `DateRangeFilter`.
4. `DateRangeFilter` valida o intervalo com `isValidDateRange()` e `isDateInFuture()`.
5. Se válido, `DashboardPage` solicita dados a `getMetrics(filters)` e `getTransactions(filters)`.
6. `src/lib/api.ts` aplica o filtro no conjunto de transações e retorna as métricas calculadas por `computeMetrics()`.
7. `MetricsCard` e `TransactionsTable` são renderizados com os dados filtrados.

## Regras de Negócio

- O dashboard deve mostrar o intervalo de datas ativo na interface.
- O intervalo padrão é sempre os últimos 30 dias usando `getDefaultDateRange()`.
- A data final deve ser maior ou igual à data inicial? Decisão: a data final deve ser posterior ou igual à data inicial, mas intervalos de um único dia são válidos.
- Datas futuras não são permitidas para `from` nem `to`.
- O filtro deve ser aplicado para todas as métricas e para a lista de transações.
- Se não houver transações no intervalo, exibir estado vazio específico.
- O intervalo não deve exceder 12 meses, seguindo o utilitário `MAX_DATE_RANGE_MONTHS`.

## Edge Cases

- `from` posterior a `to` — exibir erro: "A data inicial deve ser anterior ou igual à data final.".
- intervalo vazio no payload — exibir erro de validação.
- intervalo maior que 12 meses — exibir erro: "O período não pode ultrapassar 12 meses.".
- data final no futuro — exibir erro: "Datas futuras não são permitidas.".
- intervalo de um único dia — deve retornar transações desse dia.
- ausência total de transações no período — exibir mensagem de estado vazio.
- `getTransactions` retorno vazio mas `getMetrics` deve retornar valores zerados corretamente.

## Test Strategy

**Unitários:**

- `src/lib/date.test.ts`:
  - validar `isValidDateRange` com `from > to`, `from == to`, `from < to`.
  - validar `isDateInFuture` com data futura e data passada.
  - validar `exceedsMaxRange` com intervalos maiores e menores que 12 meses.

- `src/lib/api.test.ts`:
  - garantir que `getTransactions(filters)` filtra corretamente por `dateRange`.
  - garantir que `getMetrics(filters)` retorna métricas calculadas apenas para transações no intervalo.

- `src/components/dashboard/DateRangeFilter.test.tsx`:
  - renderiza `from` e `to` corretamente.
  - exibe erro para intervalo inválido.
  - chama callback de atualização somente quando o intervalo é válido.

- `src/components/dashboard/DashboardPage.test.tsx`:
  - exibe o período padrão de 30 dias.
  - atualiza métricas e tabela após seleção de intervalo.
  - exibe estado vazio quando não há transações.

**Integração:**

- validar fluxo integrado entre `DashboardPage`, `DateRangeFilter`, `src/lib/api.ts` e `computeMetrics()`.
- verificar que a seleção de intervalo atualiza `getMetrics` e `getTransactions` com os filtros corretos.

**E2E:**

- fluxo crítico: usuário abre dashboard, seleciona intervalo, aplica filtro, e vê métricas e tabela atualizadas.

**Edge cases:**

- intervalo inválido com `from > to` bloqueia a aplicação do filtro.
- seleção de data futura bloqueia a ação.
- intervalo sem transações mostra mensagem vazia.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — novo componente de seleção de período.
- [ ] `src/app/dashboard/page.tsx` — integra `DateRangeFilter` e mantém estado de `DashboardFilters`.
- [ ] `src/lib/api.ts` — estende `getTransactions`/`getMetrics` para usar `DashboardFilters`.
- [ ] `src/lib/date.ts` — validações de intervalo e formatação usadas pelo componente.
- [ ] `src/components/dashboard/TransactionsTable.tsx` — mantém estado vazio para período sem transações.

**Validações (sensors):**

- [ ] Linter passa sem erros.
- [ ] Build/compilação sem erros.
- [ ] Scan de segurança/LGPD sem achados críticos.
- [ ] Testes existentes continuam passando.

**Testes novos (escritos pelo QA):**

- [ ] Teste unitário de validação de intervalo.
- [ ] Teste unitário de filtro de transações por data.
- [ ] Teste de integração do fluxo de filtro de período.

## Rollout Plan

- [ ] deploy em staging com feature testada localmente.
- [ ] validar comportamento de filtro em intervalos curtos e longos.
- [ ] monitorar uso do dashboard e regressões relacionadas à seleção de datas.

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Filtro aplicado apenas na UI, deixando backend sem filtro | Média | Alto | Garantir que `src/lib/api.ts` receba e aplique `DashboardFilters` antes de renderizar dados. |
| Intervalo inválido exibido sem feedback claro | Média | Médio | Validar com `src/lib/date.ts` e exibir mensagens específicas no componente. |
| Datas futuras geram resultados vazios e confusos | Baixa | Médio | Bloquear seleção de datas futuras e documentar no UX. |
| Limite de período desconhecido pelo usuário | Média | Médio | aplicar validação de máximo 12 meses e exibir mensagem de erro. |

## Dependencies

- [ ] Design/UX: definição de comportamento para data final e datas futuras.
- [ ] Produto: confirmação do escopo do filtro apenas no dashboard.
- [ ] QA: testes de regressão para dashboard e intervalos de data.

## Checklist de aprovação

- [ ] Goals claros e mensuráveis.
- [ ] Scope definido (in/out).
- [ ] Architecture decisions documentadas com trade-offs.
- [ ] API contract definido.
- [ ] Test strategy cobre caminho feliz + edge cases.
- [ ] Rollout plan com feature testada.
- [ ] Riscos identificados com mitigação.
