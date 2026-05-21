# SPEC — Filtro de Período do Dashboard

Ticket: piggbank-001
Feature: Filtro de período customizado para dashboard financeiro

---

# 1. Objetivo Técnico

Implementar filtro de período baseado em data inicial e data final para atualização dinâmica das métricas financeiras do dashboard.

O filtro deverá atualizar:

* Cards financeiros
* Gráficos
* Tabelas
* Métricas derivadas

Sem quebrar a arquitetura existente do projeto.

---

# 2. Research do Repositório

## Estrutura identificada

### src/lib/api.ts

Responsável pelo acesso centralizado aos dados.

Regra obrigatória:
Nenhum componente poderá acessar mocks diretamente.

---

### src/lib/date.ts

Centraliza manipulação de datas.

Regras:

* Não utilizar `new Date()` diretamente em componentes
* Toda lógica de datas deve utilizar helpers centralizados

---

### src/lib/metrics.ts

Centraliza cálculo de métricas financeiras.

Todas as métricas deverão continuar derivadas das transações filtradas.

---

### src/components/ui/

Biblioteca base de componentes utilizando shadcn/ui.

O datepicker deverá reutilizar componentes existentes sempre que possível.

---

# 3. Arquitetura Proposta

## Fluxo

1. Usuário seleciona data inicial
2. Usuário seleciona data final
3. Estado global do filtro é atualizado
4. Transações são filtradas
5. Métricas são recalculadas
6. Dashboard inteiro re-renderiza com dados filtrados

---

# 4. Estratégia de Estado

Será utilizado estado compartilhado no dashboard para evitar inconsistência entre componentes.

Estratégia sugerida:

* Context API
  ou
* estado no componente pai do dashboard

Objetivo:
Garantir sincronização entre:

* gráficos
* cards
* tabelas

---

# 5. Estratégia de Datas

## Biblioteca

Utilizar:

* date-fns v3

## Padronização

Datas deverão:

* utilizar UTC internamente
* evitar timezone implícito
* utilizar helpers de src/lib/date.ts

---

# 6. Estrutura Proposta

```txt
src/components/dashboard/
  period-filter.tsx

src/lib/
  filters.ts
  date.ts
  metrics.ts

src/types/
  period-filter.ts
```

---

# 7. Interfaces

```ts
interface PeriodFilter {
  startDate: Date | null
  endDate: Date | null
}
```

---

# 8. Estratégia de Filtragem

## Regras

* startDate <= endDate
* bloquear datas inválidas
* bloquear datas futuras
* permitir ranges vazios somente no estado inicial

---

# 9. Comportamento Esperado

## Cenários

### Sem filtro

Sistema mantém últimos 30 dias.

---

### Range válido

Dashboard atualiza completamente.

---

### Sem resultados

Exibir:

* gráficos vazios
* métricas zeradas
* mensagem amigável

---

# 10. Estratégia de Testes

## Unitários

* filtros de data
* validações
* métricas

---

## Integração

* sincronização dashboard
* atualização de gráficos

---

## Coverage

Meta mínima:
80%

Escopo:

* src/lib/**
* src/components/dashboard/**

---

# 11. Critérios Técnicos de Aceite

* Sem uso de any
* Sem acesso direto aos mocks
* Sem uso direto de new Date() em UI
* Todos os componentes sincronizados
* Build funcionando
* Testes passando
* Coverage >= 80%

---

# 12. Riscos Técnicos

* Re-renderizações excessivas
* Inconsistência entre componentes
* Problemas de timezone
* Performance em grandes ranges

---

# 13. Plano Incremental

## Etapa 1

Criar estado de filtro.

---

## Etapa 2

Criar componente de seleção de período.

---

## Etapa 3

Implementar filtragem de transações.

---

## Etapa 4

Conectar métricas.

---

## Etapa 5

Implementar testes.

---

## Etapa 6

Validar build e coverage.

