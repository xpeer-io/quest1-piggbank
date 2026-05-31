# PRD: Filtro de Período no Dashboard

## Visão Geral

**Feature:** Permitir que o usuário escolha uma data inicial e uma data final para filtrar todas as métricas exibidas no dashboard financeiro do piggbank.

**Contexto atual:** o dashboard sempre mostra os últimos 30 dias por padrão.

**Objetivo:** oferecer maior controle e flexibilidade para análise de resultados, reduzindo a dependência de um filtro fixo e melhorando a precisão da visão financeira.

---

## Discovery

### 1. Perguntas importantes ainda não consideradas

- O filtro deve funcionar apenas no dashboard principal ou também em outras páginas relacionadas a transações e histórico?
- O período selecionado deve incluir/excluir automaticamente o dia final no cálculo das métricas?
- Qual é o comportamento esperado quando a data inicial é posterior à data final?
- Deve haver um limite máximo de alcance entre as datas (por exemplo, 1 ano) para evitar quedas de performance ou dados muito volumosos?
- O filtro precisa considerar transações com horário ou apenas a data do evento?
- Como tratar períodos futuros? Deve ser permitido incluir datas após hoje?
- Deveríamos manter o default de "últimos 30 dias" quando o usuário não selecionar um período?
- O estado do filtro deve ser preservado ao navegar entre telas ou recarregar a página?
- Há necessidade de manter um botão de limpar filtro / voltar ao padrão de 30 dias?
- Como o filtro afeta métricas derivadas, como saldo acumulado, receitas, despesas e pendências?
- Precisamos exibir alguma mensagem quando não houver transações no período selecionado?
- Devemos suportar seleção manual de intervalos curtos (ex: um dia) e longos (ex: vários meses)?
- Há regras de negócio sobre o período mínimo permitido (por exemplo, 1 dia) ou períodos inválidos?
- O filtro deve ser aplicado só após clicar em "Aplicar" ou em tempo real após selecionar as datas?
- Precisamos de validação com feedback imediato para inputs de data inválidos ou incompletos?
- O design deve ser responsivo e funcionar em mobile, tablet e desktop?

### 2. Riscos identificados

#### Riscos técnicos

- O backend pode não suportar consultas arbitrárias de período sem ajustes, o que pode causar lentidão em períodos muito grandes.
- Cálculo de métricas pode ter dependências em lógica de tempo que assume janela fixa de 30 dias.
- A implementação pode duplicar lógica de filtragem em diferentes camadas (UI, client, server), abrindo espaço para inconsistências.
- Uso de datas sem normalização pode gerar bugs com timezone e inclusão/exclusão do dia final.
- Falta de testes para intervalos limites pode permitir regressões em casos de borda.

#### Riscos de negócio

- Usuários podem criar períodos irrelevantes ou muito longos, dificultando a interpretação das métricas.
- Se o filtro não for intuitivo, o usuário pode achar que os dados estão incorretos ou incompletos.
- Períodos futuros podem levar a resultados enganadores se transações previstas não existirem.
- A nova funcionalidade pode aumentar o tempo de suporte se não houver mensagens claras para casos sem dados.

#### Riscos operacionais

- Alterações no dashboard podem impactar QA e testes manuais, exigindo validação de múltiplas combinações de intervalos.
- Se houver estado persistente do filtro, a migração de sessões ou cache pode gerar inconsistências.
- Dependências em componentes de data existentes podem precisar de ajuste para o novo comportamento.

### 3. Restrições e decisões que precisam ser definidas antes da implementação

- Escopo exato: o filtro será apenas no dashboard financeiro ou também em outras vistas relacionadas?
- Comportamento do dia final: incluir o último dia no intervalo ou tratar como exclusivo?
- Restrições de período: existe um alcance máximo ou mínimo entre as datas?
- Períodos futuros: permitidos ou bloqueados?
- Persistência: o intervalo deve ser mantido no estado da UI, na URL ou em local storage?
- A filtragem acontece no frontend apenas ou requer ajuste no backend/API?
- Mensagem de estado vazio: qual texto e ação sugerida quando não houver transações?
- Validação de entrada: aceitar apenas datas válidas no formato esperado e exibir erro imediato.
- Default: manter "últimos 30 dias" sempre que o filtro estiver limpo?
- Acesso mobile: existe um design definido para seleção de intervalo em dispositivos menores?

### 4. Resumo de requisitos e hipóteses

**Requisitos principais**

- Usuário pode selecionar data inicial e data final.
- O dashboard filtra todas as métricas exibidas a partir do período selecionado.
- A seleção deve ser clara e controlável, com opção de limpar/resetar para o padrão.
- A interface deve informar quando não há dados para o período escolhido.
- Deve haver validação de período inválido e feedback de erro.

**Hipóteses**

- A maior parte dos usuários quer flexibilidade além dos últimos 30 dias.
- Um filtro de período ficará mais intuitivo se o dia final for incluído no intervalo.
- O padrão de exibição pode continuar sendo os últimos 30 dias sempre que o filtro estiver desativado.

---

## Próximos passos sugeridos

- Validar com produto/design o comportamento de dia final e períodos futuros.
- Confirmar se o backend precisa expor um endpoint de filtro ou se já é possível reaproveitar a lógica atual.
- Definir o limite de alcance do filtro e o comportamento de período inválido.
- Produzir o Spec Doc em `docs/specs/SPEC-filtro-periodo.md` com os critérios de aceite e arquitetura.
