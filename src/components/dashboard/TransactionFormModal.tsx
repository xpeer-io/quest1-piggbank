"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Transaction } from "@/types";

type SerializedTransaction = Omit<Transaction, "date"> & { date: string };

type Props = {
  transaction?: SerializedTransaction | null;
  onClose: () => void;
  onSave: (data: Partial<SerializedTransaction>) => Promise<void>;
};

export default function TransactionFormModal({ transaction, onClose, onSave }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [description, setDescription] = useState(transaction?.description ?? "");
  const [amount, setAmount] = useState(String(transaction?.amount ?? ""));
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [type, setType] = useState<Transaction["type"]>(transaction?.type ?? "expense");
  const [date, setDate] = useState(transaction?.date ? transaction.date.slice(0, 10) : "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Partial<SerializedTransaction> = {
      description,
      amount: Number(amount),
      category,
      type,
      date: new Date(date).toISOString(),
    };

    try {
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  }

  if (!transaction) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Editar transação</h3>

        <label className="mb-2 block text-sm">Descrição</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="mb-3 w-full rounded border px-3 py-2" />

        <label className="mb-2 block text-sm">Valor</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mb-3 w-full rounded border px-3 py-2" />

        <label className="mb-2 block text-sm">Categoria</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} className="mb-3 w-full rounded border px-3 py-2" />

        <label className="mb-2 block text-sm">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="mb-3 w-full rounded border px-3 py-2">
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>

        <label className="mb-2 block text-sm">Data</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-4 w-full rounded border px-3 py-2" />

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 rounded border px-3 py-1">Cancelar</button>
          <button type="submit" disabled={saving} className="rounded bg-blue-600 px-3 py-1 text-white">{saving ? "Salvando..." : "Salvar"}</button>
        </div>
      </form>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
