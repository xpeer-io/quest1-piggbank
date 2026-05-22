import { useCallback, useState } from "react";
import type { Transaction } from "@/types";
import {
  deleteTransactionApi,
  deserializeTransaction,
  SerializedTransaction,
  updateTransactionApi,
} from "@/lib/transactionApi";

export function useTransactions(initialTransactions: SerializedTransaction[]) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => initialTransactions.map(deserializeTransaction),
  );
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const removeTransaction = useCallback(async (id: string) => {
    await deleteTransactionApi(id);
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }, []);

  const updateTransaction = useCallback(
    async (id: string, data: Partial<SerializedTransaction>) => {
      const updated = await updateTransactionApi(id, data);
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === id ? updated : transaction,
        ),
      );
      return updated;
    },
    [],
  );

  return {
    transactions,
    editingTransaction,
    setEditingTransaction,
    removeTransaction,
    updateTransaction,
  };
}
