1) Prompt utilizado

Implement a transactions edit/delete UI for the piggbank dashboard (Next.js + TypeScript). Requirements:
- Add an "Ações" column to the transactions table.
- Add "Editar" and "Excluir" buttons for each row.
- On "Excluir", show a confirmation before removing.
- On "Editar", open a modal/form prefilled with the transaction data and allow saving changes.
- Keep the project's Design System (use existing `Button` component and styles).
- Update tests if necessary.
- Add AI review file listing prompt, issues found, suggested refactors and learnings.

2) Principais problemas encontrados

- A tabela de transações era um componente server-side (sem "use client") e não suportava interatividade local.
- Os dados vinham de `mockTransactions` em memória, sem um backend real; atualizações precisam ser mantidas no estado do cliente.
- Não existia um componente de modal/dialog centralizado no design system, então adicionei modais simples locais para edição e confirmação.
- Os testes existentes não cobriam ações de edição/exclusão; modificar testes pode exigir utilitários adicionais (`user-event`) caso queiramos simular interações completas.

3) Refatorações sugeridas pela IA

- Extrair modais (`ConfirmModal`, `EditModal`) para componentes reutilizáveis sob `src/components/ui/` e aplicar foco/keyboard traps para acessibilidade.
- Implementar uma API (endpoints API Routes ou rota servidor) que permita persistir alterações em um backend ou em `mockTransactions` via chamadas POST/PUT/DELETE, garantindo que a página server-side atualize corretamente ou use SWR/React Query para revalidação.
- Centralizar o estado de transações (context + hooks) se múltiplos componentes forem manipular transações (p.ex. filtros, métricas atualizadas em tempo real).
- Adicionar validação de formulário com `zod` (padrão do projeto) para garantir valores válidos ao salvar a transação.
- Cobrir comportamento de edição/exclusão com testes: unitários para funções de transformação e testes de integração para UI com `@testing-library/user-event`.

4) O que foi aprendido

- A aplicação atual trata dados como mocks em memória e dá preferência a Server Components; para interatividade local, convém isolar a parte interativa como Client Components.
- Requisitos simples de CRUD na UI podem ser implementados apenas no cliente para prototipagem rápida, mas para persistência e consistência entre usuários, é necessária uma camada de API.
- Seguir o Design System existente (reusar `Button`, tokens de estilo) mantém a aparência consistente e evita criação de novos padrões.

Notas rápidas sobre o que foi alterado:
- `src/components/dashboard/TransactionsTable.tsx`: convertido para Client Component; adicionado coluna "Ações", botões "Editar"/"Excluir", `ConfirmModal` e `EditModal` simples.
- Não foram necessárias alterações nos arquivos do servidor. Testes existentes devem continuar passando; considerar adicionar testes para as novas ações se desejar validação de integração.

Se quiser, posso:
- Extrair os modais para `src/components/ui/` e ajustar os testes para cobrir edição/exclusão.
- Implementar endpoints API para persistência das alterações.
