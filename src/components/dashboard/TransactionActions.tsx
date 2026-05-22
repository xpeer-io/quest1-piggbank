import type { Transaction } from "@/types";

type TransactionActionsProps = {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

export function TransactionActions({
  transaction,
  onEdit,
  onDelete,
}: TransactionActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {onEdit ? (
        <button
          type="button"
          className="rounded bg-yellow-500 px-2 py-1 text-xs text-white"
          onClick={() => onEdit(transaction)}
        >
          Editar
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          className="rounded bg-red-600 px-2 py-1 text-xs text-white"
          onClick={() => onDelete(transaction)}
        >
          Excluir
        </button>
      ) : null}
    </div>
  );
}
