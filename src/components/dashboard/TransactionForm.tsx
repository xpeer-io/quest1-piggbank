'use client';

import { useState } from "react";
import type { Transaction } from "@/types";

type TransactionFormProps = {
  initialData?: {
    amount: string;
    date: string;
    category: string;
    type: "income" | "expense";
  };

  onSubmit: (data: {
    amount: number;
    date: Date;
    category: string;
    type: "income" | "expense";
  }) => void;

  onCancel: () => void;
  submitLabel: string;
};

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? "Outros"
  );
  const [type, setType] = useState<"income" | "expense">(
    initialData?.type ?? "income"
  );

  function handleSubmit() {
    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    onSubmit({
      amount: numericAmount,
      date: date ? new Date(date) : new Date(),
      category,
      type,
    });
  }

  return (
    <div className="space-y-4">
      {/* TYPE */}
      <div>
        <label className="mb-1 block text-sm text-foreground">
          Tipo
        </label>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "income" | "expense")
          }
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>

      {/* AMOUNT */}
      <div>
        <label className="mb-1 block text-sm text-foreground">
          Valor
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>

      {/* DATE */}
      <div>
        <label className="mb-1 block text-sm text-foreground">
          Data
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-1 block text-sm text-foreground">
          Categoria
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option>Alimentação</option>
          <option>Transporte</option>
          <option>Salário</option>
          <option>Outros</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-red-400"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="text-sm text-blue-400"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}