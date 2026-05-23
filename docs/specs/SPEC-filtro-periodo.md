# Spec Doc: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir seleção de um intervalo de datas personalizado no dashboard financeiro do piggbank.
**Status:** Draft
**Owner:** @TODO
**Created:** 2026-05-17
**Updated:** 2026-05-17

**Link PRD:** ../PRD-filtro-periodo.md
**Link Figma:** [ainda não disponível]

## Goals

- [ ] Goal 1: Permitir que o usuário escolha `data início` e `data fim` e filtrar todas as métricas e transações do dashboard por esse intervalo.
- [ ] Goal 2: Preservar o comportamento padrão atual de “últimos 30 dias” quando o usuário não selecionar um intervalo explícito.
- [ ] Goal 3: Reusar utilitários e componentes existentes do projeto para manipulação de datas e renderização de UI.
- [ ] Goal 4: Garantir validação clara de intervalos inválidos e exibir estado vazio consistente quando não houver dados.

## Scope & Non-Scope

**In Scope:**

- Implementar o filtro de período no dashboard em `src/app/dashboard/page.tsx`.
- Usar `src/components/dashboard/DateRangeFilter.tsx` como componente de seleção de intervalo.
- Propagar `dateRange` para `src/lib/api.ts`, `src/lib/metrics.ts` e `src/components/dashboard/TransactionsTable.tsx`.
- Validar intervalos no cliente e no backend interno usando `src/lib/date.ts`.
- Mostrar estado vazio quando não houver transações no período.
- Manter o padrão de “últimos 30 dias” para carregamento inicial sem filtro.

**Out of Scope:**

- Mudanças no schema de banco de dados.
- Abrangência além da rota `/dashboard`.
- Relatórios adicionais ou comparação automática entre períodos.
- Presets de intervalo pré-configurados (hoje, mês atual, etc.) além de seleção manual.
- Persistência de filtro em perfil de usuário ou localStorage nesta fase.

## Architecture Decisions

### 1. Reuso de componentes e utilitários existentes

**Decision:** Reusar `src/components/dashboard/DateRangeFilter.tsx` e o tipo `DateRange` em `src/types/index.ts`, além das funções de data de `src/lib/date.ts`.

**Alternatives considered:**

1. Criar novo componente de filtro — descartado para evitar duplicação.
2. Usar inputs de texto com máscara — menos acessível e propenso a erro.
3. Implementar validação apenas no backend — resultaria em feedback ruim para o usuário.

**Rationale:**

- O projeto exige uso de componentes existentes em `src/components/ui/` e utilitários de data em `src/lib/date.ts`.
- Reusar componentes reduz o tempo de implementação e mantém consistência visual.
- Validar no cliente melhora experiência e evita chamadas inválidas.

### 2. Controle cliente com URL para deep-link

**Decision:** O filtro de período será um componente cliente que sincroniza estado com query params (`from`/`to`).

**Alternatives considered:**

1. Gerenciar estado apenas em local state — não permitiria reloads e links compartilháveis.
2. Fazer o filtro totalmente server-side — adiciona complexidade desnecessária para a iteração inicial.
3. Salvar estado em localStorage — fora do escopo atual e menos previsível.

**Rationale:**

- App Router requer componente cliente para interações.
- Query params permitem compartilha/recarga e mantêm o URL RESTful.
- O padrão reduz surprises e facilita debugging.

### 3. Mesma fonte de verdade para métricas e transações

**Decision:** Usar o mesmo `DashboardFilters.dateRange` para acionar `getMetrics()` e `getTransactions()`.

**Alternatives considered:**

1. Filtrar apenas as transações no cliente — geraria métricas inconsistentes.
2. Manter métricas sem filtro — quebra o objetivo do feature.
3. Criar um segundo filtro separado para cards e tabela — confuso para o usuário.

**Rationale:**

