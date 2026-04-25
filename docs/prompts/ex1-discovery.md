Estamos na Fase 1 (Discovery) de uma feature de filtro de período no dashboard financeiro piggbank.

Feature: Hoje o dashboard mostra sempre os últimos 30 dias. Queremos permitir que o usuário escolha uma data início e uma data fim para filtrar todas as métricas exibidas.

Quero que você:

1. Faça perguntas de borda que ainda não considerei
2. Identifique riscos (técnico, negócio, operacional)
3. Liste constraints que precisam de definição antes do Spec Doc
4. Gere um arquivo docs/PRD-filtro-periodo.md consolidando o resultado da discovery

## Respostas 

### Perguntas de borda
- O que acontece se a data inicial for maior que a final?
- O sistema permite datas futuras?
- O que ocorre quando não há dados?

### Riscos
- Performance ao filtrar muitos dados
- Problemas de Timezone
- Confusão do usuário

### Constraints 
- Formato de data definido
- Limite de intervalo
- Interface simples

## Relatório de Progresso

Neste exercício ( fase de Discovery ), analisei a necessidade de implementar um filtro de período no dashboard financeiro.
A IA auxiliou na identificação de riscos, perguntas de borda e contrints.
A abordagem foi útil para estruturar melhor a solução antes da implementação.
