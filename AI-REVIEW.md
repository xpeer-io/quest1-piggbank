# AI-Driven Code Review — QUEST4 Piggbank

## Atividade

Desafio: Evolução do Piggbank — AI-Driven Code Review e Refatoração Pragmática

## Funcionalidade

Edição e Exclusão de Transações

## Aluno

Leonardo Santana Guimarães Lopes

## Prompt utilizado

Agora atue como um Arquiteto de Software Sênior extremamente rigoroso com Clean Code, DRY, SOLID, componentização e Design System.

Revise a implementação atual da QUEST4.

Analise:
- tabela de transações;
- botões de editar e excluir;
- modal de edição;
- possível duplicação com o modal de Nova Transação;
- uso de Button, Input e componentes de src/components/ui/;
- lógica de estado;
- validações;
- uso de estilos e Design System.

Quero que você:
1. Identifique problemas de arquitetura e duplicação.
2. Aponte severidade: baixa, média ou alta.
3. Sugira melhorias pragmáticas.
4. Aplique uma refatoração segura.
5. Se fizer sentido, extraia um componente reutilizável para formulário/modal de transação.
6. Mantenha a criação, edição, exclusão e exportação funcionando.
7. Não use cores hardcoded.
8. Rode npm test e npm run build no final.

## Principais problemas encontrados pela IA

A IA identificou possíveis duplicações entre o fluxo de edição de transações e os componentes já existentes do dashboard.

Também foram observados pontos de melhoria relacionados à componentização, organização da lógica de exclusão, organização da lógica de edição, reaproveitamento de componentes e manutenção da consistência visual com o Design System.

## Sugestões de refatoração

As principais sugestões foram:

- Reduzir duplicação de código entre modais e formulários.
- Separar melhor responsabilidades entre tabela, modal e lógica de estado.
- Reaproveitar componentes existentes do projeto, como Button e Input.
- Manter validação de valor maior que zero.
- Evitar hardcoding de cores e espaçamentos.
- Criar componentes mais fáceis de manter.
- Preservar o comportamento já existente do dashboard.

## O que foi refatorado

Após a revisão da IA, foram aplicadas refatorações pragmáticas para melhorar a organização do código.

A refatoração buscou preservar o funcionamento da edição e exclusão de transações, reduzindo repetição e mantendo o padrão visual do projeto.

A funcionalidade de exclusão passou a utilizar confirmação antes de remover uma transação. A funcionalidade de edição permite abrir um modal preenchido com os dados da transação, alterar as informações e salvar as mudanças na tabela.

## Validação

Foram executadas validações no projeto:

- `npm test -- --run`: passou com 103 testes.
- `npm run build`: passou com sucesso.

## Aprendizado

A atividade mostrou a importância de fazer primeiro uma versão funcional e depois revisar o código com foco em manutenção.

O uso da IA como Arquiteto de Software ajudou a identificar oportunidades de melhoria em Clean Code, DRY, componentização e consistência visual.

Também foi possível aplicar o conceito de refatoração pragmática, melhorando a estrutura do código sem alterar o comportamento principal da funcionalidade.