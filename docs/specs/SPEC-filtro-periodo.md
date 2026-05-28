# Spec Doc: Filtro de Período

## Overview

**Feature:** Filtro de período no dashboard piggbank
**Status:** Draft
**Owner:** [a definir]
**Created:** 2026-05-21
**Updated:** 2026-05-21

**Link PRD:** ../PRD-filtro-periodo.md
**Link Figma:** [a definir]

## Goals

- [ ] Goal 1: Permitir seleção de intervalo de datas para filtrar métricas e transações no dashboard.
- [ ] Goal 2: Garantir que o filtro seja reprodutível via URL e não perca estado após refresh.
- [ ] Goal 3: Fornecer experiência responsiva e acessível em desktop e mobile.

## Scope & Non-Scope

**In Scope:**

- Filtro de período na página `src/app/dashboard/page.tsx`.
- Componente de seleção de data reutilizando `src/components/ui/calendar.tsx` e `src/components/ui/popover.tsx`.
- Atualização de métricas e tabela de transações com base no intervalo.
- Persistência do filtro por query params (`from`, `to`).
- Validação de datas futuras, intervalo invertido e limite máximo de range.

**Out of Scope:**

- Exportação de dados ou relatórios.
- Autenticação/autorizações específicas por usuário.
- Comportamento offline/PWA além do padrão do app.

## Architecture Decisions

### 1. Reuso de componentes shadcn/ui e regras do projeto

**Decision:** usar `src/components/ui/button.tsx`, `src/components/ui/calendar.tsx`, `src/components/ui/popover.tsx` e helpers em `src/lib/date.ts`.

**Alternatives considered:**

1. Criar componente de calendário do zero — trade-off: mais trabalho e ruptura com padrão do projeto.
2. Usar `input[type=date]` nativo em desktop — trade-off: UX inconsistente e menos controle visual.
3. Manter filtro somente em memória sem query params — trade-off: não atende a reprodutibilidade exigida.

**Rationale:**

- O projeto exige reutilizar componentes UI existentes.
- `react-day-picker` já está integrado via `src/components/ui/calendar.tsx`.
- Query params seguem guideline de persistência de filtro e permitem refresh/link sharable.

### API Contract

```
GET /api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=50

Request:
{
  "from": "string — data inicial no formato YYYY-MM-DD",
  "to": "string — data final no formato YYYY-MM-DD",
  "page": "number — opcional",
  "pageSize": "number — opcional"
}

Response (200):
{
  "metrics": [
    { "label": "Faturamento", "value": 12345, "currency": true },
    { "label": "Despesas", "value": 6789, "currency": true },
    { "label": "Lucro Líquido", "value": 5556, "currency": true },
    { "label": "Transações", "value": 12, "currency": false }
  ],
  "transactions": [
    {
      "id": "1",
      "date": "2026-05-10",
      "description": "Assinatura cliente Acme Corp",
      "category": "Assinatura",
      "amount": 12000,
      "type": "income"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 12
  }
}

Errors:
400: Invalid `from`/`to`, `from > to`, `to` no futuro
404: Não aplicável para este endpoint
422: Não aplicável para este endpoint
429: Rate limit exceeded
500: Internal server error
```

### Database Schema

```sql
-- Não há mudança de schema obrigatória para o MVP.
-- Se for necessário, adicionar índice na coluna `date` em `transactions`.
-- Exemplo:
-- CREATE INDEX idx_transactions_date ON transactions(date);
```

## UI/UX

**Telas afetadas:**

- Dashboard principal (`src/app/dashboard/page.tsx`)

**Componentes novos:**

- `DashboardDateRangeFilter` — botão/pill + popover/modal de seleção de datas.
- `DateRangePill` — exibe o intervalo selecionado.

**Estados:**

- Loading: mostrar loader ou texto no lugar dos cards/métricas enquanto o request é processado.
- Empty: exibir mensagem de "Nenhuma transação encontrada para o período selecionado." na tabela.
- Error: mostrar mensagem de validação ou fallback genérico se o API falhar.
- Success: exibir cards de métricas atualizados e tabela de transações filtrada.

## Test Strategy

**Unitários:**

- [ ] Validar funções de data em `src/lib/date.ts`: `formatUrlDate`, `formatDisplayDate`, `isValidDateRange`, `exceedsMaxRange`, `isDateInFuture`.
- [ ] Validar `getTransactions` com filtros aplicados no backend mock.
- [ ] Validar componentes de UI (`DashboardDateRangeFilter`) com seleção de intervalo e erros.

**Integração:**

- [ ] Endpoint `GET /api/dashboard` retorna métricas e transações corretas para `from`/`to`.
- [ ] Verificar leitura de query params na página e aplicação do filtro após reload.

**E2E:**

- [ ] Fluxo crítico: usuário abre dashboard, escolhe preset, aplica filtro e vê métricas + tabela atualizadas.

**Edge cases:**

- [ ] `from > to` deve impedir aplicação.
- [ ] `to` no futuro deve bloquear seleção ou exibir erro.
- [ ] Intervalo máximo de 12 meses não deve ser permitido.
- [ ] Query params inválidos devem cair em fallback seguro.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — componente de filtro de período.
- [ ] `src/app/dashboard/page.tsx` — integra filtro e URL state.
- [ ] `src/lib/api.ts` — `getTransactions` e `getMetrics` devem aceitar `DashboardFilters`.
- [ ] `src/lib/date.ts` — helper de datas e validações.
- [ ] `src/components/ui/calendar.tsx` e `src/components/ui/popover.tsx` — reutilizados para seleção.

**Validações (sensors):**

- [ ] Linter passa sem erros
- [ ] Build/compilação sem erros
- [ ] Scan de segurança/LGPD sem achados críticos
- [ ] Testes existentes continuam passando

**Testes novos (escritos pelo QA):**

- [ ] Validar filtro com presets e intervalo customizado
- [ ] Validar filtro via URL e refresh
- [ ] Validar mensagem de empty state quando não houver transações

## Rollout Plan

- [ ] Feature flag criada e desabilitada
- [ ] Deploy em staging + teste
- [ ] Rollout gradual: 5% → 25% → 50% → 100%
- [ ] Monitoramento ativo durante rollout
- [ ] Critério de rollback definido

## Risks & Mitigations

nn| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Filtro mal validado permite `to` no futuro | Média | Médio | Bloquear no client e validar no backend |
| Request de filtro sem índice em `date` | Baixa/Média | Alto | Garantir índice no banco e paginar resultados |
| URL desincronizada com estado do filtro | Média | Médio | Sincronizar query params com state e fallback à URL |

## Dependencies

- [ ] `src/components/ui/calendar.tsx` ou componente calendar existente — status: disponível
- [ ] `src/components/ui/popover.tsx` — status: disponível
- [ ] `src/lib/date.ts` — status: disponível
- [ ] Backend/api com suporte a `from` e `to` — status: precisa implementar

## Checklist de aprovação

- [ ] Goals claros e mensuráveis
- [ ] Scope definido (in/out)
- [ ] Architecture decisions documentadas com trade-offs
- [ ] API contract definido
- [ ] Test strategy cobre caminho feliz + edge cases
- [ ] Rollout plan com feature flag
- [ ] Riscos identificados com mitigação
