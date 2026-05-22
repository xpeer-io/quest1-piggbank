import { useState, type FormEvent } from "react";
import type { Transaction } from "@/types";

export type TransactionFormValues = {
  description: string;
  amount: number;
  category: string;
  type: Transaction["type"];
  date: string;
};

type TransactionFormProps = {
  initialValues: TransactionFormValues;
  onCancel: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  submitLabel: string;
};

export function TransactionForm({
  initialValues,
  onCancel,
  onSubmit,
  submitLabel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(initialValues.description);
  const [amount, setAmount] = useState(String(initialValues.amount));
  const [category, setCategory] = useState(initialValues.category);
  const [type, setType] = useState<Transaction["type"]>(initialValues.type);
  const [date, setDate] = useState(initialValues.date);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      await onSubmit({
        description,
        amount: Number(amount),
        category,
        type,
        date,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        Descrição
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label className="block text-sm">
        Valor
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label className="block text-sm">
        Categoria
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
      </label>

      <label className="block text-sm">
        Tipo
        <select
          className="mt-1 w-full rounded border px-3 py-2"
          value={type}
          onChange={(event) => setType(event.target.value as Transaction["type"])}
        >
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
      </label>

      <label className="block text-sm">
        Data
        <input
          type="date"
          className="mt-1 w-full rounded border px-3 py-2"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-3 py-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-3 py-2 text-white"
        >
          {saving ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
