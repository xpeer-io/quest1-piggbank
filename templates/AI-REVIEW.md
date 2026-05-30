🔍 Problemas Críticos Encontrados
Violação forte do DRY entre novo modal e modal de edição

O modal de edição no DashboardClient.tsx repete praticamente toda a UI do NewTransactionModal.tsx:
campos Descrição, Valor, Tipo, Categoria, Data
estrutura de grid, labels, classes Tailwind e botões
comportamento de submit/cancel
Isso cria dois pontos de manutenção para a mesma forma de transação.
Acoplamento excessivo de estado e lógica em DashboardClient.tsx

O componente contém:
estado da lista de transações
controle de abertura de modal de edição
controle de abertura de modal de exclusão
selectedTransaction
estados de formulário editDescription, editAmount, editType, editCategory, editDate
conversão de data (new Date(...T12:00:00))
lógica de adição, edição, exclusão
métricas derivadas (income, expense, balance)
formatação CSV para exportação
Isso viola o princípio de responsabilidade única: o dashboard está fazendo “tudo”.
Falta de componentização clara

O dashboard é um “God component” que mistura:
layout e cabeçalho
filtros
exportação
tabela
modais
lógica de negócio
O TransactionsTable está bem encapsulado em relação à renderização, mas o resto da UI não.
Prop desnecessária / contrato confuso

DashboardClient recebe metrics como prop e não utiliza esse valor no JSX.
Esse sinaliza inconsistência entre interface e implementação.
Lógica de apresentação repetida

Em TransactionsTable.tsx, o formato de moeda é criado inline com new Intl.NumberFormat(...).
No dashboard, o CSV também formata data e tipo de transação manualmente.
Isso deveria ser centralizado em helpers.
🏗️ Plano de Refatoração Sugerido
Extrair a lógica de transações em um hook

useTransactionManager(transactions)
Deve expor:
transactionList
addTransaction
updateTransaction
deleteTransaction
summaryMetrics
exportTransactionsCsvPayload
Assim DashboardClient passa a ser um orquestrador.
Criar um formulário compartilhado de transação

TransactionForm
Props:
mode: "create" | "edit"
transaction?: Transaction
onSubmit
onCancel
Ele deve conter apenas UI e validação leve.
Criar modal genérico reutilizável

TransactionModal
Deve renderizar TransactionForm dentro do layout de modal.
Pode receber title, children, onClose.
Separar modal de confirmação de exclusão

ConfirmDeleteModal
Props:
transaction
onConfirm
onCancel
Esse modal é claramente uma unidade distinta de UI/fluxo.
Centralizar formatação de data/valor

src/lib/format.ts
Funções:
formatCurrencyBRL
formatDate
formatTransactionDate
TransactionsTable.tsx e ExportarTransacoes devem consumir essas helpers.
Reduzir responsabilidades de DashboardClient

Ele deve apenas compor:
DashboardHeader
DateRangeFilter
ExportarTransacoes
TransactionModal
MetricsGrid
TransactionsTable
ConfirmDeleteModal
Estados de formulário e dados devem viver em hooks/componentes menores.
💻 Estrutura Alvo dos Componentes
Composição esperada
DashboardClient.tsx

container principal
composição de componentes
uso de useTransactionManager
src/components/dashboard/useTransactionManager.ts

estado da lista
add/edit/delete
métricas e transformação CSV
src/components/dashboard/TransactionForm.tsx

campos do formulário
validação de valor
seleção de tipo
seleção de categoria
src/components/dashboard/TransactionModal.tsx

modal shell
header
close logic
reuse para novo/editar
src/components/dashboard/ConfirmDeleteModal.tsx

confirmação de exclusão
texto e ações
TransactionsTable.tsx

renderização de tabela
callbacks onEdit / onDelete
src/components/dashboard/MetricsGrid.tsx (opcional)

renderiza os cards de métricas
evita map + JSX inline no dashboard
Helpers recomendados
src/lib/format.ts
formatCurrencyBRL
formatDate
transactionToCsvRow
UI reutilizável
src/components/ui/Modal.tsx (se ainda não existir)
src/components/ui/FormField.tsx ou src/components/ui/Input.tsx (opcional)
Button.tsx já usado, manter a consistência
Observações finais
O TransactionsTable está bem projetado como componente de apresentação, mas pode se beneficiar de pequenos extras como:

abstrair formatCurrencyBRL
extrair botão de ação em um componente ActionButton
A maior melhoria arquitetural é remover a lógica de edição/exclusão do DashboardClient e torná-la reutilizável através de:

TransactionModal + TransactionForm
ConfirmDeleteModal
useTransactionManager
Isso mantém o padrão Tailwind atual, mas reduz drasticamente a duplicação e o acoplamento.

