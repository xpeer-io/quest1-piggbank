import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { TransactionActions } from "@/components/dashboard/TransactionActions";

type TransactionRowProps = {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

export function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  return (
    <tr className="transition-colors hover:bg-accent/30">
      <td className="px-4 py-3 text-muted-foreground">
        {formatDisplayDate(transaction.date)}
      </td>
      <td className="px-4 py-3 text-foreground">{transaction.description}</td>
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
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Math.abs(transaction.amount))}
      </td>
      {(onEdit || onDelete) && (
        <td className="px-4 py-3 text-right">
          <TransactionActions
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </td>
      )}
    </tr>
  );
}
