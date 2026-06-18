# PRD: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir que o usuário escolha data de início e data de fim para filtrar o dashboard financeiro.

**Contexto atual:** Hoje o dashboard sempre mostra os últimos 30 dias de dados.

**Objetivo:** dar ao usuário controle explícito sobre o intervalo de tempo das métricas exibidas, mantendo a experiência simples e segura.

## Perguntas de borda

1. Qual é o comportamento quando o usuário define `data início` maior que `data fim`?
2. Até que tamanho de intervalo devemos permitir? Existe limite máximo de dias, meses ou anos?
3. O filtro deve suportar apenas intervalos completos de dias ou também horas/minutos?
4. O usuário deve conseguir limpar o filtro e voltar aos últimos 30 dias com um único clique?
5. Como tratamos datas futuras? Permitimos seleção de períodos que ainda não aconteceram?
6. O filtro deve ser persistido no estado da sessão ou apenas enquanto a página estiver aberta?
7. Se o usuário não selecionar nada, o comportamento padrão permanece os últimos 30 dias?
8. O filtro é aplicado em todas as métricas e tabelas do dashboard imediatamente ou serve de “filtro global” com botão de aplicar?
9. Há necessidade de validação de período mínimo? Por exemplo, não permitir intervalos de 1 dia ou menos?
10. Em caso de erro na leitura de dados, devemos mostrar mensagem específica para o período selecionado?

## Riscos

### Riscos técnicos

- `Timezone` e conversão de datas podem gerar filtros incorretos se o usuário estiver em fuso diferente do servidor.
- Dados mockados / API atual podem não estar preparados para filtro de intervalo customizado, exigindo mudança em `src/lib/api.ts` e `src/lib/metrics.ts`.
- Filtro aplicado no cliente pode causar inconsistência entre métricas e tabela se o mesmo critério não for centralizado.
- Validação de intervalos inválidos pode gerar UX confusa se não houver feedback claro.

### Riscos de negócio

- Usuário pode interpretar errado os dados se o filtro afetar apenas algumas métricas e não todas.
- Permitir datas futuras pode levar a expectativas incorretas sobre projeções, mesmo que não haja dados.
- Limites de intervalo mal definidos podem esconder resultados importantes ou tornar comparações imprecisas.

### Riscos operacionais

- Mudança no comportamento padrão (`últimos 30 dias`) pode impactar relatórios existentes e tornar o dashboard menos previsível.
- Documentação e comunicação com QA podem falhar se não houver critério claro para filtros inválidos e estado inicial.
- Rollout sem feature flag pode causar regressão imediata para todos os usuários.

## Constraints a definir antes do Spec Doc

- Regra do valor padrão: o dashboard deve continuar mostrando últimos 30 dias quando nenhuma data for escolhida.
- Como tratar período inválido: `data início > data fim`, intervalo negativo, datas futuras.
- Escopo de persistência: manter seleção apenas na sessão atual ou salvar no browser / query string.
- Limites de intervalo: existe prazo máximo (ex: 1 ano) ou mínimo (ex: 1 dia)?
- Se a data final for hoje, o filtro deve incluir o dia corrente completo ou até o momento atual?
- Precisa existir botão `Aplicar` ou o filtro deve ser reativo imediatamente ao selecionar as datas?
- O filtro deve alterar somente o dashboard atual ou também o histórico de transações em outras telas no futuro?
- Qual feedback visual aparece quando não há transações no período escolhido?

## Resultados esperados da discovery

- Criar UI simples de filtro de período com `Data início` e `Data fim`.
- Preservar comportamento padrão dos últimos 30 dias quando o filtro estiver vazio.
- Aplicar o mesmo período para todas as métricas exibidas no dashboard.
- Garantir validações claras e preventivas para intervalos inválidos.
- Definir regras de rollout e feature flag para reduzir impacto operacional.

## Próximos passos

1. Validar as respostas para as perguntas de borda com PM / UX.
2. Definir os limites de intervalo e política de datas futuras.
3. Decidir se o filtro será visualizado como `filtro global` com botão de aplicar ou reativo.
4. Escrever o Spec Doc com API contract, arquitetura, UI/UX e test strategy.
5. Preparar rollout com feature flag e checklist de QA.
