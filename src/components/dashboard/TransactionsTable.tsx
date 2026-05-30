"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import exportToCSV from "@/lib/exportToCSV";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type TransactionsTableProps = {
  transactions: Transaction[];
  onAdd: (tx: Transaction) => void;
  onUpdate?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
};

export function TransactionsTable({ transactions, onAdd, onUpdate, onDelete }: TransactionsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Transações recentes</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csvData = transactions.map((t) => {
                const dateObj = typeof t.date === "string" ? new Date(t.date) : t.date;
                const dateIso = dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj.toISOString().slice(0, 10) : ""; // YYYY-MM-DD
                const amountNum = typeof t.amount === "number" ? Math.abs(t.amount) : Number(t.amount) || 0;
                const signedValue = t.type === "income" ? amountNum : -amountNum;
                return {
                  Data: dateIso,
                  Tipo: t.type === "income" ? "Entrada" : "Saída",
                  Valor: signedValue,
                  Categoria: t.category ?? "",
                };
              });

              const today = new Date();
              const ymd = today.toISOString().slice(0, 10).replace(/-/g, "");
              const filename = `transacoes-piggbank-${ymd}.csv`;

              const headers = ["Data", "Tipo", "Valor", "Categoria"];
              exportToCSV(csvData, filename, { delimiter: ",", bom: true }, headers);
            }}
          >
            Exportar CSV
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Nova Transação
          </Button>
        </div>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        initialTransaction={editingTx ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }}
        onAdd={(tx) => {
          onAdd(tx);
        }}
        onUpdate={(tx) => {
          // call parent update handler if provided
          onUpdate?.(tx);
          setIsModalOpen(false);
          setEditingTx(null);
        }}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Excluir transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (txToDelete) onDelete?.(txToDelete);
        }}
        onClose={() => {
          setIsConfirmOpen(false);
          setTxToDelete(null);
        }}
      />

      {/* Confirm dialog for deletion */}
      {/* will render a simple confirm using a generic UI component */}

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhuma transação encontrada para o período selecionado.
        </div>
      ) : (
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
                        ? "text-accent"
                        : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Math.abs(transaction.amount))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTx(transaction);
                          setIsModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTxToDelete(transaction.id);
                          setIsConfirmOpen(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
