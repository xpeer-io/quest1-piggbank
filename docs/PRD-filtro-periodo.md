# PRD — Filtro de Período do Dashboard Financeiro

## 1. Visão Geral

Atualmente o dashboard financeiro do piggbank exibe métricas considerando automaticamente os últimos 30 dias.

O objetivo desta feature é permitir que o usuário selecione uma data inicial e uma data final para filtrar todas as métricas, gráficos e transações exibidas no dashboard.

---

# 2. Objetivo da Feature

Permitir análise financeira personalizada por período, aumentando flexibilidade e capacidade analítica do dashboard.

A funcionalidade deverá atualizar dinamicamente:

* Faturamento
* Despesas
* Lucro líquido
* Quantidade de transações
* Tabelas
* Gráficos
* Métricas derivadas

---

# 3. Perguntas de Discovery (Edge Cases)

## Regras de intervalo

* O sistema permitirá selecionar apenas um único dia?
* Existe limite máximo de intervalo? (30 dias, 1 ano, ilimitado?)
* O que acontece se a data inicial for maior que a data final?
* O filtro aceitará datas futuras?
* O sistema deve considerar horário ou apenas datas?

---

## Timezone

* Qual timezone oficial da aplicação?
* Usuários em fusos diferentes visualizarão dados diferentes?
* Datas serão armazenadas em UTC?
* Como tratar horário de verão?

---

## UX

* O filtro será aplicado automaticamente ou terá botão “Aplicar”?
* O usuário poderá limpar o filtro?
* Haverá atalhos rápidos? (Hoje, 7 dias, 30 dias, 90 dias)
* O período selecionado deve persistir ao atualizar a página?
* O filtro ficará global no dashboard inteiro?

---

## Dados vazios

* O que exibir quando não houver dados no período?
* Mostrar gráficos vazios ou mensagens amigáveis?
* Os cards devem mostrar zero ou “sem dados”?

---

## Performance

* O filtro será feito no frontend ou backend?
* Qual impacto caso existam milhares de transações?
* Será necessário cache?
* Os dados serão recalculados em tempo real?

---

## Exportações e relatórios

* O filtro deve impactar exportação CSV/PDF?
* O período selecionado deve aparecer nos relatórios?
* O filtro poderá ser reutilizado em outras telas futuramente?

---

# 4. Riscos Identificados

## Riscos Técnicos

* Inconsistência entre cards e tabelas
* Problemas de timezone
* Re-renderizações excessivas
* Falhas de sincronização de estado
* Performance ruim com grande volume de dados
* Bugs em ranges inválidos
* Dependência excessiva de estado global

---

## Riscos de Negócio

* Usuário interpretar métricas incorretamente
* Dados financeiros inconsistentes
* Falta de clareza sobre período aplicado
* Comparações financeiras incorretas

---

## Riscos Operacionais

* Falta de testes automatizados
* Regressões em componentes existentes
* Exportações futuras incompatíveis
* Dificuldade de manutenção sem padronização

---

# 5. Constraints e Decisões Necessárias

## Regras Funcionais

* Definir limite máximo de período
* Definir comportamento para datas futuras
* Definir timezone oficial
* Definir persistência do filtro
* Definir comportamento padrão inicial

---

## Arquitetura

* Estado global ou local
* Estratégia de cache
* Estratégia de atualização dos gráficos
* Padronização de datas

---

## UI/UX

* Tipo do datepicker
* Responsividade mobile
* Feedback visual de carregamento
* Estados vazios
* Acessibilidade

---

# 6. Requisitos Funcionais

## RF01

Usuário deve conseguir selecionar data inicial.

## RF02

Usuário deve conseguir selecionar data final.

## RF03

Dashboard deve atualizar métricas automaticamente após aplicação do filtro.

## RF04

Todas as tabelas e gráficos devem refletir o período selecionado.

## RF05

Sistema deve impedir ranges inválidos.

## RF06

Sistema deve exibir feedback quando não houver dados.

---

# 7. Requisitos Não Funcionais

## RNF01

Atualização do dashboard deve ocorrer em menos de 2 segundos.

## RNF02

A feature deve funcionar em dispositivos mobile.

## RNF03

A interface deve seguir critérios básicos de acessibilidade.

## RNF04

O sistema deve possuir testes automatizados para regras de filtro.

---

# 8. Estratégia Técnica Inicial

Sugestão inicial:

* Criar estado centralizado para período selecionado
* Padronizar datas em UTC
* Criar utilitário de comparação de datas
* Utilizar memoização para evitar cálculos desnecessários
* Garantir sincronização entre cards, tabelas e gráficos

---

# 9. Estratégia de Testes

## Testes Unitários

* Validação de ranges
* Comparação de datas
* Filtros corretos

---

## Testes de Integração

* Atualização simultânea dos componentes
* Persistência do filtro
* Estados vazios

---

## Testes E2E

* Seleção manual de datas
* Navegação mobile
* Fluxo completo do dashboard

---

# 10. Critérios de Aceite

* Usuário consegue selecionar intervalo personalizado
* Todas as métricas atualizam corretamente
* Não existem inconsistências entre componentes
* Datas inválidas são bloqueadas
* Estado vazio é tratado corretamente
* Funciona em desktop e mobile
* Testes automatizados passam com sucesso

---

# 11. Possíveis Evoluções Futuras

* Comparação entre períodos
* Filtros rápidos pré-definidos
* Exportação por período
* Compartilhamento de links com filtros
* Dashboard analítico avançado
