# AI-REVIEW — Piggbank CRUD (AI-Driven Code Review)

## 1. Prompt utilizado no Copilot (Arquiteto Sênior)

---

**PROMPT:**

@workspace

Atue como um Arquiteto de Software Sênior extremamente rigoroso com Clean Code, SOLID e DRY.

Analise os arquivos do projeto Piggbank, especialmente:
- #file:DashboardClient.tsx
- #file:NewTransactionButton.tsx
- #file:TransactionForm.tsx
- #file:TransactionsTable.tsx

Quero que você faça um code review arquitetural completo e responda:

1. Quais são os problemas de arquitetura existentes?
2. Onde há violação de SOLID, DRY e Clean Code?
3. Onde há duplicação de código?
4. Quais riscos isso traz para escalabilidade?
5. Como você refatoraria esse sistema passo a passo?

Importante:
- Seja crítico e direto como um arquiteto sênior.
- Não foque apenas em “funciona ou não funciona”.
- Foque em arquitetura, manutenção e escalabilidade.
- Proponha uma refatoração completa com nova estrutura de componentes.
- Inclua exemplos de código quando necessário.

---

## 2. Principais problemas identificados pelo Copilot

### 2.1 Duplicação de código
- Modais duplicados em diferentes componentes
- Conversão de datas repetida em vários arquivos
- Validação de formulário espalhada

### 2.2 Violação de SRP (Single Responsibility Principle)
- `DashboardClient` acumulando múltiplas responsabilidades:
  - UI
  - estado de transações
  - edição
  - exclusão
  - controle de modal

- `NewTransactionButton` não é apenas botão:
  - contém modal
  - contém formulário
  - contém lógica de criação

### 2.3 Falta de reutilização
- Formulário de criação e edição duplicado
- Modal não reutilizável
- Categorias hardcoded dentro de componentes

### 2.4 Lógica de negócio dentro da UI
- Geração de ID (`crypto.randomUUID`) dentro do componente
- Transformação de dados dentro de componentes React
- Validação feita com `alert()` dentro da UI

### 2.5 Problemas de escalabilidade
- Crescimento do estado dentro do Dashboard será difícil de manter
- Cada nova feature (ex: novos modais) aumenta complexidade exponencial
- Código difícil de testar

---

## 3. Impacto arquitetural

- Código difícil de manter
- Alta duplicação de lógica
- Baixa reutilização de componentes
- Testabilidade reduzida
- Forte acoplamento entre UI e regra de negócio

---

## 4. Refatorações aplicadas

Com base no code review, foram aplicadas as seguintes melhorias:

### 4.1 Criação de TransactionDialog
- Modal reutilizável
- Remove duplicação de estrutura de modal
- Usado tanto para criação quanto edição

### 4.2 Criação de TransactionForm reutilizável
- Formulário único para create e edit
- Uso de props `initialData`
- Separação da lógica de UI e submissão

### 4.3 Centralização de validação (Zod)
- Schema de transação centralizado
- Remoção de validações espalhadas
- Melhor consistência de dados

### 4.4 Factory de transações
- Criação de `createTransaction`
- Criação de `updateTransaction`
- Remoção de lógica de negócio da UI

### 4.5 Refatoração do DashboardClient
- Apenas orquestra estado e componentes
- Remove lógica duplicada de modal
- Remove responsabilidade de criação direta

### 4.6 Refatoração do NewTransactionButton
- Responsável apenas por abrir modal
- Não contém mais formulário interno
- Usa componentes reutilizáveis

---

## 5. O que aprendi com o Code Review

- Componentes React não devem conter regra de negócio complexa
- Modais e formulários devem ser reutilizáveis
- Estado deve ser o mais centralizado possível
- Validações devem ser feitas fora da UI (schemas)
- Duplicação de código hoje gera dívida técnica amanhã

---

## 6. Estrutura final ideal do projeto
src/
├── components/
│ ├── dashboard/
│ │ ├── DashboardClient.tsx
│ │ ├── TransactionsTable.tsx
│ │ ├── NewTransactionButton.tsx
│ │ ├── TransactionForm.tsx
│ │ ├── TransactionDialog.tsx
│
├── lib/
│ ├── validators/
│ │ └── transaction.ts
│ ├── factories/
│ │ └── transaction.ts
│ ├── date.ts
│
├── types/
│ └── index.ts

---

## 7. Conclusão

O projeto evoluiu de uma arquitetura funcional porém duplicada, para uma arquitetura mais:

- modular
- reutilizável
- escalável
- testável

A principal melhoria foi a separação entre:
- UI (componentes React)
- lógica de negócio (factories)
- validação (schemas)
- estrutura de dados (types)

Isso reduz significativamente a dívida técnica e prepara o sistema para crescimento futuro.