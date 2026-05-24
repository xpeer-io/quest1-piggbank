import type { Transaction } from "@/types";
import { formatCurrency, formatDisplayDate } from "@/lib/date";

type TransactionsTableProps = {
  transactions: Transaction[];
  onDelete?: (transactionId: string) => void;
  onEdit?: (transaction: Transaction) => void;
};

export function TransactionsTable({ transactions, onDelete, onEdit }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Categoria
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Valor
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="transition-colors hover:bg-accent/30"
            >
              <td className="px-4 py-3 text-muted-foreground">
                {formatDisplayDate(transaction.date)}
              </td>
              <td className="px-4 py-3 text-foreground">
                {transaction.description}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                  {transaction.category}
                </span>
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  transaction.type === "income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                {onEdit ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    onClick={() => onEdit(transaction)}
                  >
                    Editar
                  </button>
                ) : null}
                {onDelete ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-red-500 transition hover:text-red-600"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Excluir
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
