"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const TRANSACTION_CATEGORIES = [
  "Assinatura",
  "Infraestrutura",
  "Serviços",
  "Software",
  "Marketing",
  "Salários",
  "Outros",
] as const;

export type TransactionFormValues = {
  id?: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  category: string;
  description: string;
};

interface TransactionFormModalProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  initialValues?: TransactionFormValues;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => void;
}

function formatDateInput(date?: Date | string) {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
}

export function TransactionFormModal({
  isOpen,
  title,
  submitLabel,
  initialValues,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setType(initialValues?.type ?? "income");
    setAmount(initialValues?.amount ? String(initialValues.amount) : "");
    setDate(formatDateInput(initialValues?.date));
    setCategory(initialValues?.category ?? "");
    setDescription(initialValues?.description ?? "");
    setError("");
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }

    if (!date) {
      setError("Selecione uma data.");
      return;
    }

    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }

    if (!description) {
      setError("Digite uma descrição.");
      return;
    }

    onSubmit({
      id: initialValues?.id,
      type,
      amount: Number(amount),
      date,
      category,
      description,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-foreground">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            aria-label="Fechar"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 rounded-md px-3 py-2 font-medium ${
              type === "income" ? "bg-emerald-600 text-white" : "bg-muted"
            }`}
          >
            ↑ Entrada
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 rounded-md px-3 py-2 font-medium ${
              type === "expense" ? "bg-red-600 text-white" : "bg-muted"
            }`}
          >
            ↓ Saída
          </button>
        </div>

        <label className="mb-1 block text-sm text-muted-foreground">Descrição</label>
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex: Assinatura cliente Acme"
          className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />

        <label className="mb-1 block text-sm text-muted-foreground">Valor (R$)</label>
        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0,00"
          min="0.01"
          step="0.01"
          className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />

        <label className="mb-1 block text-sm text-muted-foreground">Data</label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />

        <label className="mb-1 block text-sm text-muted-foreground">Categoria</label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Selecione uma categoria</option>
          {TRANSACTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground"
          >
            Cancelar
          </button>
          <Button onClick={handleSave} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
