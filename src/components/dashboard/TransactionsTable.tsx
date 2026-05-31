"use client";

import React, { useState } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";

type TransactionsTableProps = {
  transactions: Transaction[];
};

function ConfirmModal({ open, title, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-card p-6">
        <h3 className="mb-4 text-lg font-medium text-foreground">{title}</h3>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ open, transaction, onSave, onClose }: {
  open: boolean;
  transaction: Transaction | null;
  onSave: (t: Transaction) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => transaction ?? null);

  React.useEffect(() => {
    setForm(transaction ?? null);
  }, [transaction]);

  if (!open || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-card p-6">
        <h3 className="mb-4 text-lg font-medium text-foreground">Editar transação</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="flex flex-col gap-3"
        >
          <label className="text-sm text-muted-foreground">Descrição
            <input
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="text-sm text-muted-foreground">Categoria
            <input
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>

          <label className="text-sm text-muted-foreground">Valor
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={String(form.amount)}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </label>

          <label className="text-sm text-muted-foreground">Data
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={form.date.toISOString().slice(0, 10)}
              onChange={(e) => setForm({ ...form, date: new Date(e.target.value) })}
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [items, setItems] = useState<Transaction[]>(transactions ?? []);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Transaction | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  function handleDeleteRequest(t: Transaction) {
    setToDelete(t);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
    setConfirmOpen(false);
  }

  function handleEditRequest(t: Transaction) {
    setEditing(t);
    setEditOpen(true);
  }

  function handleSave(updated: Transaction | null) {
    if (!updated) return;
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditOpen(false);
    setEditing(null);
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <>
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
            {items.map((transaction) => (
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Math.abs(transaction.amount))}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRequest(transaction)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRequest(transaction)}>Excluir</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={isConfirmOpen}
        title={`Confirmar exclusão de "${toDelete?.description ?? ""}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
      />

      <EditModal
        open={isEditOpen}
        transaction={editing}
        onSave={(t) => handleSave(t)}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
      />
    </>
  );
}
