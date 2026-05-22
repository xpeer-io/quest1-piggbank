# AI-REVIEW.md

# Pigbank Quest 4

## Prompt utilizado:

@workspace

aja como um Arquiteto de Software Sênior extremamente rigoroso com:

- Clean Code
- SOLID
- DRY
- componentização
- manutenibilidade
- reutilização de código

Analise os arquivos relacionados a tabela de transações e aos modais de criação e edição.


Quero um code review completo apontando:

- duplicação de código
- problemas arquiteturais
- responsabilidades mal separadas
- problemas de componentização
- oportunidades de refatoração
- melhorias de legibilidade
- melhorias de tipagem

Depois gere:

1. Um relatório estruturado dos problemas encontrados
2. Um plano de refatoração passo a passo
3. Sugestões alinhadas ao padrão atual do projeto
4. Refatorações sem quebrar o Design System existente



# Como foi o processo

implementei as funcionalidades de edição e exclusão de transações da forma mais direta possível, focando em fazer tudo funcionar.

sem o codigo reviewn , ele ainda possuia algumas duplicações, principalmente entre os modais de criação e edição de transações. Além disso, algumas responsabilidades para as funcionalidade(modal) estavam concentradas em um único componente, deixando a estrutura menos reutilizável e mais difícil de manter.

Após a implementação inicial, utilizei o Copilot como apoio para realizar um AI-Driven Code Review, simulando a analise de um Arquiteto de Software Sênior. foram realizadas outras interações para entendimento do que ela tratava o refatoramento.

A IA analisou os componentes do projeto e apontou diversos problemas relacionados à organização, reutilização e separação de responsabilidades.



# Principais problemas encontrados pela IA

- Duplicação de código entre o modal de criação e o modal de edição
- lógica de formulário concentrada dentro do modal
- formatação de valores feitos diretamente no componente
- pouca reutilização de código
- responsabilidades misturadas dentro dos componentes
- dificuldade de manutenção futura caso o formulário crescesse

Além disso, a IA sugeriu melhorar a componentização e separar partes reutilizáveis da lógica da aplicação.



# Refatorações realizadas

- Criação de um componente reutilizável TransactionForm
- Separação da légica do formulário da estrutura visual do modal
- Extração das funções de moeda para um arquivo utilitário currency.ts
- Melhoria na organização dos componentes
- Redução de duplicação entre criação e edição de transações
- Melhor reutilização de código e legibilidade

As refatorações foram feitas mantendo o padrão visual e o Design System já existente no projeto.



# O que eu aprendi

- ajudou bastante a entender como a IA pode auxiliar não apenas na gerar código, mas também na revisão de um projeto.
- separar responsabilidades dos componentes
- evitar duplicação de código
- melhorar a organização do projeto
- pensar em manutenção futura do código
- alem do clean code na prática da reafatoração da IA.
