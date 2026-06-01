# Spec Doc: Filtro de Período

## Overview

**Feature:** Filtro de período para dashboard financeiro
**Status:** Draft
**Owner:** Marcelo Augusto Penteado Conceição
**Created:** 2026-04-16
**Updated:** 2026-04-16

**Link PRD:** docs/PRD-filtro-periodo.md
**Link Figma:** Não aplicável

## Goals

- [ ] Goal 1: Permitir que o usuário selecione um intervalo de datas
- [ ] Goal 2: Melhorar a análise de métricas financeiras 
- [ ] Goal 3: Filtrar dados do dashbord em tempo real

## Scope & Non-Scope

**In Scope:**

- Seleção de data inicial e final
- Atualização das métricas do dashbord
- Validação de datas inválidas

**Out of Scope:**

- Comparação entre períodos
- Exportação de dados

## Architecture Decisions

### 1. Filtro de dados no frontend

**Decision:** Aplicar filtro diretamente no frontend utilizando os dados carregados, seguindo os padrões do projeto.

- Manipulação de datas será feita com date-fins
- Datas serão tratadas via funções de src/lib/date.ts (evitando o uso direto de new Date())
- Dados serão obtidos via src/lib/api.ts


**Alternatives considered:**

1. Filtrar no frontend - menos requisições, resposta mais rápida
2. Filtrar no backend - mais escalável para grandes volumes
3. Filtrar via API - maior complexidade de implementação

**Rationale:**

- Simplicidade de implementação
- Projeto pequeno
- Resposta rápida para o usuário

### API Contract

```
GET /api/v1/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

- Datas devem estar no formato ISO (YYYY-MM-DD)
- Backend deve validar se startDate <= endDate

Request:
{
  "startDate": "2026-04-01",
  "endDate": "2026-04-16"
}

Response (200):
{
  "data": { ... },
  "metadata": { ... }
}

Errors:
400: Datas inválidas
404: Nenhun dado encontrado
422: Intervalo de datas inválido
429: Rate limit exceeded
500: Internal server error
```

### Database Schema

```sql
-- Mudanças necessárias no schema
-- Use migrations (Flyway, Prisma, EF Core, Alembic)
```

## UI/UX

**Telas afetadas:**

- Dashboard financeiro: adição de filtrode data (data início e data fim)

**Componentes novos:**

- DateRangePicker: Selecionar data inicial e final
- FilterButton: Aplicar o filtro no dashboard

**Estados:**

- Loading: Exibir loader enquanto os dados são carregados
- Empty: Mostrar mensagem "Nenhum dado encontrado"
- Error: Exibir erro ao buscar dados
- Success: Exibir métricas filtradas corretamente

## Test Strategy

**Unitários:**

- [ ] Validar datas válidas
- [ ] Validar erro quando data inicial > final

**Integração:**

- [ ] Endpoint retorna dados filtrados corretamente
- [ ] Endpoint retorna erro para intervalo inválido

**E2E:**

- [ ] Usuário seleciona período e visualiza dados filtrados

**Edge cases:**

- [ ] Data inicial maior que final
- [ ] Datas futuras

## Delivery Checklist

Lista concreta de entregáveis. O Developer implementa cada item; o QA valida um a um.
Essa lista é o **contrato** entre os dois agentes — itens fora dela não são cobrados pelo QA.

**Código:**

- [ ] Endpoint GET /transactions com filtro por data
- [ ] Componente DateRangePicker no dashboard
- [ ] Integração do filtro com API

**Validações (sensors):**

- [ ] Linter passa sem erros
- [ ] Build/compilação sem erros
- [ ] Scan de segurança/LGPD sem achados críticos
- [ ] Testes existentes continuam passando

**Testes novos (escritos pelo QA):**

- [ ] Filtro retorna dados corretos dentro do período (mín: 1/1)
- [ ] Erro quando data inicial > final (mín: 2/2)
- [ ] Retorno vazio quando não há dados (mín: 1/1)

> Os itens de **Código** são preenchidos pelo `plan-architect` durante o planejamento.
> Os itens de **Testes novos** são derivados da seção Test Strategy acima.
> O `developer` implementa os itens de Código; o `qa` escreve e executa os Testes novos.
> Ambos usam esta lista como fonte de verdade.

## Rollout Plan

- [ ] Feature flag criada e desabilitada
- [ ] Deploy em staging + teste
- [ ] Rollout gradual: 5% → 25% → 50% → 100%
- [ ] Monitoramento ativo durante rollout
- [ ] Critério de rollback definido

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Performance de filtrar dados | Média | Médio | Paginação e otimização de query |
| Usuário escolher datas inválidas | Alta | Baixo | Validação no frontend e backend |

## Dependencies

- [ ] API de transações disponível - OK
- [ ] Biblioteca de date picker - OK

## Checklist de aprovação

- [ ] Goals claros e mensuráveis
- [ ] Scope definido (in/out)
- [ ] Architecture decisions documentadas com trade-offs
- [ ] API contract definido
- [ ] Test strategy cobre caminho feliz + edge cases
- [ ] Rollout plan com feature flag
- [ ] Riscos identificados com mitigação
````