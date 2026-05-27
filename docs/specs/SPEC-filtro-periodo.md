# Spec Doc: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir que o usuário escolha um período customizado para filtrar todas as métricas e a lista de transações no dashboard.
**Status:** Draft
**Owner:** [dev responsável]
**Created:** 2026-05-25
**Updated:** 2026-05-25

**Link PRD:** ../PRD-filtro-periodo.md
**Link Figma:** [a definir]

## Goals

- [ ] Goal 1: permitir seleção de `data início` e `data fim` no dashboard.
- [ ] Goal 2: manter o comportamento padrão de `últimos 30 dias` quando o filtro estiver vazio.
- [ ] Goal 3: aplicar o mesmo intervalo a métricas e tabela de transações.

## Scope & Non-Scope

**In Scope:**

- UI de filtro de período no dashboard principal.
- Validação de intervalo inválido (`from > to`, intervalo maior que 12 meses, data futura).
- Uso de utilitários de data existentes em `src/lib/date.ts`.
- Extensão de `src/lib/api.ts` para receber `DashboardFilters` e aplicar o período no retorno.
- Exibição de estado `empty` quando não há transações no período selecionado.

**Out of Scope:**

- Filtro em telas fora do dashboard atual.
- Comparativos automáticos (Mês a mês, ano a ano).
- Exportação de relatórios ou filtros salvos em backend.
- Autenticação ou permissões de usuário.

## Architecture Decisions

### 1. Date range filter as search params + client control

**Decision:** usar um componente cliente para controlar o formulário de intervalo e persistir seleção em query string, enquanto o `DashboardPage` permanece Server Component e consome `getMetrics` / `getTransactions` com `DashboardFilters`.

**Alternatives considered:**

1. `Server Component` com `form action` e renderização no servidor — mais alinhado com App Router, mas menos fluido para o usuário.
2. `Client Component` que filtra apenas localmente após o carregamento inicial — evita round-trip, mas quebra o padrão de dados centralizados e pode gerar inconsistência entre métricas e tabela.
3. `Server Component` com API route dedicada — mais trabalho para resolver apenas custom filter no dashboard.

**Rationale:**

- mantém o dashboard atualizado em cada render com dados consistentes;
- preserva o padrão de server-first já usado no `DashboardPage`;
- mantém código simples e construído em cima de utilitários de data existentes.

### API Contract

```http
GET /dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Request:
```json
{
  "from": "string — data inicial no formato yyyy-MM-dd",
  "to": "string — data final no formato yyyy-MM-dd"
}
```

Response (200):
```json
{
  "data": {
    "metrics": [
      { "label": "Faturamento", "value": 1000, "currency": true },
      { "label": "Despesas", "value": 500, "currency": true },
      { "label": "Lucro Líquido", "value": 500, "currency": true },
      { "label": "Transações", "value": 8, "currency": false }
    ],
    "transactions": [ ... ]
  }
}
```

Errors:
- `400`: quando o range não estiver no formato correto, `from > to`, intervalo maior que 12 meses ou data futura.
- `500`: erro interno ao ler os dados.

### Internal contract

```ts
export type DashboardFilters = {
  dateRange: DateRange;
};
```

### Database Schema

Nenhuma mudança de schema necessária. A feature usa apenas o mock de transações atual.

## UI/UX

**Telas afetadas:**

- Dashboard principal (`src/app/dashboard/page.tsx`)

**Componentes novos:**

- `DateRangeFilter` — inputs de `from` e `to`, botão `Limpar`, estado de erro.
- `DashboardHeader` (opcional) — exibe o intervalo atual ou `Últimos 30 dias`.

**Estados:**

- Loading: componente cliente mostra skeleton/placeholder enquanto as query params são aplicadas.
- Empty: `Nenhuma transação encontrada para o período selecionado.` e métricas zeradas ou ocultas.
- Error: mensagem clara quando `data início > data fim`, intervalo acima de 12 meses ou data futura.
- Success: métricas e tabela atualizadas pelo período solicitado.

## Test Strategy

**Unitários:**

- [ ] `src/lib/date.test.ts` cobre `getDefaultDateRange`, `isValidDateRange`, `exceedsMaxRange`, `isDateInFuture`.
- [ ] `src/lib/api.test.ts` cobre filtragem de `getTransactions` e `getMetrics` pelo intervalo.
- [ ] `src/components/dashboard/DateRangeFilter` valida entrada e estado de botão `Limpar`.

**Integração:**

- [ ] `DashboardPage` com query string válida retorna métricas e transações filtradas.
- [ ] seleção de intervalo inválido não dispara nova busca e exibe erro.
- [ ] limpar filtro retoma `Últimos 30 dias`.

**E2E:**

- [ ] usuário abre dashboard, muda `data início` e `data fim`, e vê métricas/tabela atualizadas.
- [ ] usuário tenta aplicar `from > to` e vê erro de validação.
- [ ] usuário limpa o filtro e volta ao período padrão.

**Edge cases:**

- [ ] intervalo exato de 12 meses é aceito, mas 12 meses + 1 dia é rejeitado.
- [ ] seleção de período sem transações apresenta mensagem de empty.
- [ ] período com `to` igual a hoje inclui o dia corrente completo.

## Delivery Checklist

**Código:**

- [ ] `src/lib/date.ts` — manter utilitários e adicionar validações de intervalo máximos / futuros.
- [ ] `src/lib/api.ts` — aplicar `DashboardFilters` corretamente em `getTransactions` e `getMetrics`.
- [ ] `src/app/dashboard/page.tsx` — receber query params e renderizar `DateRangeFilter` + dashboard.
- [ ] `src/components/dashboard/DateRangeFilter.tsx` — inputs, botão limpar e validação.
- [ ] `src/components/dashboard/MetricsCard.tsx` / `TransactionsTable.tsx` — continuar sendo reutilizados para exibir dados filtrados.

**Validações (sensors):**

- [ ] Linter passa sem erros.
- [ ] Build/compilação sem erros.
- [ ] Scan de segurança/LGPD sem achados críticos.
- [ ] Testes existentes continuam passando.

**Testes novos (escritos pelo QA):**

- [ ] Filtro de período aplica intervalo correto nas métricas.
- [ ] Validação de intervalo inválido bloqueia aplicação e mostra erro.
- [ ] Limpar filtro restaura `Últimos 30 dias`.

## Rollout Plan

- [ ] Feature flag criada e desabilitada.
- [ ] Deploy em staging + teste manual do filtro.
- [ ] Rollout gradual (pelo menos 25% antes de 100%).
- [ ] Monitoramento de uso e erros do filtro ativo.
- [ ] Critério de rollback definido caso o dashboard apresente regressão.

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Intervalo inválido criado pelo usuário | Média | Médio | validar `from <= to`, `max 12 meses`, data não futura e exibir mensagem imediata |
| Inconsistência entre métricas e transações | Baixa | Alto | manter filtro centralizado em `DashboardFilters` e usar as mesmas funções em `getMetrics` e `getTransactions` |
| Mudança do padrão `últimos 30 dias` causa confusão | Média | Médio | exibir label clara `Últimos 30 dias` quando nenhum filtro estiver ativo |
| Rollout direto no dashboard | Média | Alto | usar feature flag e testar em staging antes de liberar |

## Dependencies

- [ ] Decisão de UX sobre botão `Aplicar` vs filtro reativo.
- [ ] Validação dos limites de intervalo (max 12 meses, datas futuras permitidas?).
- [ ] Eventual ajuste no design do header do dashboard para acomodar o filtro.
