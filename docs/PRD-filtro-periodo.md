# PRD: Filtro de Período no Dashboard Piggbank

## 📝 Visão Geral
Atualmente, o dashboard do Piggbank exibe métricas fixas dos últimos 30 dias. O objetivo desta feature é permitir que o usuário selecione um intervalo de datas personalizado (início e fim) para filtrar métricas e transações, oferecendo maior flexibilidade na análise financeira.

## 🎯 Objetivos
- Permitir a seleção de um intervalo de datas (Date Range).
- Atualizar automaticamente métricas de faturamento, despesas e fluxo de caixa com base no período.
- Filtrar a tabela de transações pelo período selecionado.

## 🔍 Discovery: Perguntas de Borda e Riscos

### Perguntas de Borda
1. **Limites de Data:** Existe um limite máximo para o intervalo (ex: no máximo 1 ano)?
2. **Datas Vazias:** Como o sistema deve se comportar se não houver transações no período selecionado?
3. **Persistência:** O filtro deve ser mantido ao recarregar a página (URL params) ou apenas em memória?
4. **Fuso Horário:** Como lidar com transações feitas em fusos horários diferentes da visualização do usuário?
5. **Datas Futuras:** O usuário pode selecionar datas no futuro? Se sim, o que deve aparecer?

### Riscos Identificados
- **Técnico:** Desempenho ao filtrar grandes volumes de transações no lado do cliente (se as transações forem muitas).
- **Negócio:** Inconsistência entre métricas se o filtro não for aplicado uniformemente em todos os componentes.
- **Operacional:** Dificuldade de uso se o seletor de data (Date Picker) não for intuitivo em dispositivos móveis.

### Constraints (Restrições)
- Deve usar o componente de calendário do `shadcn/ui`.
- Deve respeitar as funções utilitárias de data em `src/lib/date.ts`.
- O estado do filtro deve ser centralizado para que todos os componentes reflitam os mesmos dados.

## 🚀 Requisitos Funcionais
1. O usuário deve clicar em um botão de filtro para abrir um calendário.
2. O calendário deve permitir selecionar uma data de início e uma data de fim.
3. Um botão "Limpar" deve resetar para o período padrão (últimos 30 dias).
4. O dashboard deve exibir "Nenhum dado encontrado" se o filtro resultar em zero transações.

## 📏 Critérios de Sucesso
- Filtro funcionando em 100% dos casos de intervalo válido.
- Tempo de resposta perceptível abaixo de 200ms após a seleção.
- Cobertura de testes unitários para a lógica de filtragem.
