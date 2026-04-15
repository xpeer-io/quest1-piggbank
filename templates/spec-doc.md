# Template: Spec Doc

Use este template para especificar tecnicamente uma feature antes da implementação. O Spec Doc é o contrato entre o que foi planejado e o que será construído.

Veja [Anti-Vibe Coding](../docs/anti-vibe-coding.md) e [SDD no glossário](../docs/glossario.md).

---

````markdown
# Spec Doc: [Nome da Feature]

## Overview

**Feature:** [Uma frase sobre o que é]
**Status:** Draft / In Review / Approved
**Owner:** [dev responsável]
**Created:** YYYY-MM-DD
**Updated:** YYYY-MM-DD

**Link PRD:** [link no tracker]
**Link Figma:** [link do design]

## Goals

- [ ] Goal 1: [Resultado mensurável esperado]
- [ ] Goal 2: [Problema que resolve]
- [ ] Goal 3: [Capacidade que habilita]

## Scope & Non-Scope

**In Scope:**

- [Feature/comportamento incluído]
- [Feature/comportamento incluído]

**Out of Scope:**

- [Feature/comportamento excluído — futura iteração]
- [Feature/comportamento excluído — fora do produto]

## Architecture Decisions

### 1. [Decisão técnica principal]

**Decision:** [O que foi decidido]

**Alternatives considered:**

1. [Opção escolhida] — [trade-offs]
2. [Alternativa 1] — [trade-offs]
3. [Alternativa 2] — [trade-offs]

**Rationale:**

- [Motivo 1]
- [Motivo 2]
- [Motivo 3]

### API Contract

```
[Método] /api/v1/[recurso]

Request:
{
  "field1": "type — descrição",
  "field2": "type — descrição"
}

Response (200):
{
  "data": { ... },
  "metadata": { ... }
}

Errors:
400: [Quando retorna]
404: [Quando retorna]
422: [Quando retorna]
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

- [Tela 1 — o que muda]
- [Tela 2 — o que muda]

**Componentes novos:**

- [Componente 1 — responsabilidade]
- [Componente 2 — responsabilidade]

**Estados:**

- Loading: [comportamento]
- Empty: [comportamento]
- Error: [comportamento]
- Success: [comportamento]

## Test Strategy

**Unitários:**

- [ ] [Caso de teste 1]
- [ ] [Caso de teste 2]

**Integração:**

- [ ] [Endpoint/fluxo 1]
- [ ] [Endpoint/fluxo 2]

**E2E:**

- [ ] [Fluxo crítico do usuário]

**Edge cases:**

- [ ] [Cenário limite 1]
- [ ] [Cenário limite 2]

## Delivery Checklist

Lista concreta de entregáveis. O Developer implementa cada item; o QA valida um a um.
Essa lista é o **contrato** entre os dois agentes — itens fora dela não são cobrados pelo QA.

**Código:**

- [ ] [Arquivo/função/endpoint 1 — o que faz]
- [ ] [Arquivo/função/endpoint 2 — o que faz]
- [ ] [Arquivo/função/endpoint 3 — o que faz]

**Validações (sensors):**

- [ ] Linter passa sem erros
- [ ] Build/compilação sem erros
- [ ] Scan de segurança/LGPD sem achados críticos
- [ ] Testes existentes continuam passando

**Testes novos (escritos pelo QA):**

- [ ] [Teste 1 — cenário que valida] (mín: 1/1)
- [ ] [Teste 2 — cenário que valida] (mín: 2/2)
- [ ] [Teste 3 — cenário que valida] (mín: 1/1)

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
| [Risco 1] | Baixa/Média/Alta | Baixo/Médio/Alto | [Ação preventiva] |
| [Risco 2] | Baixa/Média/Alta | Baixo/Médio/Alto | [Ação preventiva] |

## Dependencies

- [ ] [Dependência 1 — status]
- [ ] [Dependência 2 — status]

## Checklist de aprovação

- [ ] Goals claros e mensuráveis
- [ ] Scope definido (in/out)
- [ ] Architecture decisions documentadas com trade-offs
- [ ] API contract definido
- [ ] Test strategy cobre caminho feliz + edge cases
- [ ] Rollout plan com feature flag
- [ ] Riscos identificados com mitigação
````