- Garante consistência entre cards e tabela.
- Facilita testes e evita bugs de chefia.
- Prepara o código para futura migração para backend real.

### API Contract

```http
GET /api/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Request params:

- `from` — data de início no formato `YYYY-MM-DD`
- `to` — data de fim no formato `YYYY-MM-DD`

Internal request contract (tipo):

```ts
interface DateRange {
  from: Date;
  to: Date;
}

interface DashboardFilters {
  dateRange?: DateRange;
}
```

Response (200):

```json
{
  "data": {
    "metrics": [
      { "label": "Faturamento", "value": 0, "currency": true },
      { "label": "Despesas", "value": 0, "currency": true },
      { "label": "Lucro Líquido", "value": 0, "currency": true },
      { "label": "Transações", "value": 0, "currency": false }
    ],
    "transactions": [
      { "id": "string", "description": "string", "amount": 0, "type": "income", "date": "YYYY-MM-DD", "category": "string" }
    ]
  },
  "metadata": { "count": 123 }
}
```

Errors:

- `400` — `from` ou `to` inválidos, `from > to`, ou data fora do intervalo permitido.
- `422` — intervalo excede limite de produto/performance (ex: > 12 meses).
- `500` — erro interno.

### Database Schema

```sql
-- Nenhuma mudança no schema é necessária para esta iteração.
-- Os filtros serão aplicados em consultas sobre os dados existentes.
```

## UI/UX

**Telas afetadas:**

- Dashboard (`src/app/dashboard/page.tsx`)

**Componentes novos / reusados:**

- `src/components/dashboard/DateRangeFilter.tsx` — filtro de período.
- `src/components/dashboard/MetricsCard.tsx` — recebe `dateRange` para recalcular métricas.
- `src/components/dashboard/TransactionsTable.tsx` — lista transações filtradas.
- `src/components/ui/button.tsx` — botões de aplicar/limpar.
- `src/components/ui/calendar.tsx` — seleção de datas.

**Estados:**

- Loading: mostra skeletons ou indicador padrão enquanto dados são carregados.
- Empty: exibe mensagem clara quando não há transações no intervalo.
- Error: validação inline para `from > to`, intervalo acima do máximo e data futura.
- Success: cartões e tabela atualizam para o intervalo selecionado.

## Test Strategy

**Unitários:**

- [ ] Validar `src/lib/date.ts` para intervalos padrão, limites máximos e datas futuras.
- [ ] `DateRangeFilter` deve impedir `from > to`, lidar com `onApply`/`onClear` e renderizar estados de erro.
- [ ] `src/lib/api.ts` deve aceitar `dateRange` e aplicar filtros corretamente.
- [ ] `src/lib/metrics.ts` deve derivar métricas apenas das transações no intervalo.

**Integração:**

- [ ] Dashboard aplica o mesmo `dateRange` em `getMetrics()` e `getTransactions()`.
- [ ] `DateRangeFilter` atualiza query params e recarrega o dashboard com o período correto.
- [ ] `TransactionsTable` exibe estado vazio quando não há dados.

**E2E:**

- [ ] Usuário abre dashboard, vê “últimos 30 dias”, seleciona intervalo personalizado e vê métricas/tabela atualizados.

**Edge cases:**

- [ ] `from > to` — validação visível e bloqueio do envio.
- [ ] Intervalo maior que 12 meses — aviso ou erro de limite.
- [ ] Data futura — proibição e mensagem clara.
- [ ] Intervalo com um único dia (`from == to`) — válido.
- [ ] Intervalo sem transações — estado vazio consistente.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — expor `onApply(dateRange)` e `onClear()`.
- [ ] `src/app/dashboard/page.tsx` — ler/serializar query params `from`/`to` e passar `currentRange`.
- [ ] `src/lib/api.ts` — aceitar `filters.dateRange` e aplicar ao fetch/consulta.
- [ ] `src/lib/metrics.ts` — aceitar `dateRange` como input para cálculos de métricas.
- [ ] Atualizar testes em `src/lib/date.test.ts`, `src/components/dashboard/DateRangeFilter.test.tsx` e `src/components/dashboard/TransactionsTable.test.tsx`.

**Validações (sensors):**

- [ ] Linter passa sem erros.
- [ ] Build/compilação sem erros.
- [ ] Testes novos com coverage mínimo de 80%.
- [ ] Todos os testes existentes continuam passando.

**Testes novos (escritos pelo QA):**

- [ ] Aplicar intervalo válido e validar métricas e transações.
- [ ] Aplicar intervalo inválido e validar mensagem de erro.
- [ ] Verificar estado vazio para período sem dados.

## Rollout Plan

- [ ] Feature flag criada e desabilitada.
- [ ] Deploy em staging + smoke tests.
- [ ] Rollout gradual, se necessário.
- [ ] Monitoramento ativo durante rollout.
- [ ] Critério de rollback definido.

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Timezone / normalização de datas | Média | Alto | Usar `src/lib/date.ts` e `date-fns`; cobrir com testes. |
| Intervalos longos impactam performance | Média | Médio/Alto | Limitar intervalo máximo e exibir aviso de performance. |
| Inconsistência entre métricas e tabela | Média | Alto | Usar o mesmo `DashboardFilters.dateRange` para ambos. |
| Falta de feedback do usuário | Média | Médio | Validar no cliente e exibir mensagens claras de erro/empty. |

## Dependencies

- [ ] Definir limite máximo de período com Product.
- [ ] Confirmar estratégia de persistência de filtro (URL / local state).
- [ ] Revisão de acessibilidade do controle de data.

## Checklist de aprovação

- [ ] Goals claros e mensuráveis.
- [ ] Scope definido (in/out).
- [ ] Architecture decisions documentadas com trade-offs.
- [ ] API contract definido.
- [ ] Test strategy cobre caminho feliz + edge cases.
- [ ] Rollout plan com feature flag.

# Spec Doc: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir seleção de um intervalo de datas personalizado no dashboard financeiro do piggbank.
**Status:** Draft
**Owner:** [dev responsável]
**Created:** 2026-05-10
**Updated:** 2026-05-10

**Link PRD:** docs/PRD-filtro-periodo.md
**Link Figma:** [ainda não disponível]

## Goals

- [ ] Goal 1: Permitir que o usuário defina `data início` e `data fim` e ver métricas e transações apenas nesse intervalo.
- [ ] Goal 2: Manter compatibilidade com o dashboard atual e não alterar o comportamento padrão de últimos 30 dias.
- [ ] Goal 3: Usar os utilitários existentes em `src/lib/date.ts` e o padrão de Server Components do projeto.
- [ ] Goal 4: Garantir validação clara de intervalo inválido e apresentar estado vazio quando não há dados.

## Scope & Non-Scope

**In Scope:**

- Implementar componente `DateRangeFilter` no dashboard.
- Substituir o placeholder `Últimos 30 dias` por um controle de seleção de período.
- Filtrar as chamadas de dados em `src/lib/api.ts` com `DashboardFilters.dateRange`.
- Reutilizar tipos existentes `DateRange`, `DashboardFilters`, `MetricSummary` e `Transaction`.
- Validar e limitar intervalos usando `src/lib/date.ts`.
- Exibir estado vazio quando não houver transações no intervalo selecionado.
- Manter o comportamento padrão de `Últimos 30 dias` ao carregar a página sem filtro explícito.

**Out of Scope:**

- Alinhamento com relatórios fora do dashboard.
- Mudanças no schema de banco de dados ou backend real (o projeto usa `mockTransactions`).
- Comparação automática entre períodos ou visualizações de tendência.
- Presets de período (hoje, este mês, ano a ano) além do controle manual.
- Salvamento de filtro no perfil do usuário ou em local storage.

## Architecture Decisions

### 1. Componente `DateRangeFilter` no dashboard

**Decision:** Implementar `DateRangeFilter` como um componente cliente em `src/components/dashboard/DateRangeFilter.tsx`, usando componentes UI existentes (`src/components/ui/button.tsx`, `src/components/ui/calendar.tsx`) para seleção de datas.

**Alternatives considered:**

1. Componente cliente separado + state local — mantém Server Component na página e permite validação no cliente.
2. Input de texto simples com máscara — menos acessível e propenso a erro.
3. Filtro server-side apenas via query params em rota — excede escopo para implementação inicial.

**Rationale:**

- O dashboard atual é uma Server Component e o filtro deve ser interativo, então `DateRangeFilter` precisa ser cliente.
- Existe já suporte de UI para calendário e botões, reduzindo trabalho de implementação.
- Usar um componente cliente evita mixar lógica de estado com renderização de dados do server.

### 2. Reuso dos utilitários de data do projeto

**Decision:** Usar `getDefaultDateRange()`, `isValidDateRange()`, `exceedsMaxRange()` e `isDateInFuture()` de `src/lib/date.ts` para normalizar e validar datas.

**Alternatives considered:**

1. Criar novas funções customizadas — duplicaria lógica e violaria padrões do projeto.
2. Usar `new Date()` diretamente — não recomendado pelo CLAUDE.md.
3. Delegar toda validação ao backend — inviável para a UI do dashboard.

**Rationale:**

- Há utilitários existentes e padrões definidos em `CLAUDE.md` para manipulação de datas.
- `DATE_DISPLAY_FORMAT` e `DATE_URL_FORMAT` garantem consistência de apresentação e eventual deep-linking.
- A validação de intervalo máximo limita queries pesadas.

### 3. API contract interno com `DashboardFilters`

**Decision:** Estender `DashboardFilters` em `src/types/index.ts` e filtrar `getTransactions(filters)` e `getMetrics(filters)` internamente.

**Alternatives considered:**

1. Adicionar novo serviço de backend para filtros — fora do escopo, pois dados já são mockados.
2. Passar apenas strings de data — menos seguro em TypeScript.
3. Filtrar apenas transações na UI sem atualizar `getMetrics` — pode gerar métricas inconsistentes.

**Rationale:**

- O repo já usa `DashboardFilters` e `DateRange` como tipos centrais.
- Isso garante que métricas e tabela usem exatamente o mesmo intervalo.
- Facilita testes e futura migração para backend real.

### API Contract

```ts
// Internal contract
const filters: DashboardFilters = {
  dateRange: {
    from: Date,
    to: Date,
  },
};

