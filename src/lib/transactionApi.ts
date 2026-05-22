import type { Transaction } from "@/types";

export type SerializedTransaction = Omit<Transaction, "date"> & {
  date: string;
};

export function deserializeTransaction(
  transaction: SerializedTransaction,
): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
}

export function serializeTransaction(
  transaction: Transaction,
): SerializedTransaction {
  return {
    ...transaction,
    date: transaction.date.toISOString(),
  };
}

export async function deleteTransactionApi(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir transação");
  }
}

export async function updateTransactionApi(
  id: string,
  data: Partial<SerializedTransaction>,
): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Falha ao atualizar transação");
  }

  const json = await response.json();
  return deserializeTransaction(json.transaction);
}
