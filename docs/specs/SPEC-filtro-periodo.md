# Spec Doc: Filtro por Período (Dashboard)

## Overview

**Feature:** Permitir seleção de período (data de início + data fim) para filtrar todas as métricas e tabelas do dashboard.
**Status:** Draft
**Owner:** TBD
**Created:** 2026-05-15
**Updated:** 2026-05-15

**Link PRD:** [PRD: Filtro por Período](../PRD-filtro-periodo.md)

## Goals

- Goal 1: Usuário consegue selecionar `start` e `end` e ver métricas atualizadas para o período.
- Goal 2: Reutilizar utilitários e componentes existentes (`src/lib/date.ts`, `src/components/ui/Calendar`).
- Goal 3: Evitar cargas pesadas agregando quando o intervalo exceder limites (definidos em `src/lib/date.ts`).

## Scope & Non-Scope

**In Scope:**

- Componente `DateRangeFilter` no header do dashboard (client component).
- Serialização do filtro em URL query params: `?start=YYYY-MM-DD&end=YYYY-MM-DD`.
- Integração com `src/lib/api.ts` e uso de `DashboardFilters` (`dateRange`).
- Validações de intervalo (start <= end, end ≤ hoje salvo opção de planejamento).

**Out of Scope:**

- Backend de produção (atualmente `src/lib/api.ts` usa `mockTransactions`); este Spec exige apenas contrato e testes de integração locais.
- Persistência de preferência do usuário (será futura iteração).

## Architecture Decisions

### 1. Reutilizar utilitários de data existentes

**Decision:** usar `src/lib/date.ts` para formatação, validação e limites (`DATE_URL_FORMAT`, `MAX_DATE_RANGE_MONTHS`, `isValidDateRange`, `exceedsMaxRange`).

**Alternatives considered:**

1. Criar utilitários novos — descartado (duplicação, padronização já definida).
2. Usar `new Date()` diretamente na UI — proibido pelo padrão do projeto.

**Rationale:** centralizar lógica de datas reduz bugs de timezone/formato e já existe cobertura de testes em `src/lib/date.test.ts`.

### 2. UI: compor `DateRangeFilter` com `Calendar` do `src/components/ui`

**Decision:** `DateRangeFilter` será um client component que usa o `Calendar`/Date-picker já disponível em `src/components/ui/calendar.tsx` e expõe presets (7,30,90 dias).

**Rationale:** segue padrão de componentes do projeto e garante acessibilidade e consistência visual.

### 3. Limite e agregação

**Decision:** se `exceedsMaxRange(range)` for true (usa `MAX_DATE_RANGE_MONTHS`), a UI exibirá aviso e o backend/consulta aplicará agregação (por mês) automaticamente.

**Rationale:** protege o backend de queries muito pesadas e mantém UX previsível.

### API Contract

GET /api/transactions?start=YYYY-MM-DD&end=YYYY-MM-DD

Request params:
  - `start` (string, required) — data inicial em `yyyy-MM-dd` (usar `formatUrlDate`)
  - `end` (string, required) — data final em `yyyy-MM-dd`

Response 200:
```
{
  "transactions": [
    { "id": string, "description": string, "amount": number, "type": "income|expense", "date": "YYYY-MM-DD", "category": string }
  ]
}
```

GET /api/metrics?start=YYYY-MM-DD&end=YYYY-MM-DD

Request params: same como acima.

Response 200:
```
{
  "metrics": [ { "label": string, "value": number, "currency": boolean } ],
  "metadata": { "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "aggregation": "day|month" }
}
```

Notes:
- Internamente o projeto já expõe `getTransactions(filters: DashboardFilters)` e `getMetrics(filters: DashboardFilters)` (em `src/lib/api.ts`). A implementação final deve mapear os query params para `DashboardFilters.dateRange: { from: Date, to: Date }` usando `formatUrlDate`/parsing apropriado no servidor.

### Database Schema

Não são necessárias alterações no schema para suportar filtro por período — consultas sobre a tabela de transações devem filtrar por coluna `date`.

## UI/UX

**Telas afetadas:**

- `Dashboard` (header): adiciona `DateRangeFilter` no canto superior direito.

**Componentes novos:**

- `src/components/dashboard/DateRangeFilter.tsx` (client): props:
  - `value?: DateRange` (inicial)
  - `onChange(range: DateRange)` — notificar alteração
  - `presets?: string[]` — padrão: [7,30,90]

**Comportamento:**
- Ao aplicar, atualiza rota com `?start=YYYY-MM-DD&end=YYYY-MM-DD` sem full reload (use router.replace).
- Se `exceedsMaxRange(range)`, mostrar badge/tooltip com opção de "Aplicar com agregação por mês".

**Estados:**

- Loading: componente mostra skeleton enquanto carrega dados (se necessário).
- Empty: quando não há transações no período, mostrar mensagem e CTA para selecionar outro período.
- Error: mensagem de erro e opção de tentar novamente.
- Success: dashboard renderiza métricas e tabela filtradas.

## Test Strategy

**Unitários:**
- `DateRangeFilter`:
  - renderiza presets
  - valida `start <= end`
  - serializa corretamente para URL (usa `formatUrlDate`)

- `src/lib/date.ts` já tem cobertura; garantir integridade ao integrar o componente.

**Integração:**
- `getMetrics`/`getTransactions` recebem `DashboardFilters` e retornam dados corretos para vários ranges (usar mocks existentes `src/data/mock.ts`).

**E2E:**
- Fluxo: abrir dashboard → selecionar período → aplicar → URL atualiza → métricas e tabela atualizam.

**Edge cases:**
- Intervalo invertido (start > end) → UI impede envio.
- Intervalo vazio (sem transações) → comportamentos de Empty state.
- Intervalo maior que `MAX_DATE_RANGE_MONTHS` → aplicação de agregação e aviso.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — componente e testes
- [ ] Atualizar `src/app/dashboard/page.tsx` para usar `DateRangeFilter` (substituir TODO)
- [ ] `src/lib/api.ts` — garantir mapeamento de `DashboardFilters` para query params quando houver backend real
- [ ] Documentação: `docs/PRD-filtro-periodo.md` (PR já gerado)

**Validações (sensors):**

- [ ] Linter e build passam
- [ ] Testes unitários aumentados e `vitest` OK

**Testes novos (QA):**
- [ ] Teste de integração `getMetrics` com filtros
- [ ] Teste E2E do fluxo do usuário

## Rollout Plan

- Feature flag `piggbank-filtro-periodo` controlando render do `DateRangeFilter`.
- Deploy em staging + smoke tests.
- Rollout gradual: 5% → 25% → 100% monitorando tempo de resposta e erro.

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Queries longas sobre muitas transações | Média | Alto | Aplicar agregação por mês quando `exceedsMaxRange` for true; paginar resultados |
| Divergência de formatos de data na URL | Baixa | Médio | Usar `DATE_URL_FORMAT` de `src/lib/date.ts` e validar no servidor |
| UX confusa ao selecionar intervalos muito longos | Baixa | Médio | Mostrar aviso e opção explícita de agregação |

## Dependencies

- `src/lib/date.ts` (DATE_URL_FORMAT, MAX_DATE_RANGE_MONTHS, helpers)
- `src/components/ui/calendar.tsx` (componente de calendário)
- `src/lib/api.ts` (contrato de obtenção de métricas/transações)

## Checklist de aprovação

- [ ] Goals e Scope aprovados
- [ ] API contract validado com backend/owner
- [ ] Test strategy aprovada
- [ ] Rollout plan com feature flag definido