// Existing functions to consume
getTransactions(filters): Promise<Transaction[]>;
getMetrics(filters): Promise<MetricSummary[]>;
```

Request:

```json
{
  "dateRange": {
    "from": "Date",
    "to": "Date"
  }
}
```

Response (200):

```json
{
  "metrics": [
    { "label": "Faturamento", "value": 0, "currency": true },
    { "label": "Despesas", "value": 0, "currency": true },
    { "label": "Lucro Líquido", "value": 0, "currency": true },
    { "label": "Transações", "value": 0, "currency": false }
  ],
  "transactions": [
    { "id": "string", "description": "string", "amount": 0, "type": "income" | "expense", "date": "Date", "category": "string" }
  ]
}
```

Errors:

- 400: intervalo inválido (`from > to`, data no futuro, intervalo maior que 12 meses)
- 422: filtro incompleto ou formato incorreto
- 500: erro interno de processamento

### Database Schema

```sql
-- Não aplicável para esta implementação inicial;
-- o projeto usa `mockTransactions` em `src/lib/api.ts`.
```

## UI/UX

**Telas afetadas:**

- Dashboard principal (`src/app/dashboard/page.tsx`)

**Componentes novos:**

- `src/components/dashboard/DateRangeFilter.tsx` — seleção de intervalo de datas

**Componentes reutilizados:**

- `src/components/ui/button.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/dashboard/MetricsCard.tsx`
- `src/components/dashboard/TransactionsTable.tsx`

**Estados:**

- Loading: mantém o indicador padrão do dashboard enquanto dados são carregados.
- Empty: exibe mensagem clara quando não há transações no período selecionado.
- Error: mostra validação inline quando o intervalo é inválido ou incompleto.
- Success: atualiza métricas e tabela para o intervalo selecionado.

## Test Strategy

**Unitários:**

- [ ] `src/lib/date.ts` deve validar `DateRange` corretamente.
- [ ] `DateRangeFilter` deve bloquear `from > to` e desabilitar botão de aplicar.
- [ ] `src/lib/api.ts` deve passar filtros para `getTransactions` e `getMetrics` corretamente.
- [ ] `computeMetrics` deve continuar retornando valores corretos para dados filtrados.

**Integração:**

- [ ] Dashboard aplica filtro em `getMetrics()` e `getTransactions()` com o mesmo `dateRange`.
- [ ] A seleção de data atualiza o dashboard sem quebrar o fluxo de Server Component.
- [ ] `TransactionsTable` exibe estado vazio quando `transactions` é `[]`.

**E2E:**

- [ ] Usuário abre o dashboard, vê “Últimos 30 dias”, escolhe intervalo personalizado e observa métricas/tabela atualizados.

**Edge cases:**

- [ ] `from` posterior a `to` — validação visível e resposta de erro.
- [ ] Intervalo maior que 12 meses — mensagem de limite apresentada.
- [ ] Data futura — proibida pelo filtro.
- [ ] Intervalo sem transações — estado vazio exibido.
- [ ] `from` igual a `to` — intervalo de um dia válido.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — input de período e validação.
- [ ] `src/app/dashboard/page.tsx` — renderiza o filtro e passa `DashboardFilters` para os dados.
- [ ] `src/lib/api.ts` — aceita filtros e aplica `dateRange` a transações.
- [ ] `src/lib/date.ts` — usa utilitários existentes para defaults e validações.

**Validações (sensors):**

- [ ] Linter passa sem erros
- [ ] Build/compilação sem erros
- [ ] Scan de segurança/LGPD sem achados críticos
- [ ] Testes existentes continuam passando

**Testes novos (escritos pelo QA):**

- [ ] Validação de intervalo inválido no filtro
- [ ] Estado vazio para período sem transações
- [ ] Dashboard atualizado ao aplicar intervalo personalizado

## Rollout Plan

- [ ] Feature flag criada e desabilitada
- [ ] Deploy em staging + teste manual
- [ ] Rollout gradual: 5% → 25% → 50% → 100%
- [ ] Monitoramento ativo durante rollout
- [ ] Critério de rollback definido

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Intervalos inválidos ou futuros | Média | Alto | Validar no cliente com mensagens claras e no backend interno | 
| Métricas descoordenadas entre cards e transações | Média | Alto | Usar o mesmo `DashboardFilters.dateRange` para `getMetrics` e `getTransactions` | 
| Intervalo extremo (>12 meses) | Baixa | Médio | Limitar pelo utilitário `exceedsMaxRange()` e exibir aviso | 
| Mudança de design sem validação | Média | Médio | Definir UX antes da implementação e usar componentes existentes de UI | 

## Dependencies

- [ ] Confirmação do produto sobre limites máximos/minimos de período
- [ ] Decisão de design para controle de filtro de datas
- [ ] Revisão de acessibilidade para o componente de período

## Checklist de aprovação

- [ ] Goals claros e mensuráveis
- [ ] Scope definido (in/out)
- [ ] Architecture decisions documentadas com trade-offs
- [ ] API contract definido
- [ ] Test strategy cobre caminho feliz + edge cases
- [ ] Rollout plan com feature flag
- [ ] Riscos identificados com mitigação
