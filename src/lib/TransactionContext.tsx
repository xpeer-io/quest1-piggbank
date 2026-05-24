"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Transaction } from "@/types";
import { mockTransactions } from "@/data/mock";

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (transactionId: string) => void;
  editTransaction: (transaction: Transaction) => void;
  isLoading: boolean;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const STORAGE_KEY = "piggbank_transactions";
const DELETED_IDS_KEY = "piggbank_deleted_transaction_ids";

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deletedTransactionIds, setDeletedTransactionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const saveState = (currentTransactions: Transaction[], deletedIds: string[]) => {
    try {
      const localTransactions = currentTransactions.filter(
        (t) => !mockTransactions.find((m) => m.id === t.id)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localTransactions));
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
    } catch (error) {
      console.error("Error saving transaction state:", error);
    }
  };

  useEffect(() => {
    try {
      const storedDeletedIds = localStorage.getItem(DELETED_IDS_KEY) ?? "[]";
      const parsedDeletedIds = JSON.parse(storedDeletedIds) as string[];
      setDeletedTransactionIds(parsedDeletedIds);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsedTransactions = stored
        ? JSON.parse(stored).map((t: Transaction) => ({
            ...t,
            date: new Date(t.date),
          }))
        : [];

      const loadedTransactions = [...mockTransactions, ...parsedTransactions].filter(
        (transaction) => !parsedDeletedIds.includes(transaction.id)
      );

      setTransactions(loadedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions(mockTransactions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `${Date.now()}`,
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveState(updated, deletedTransactionIds);
  };

  const deleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== transactionId
    );
    const updatedDeletedIds = Array.from(
      new Set([...deletedTransactionIds, transactionId])
    );

    setTransactions(updatedTransactions);
    setDeletedTransactionIds(updatedDeletedIds);
    saveState(updatedTransactions, updatedDeletedIds);
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    );

    setTransactions(updatedTransactions);
    saveState(updatedTransactions, deletedTransactionIds);
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, deleteTransaction, editTransaction, isLoading }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
}
