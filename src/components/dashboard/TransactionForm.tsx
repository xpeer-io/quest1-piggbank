"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(initialData?.description || "");
  const [amount, setAmount] = useState(
    initialData ? Math.abs(initialData.amount).toString() : ""
  );
  const [type, setType] = useState<"income" | "expense">(
    initialData?.type || "income"
  );
  const [category, setCategory] = useState(
    initialData?.category || "Assinatura"
  );
  const [date, setDate] = useState(
    initialData
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Amount must be > 0
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrors({ amount: "O valor deve ser maior que zero." });
      return;
    }

    onSubmit({
      description,
      amount: numericAmount,
      type,
      category,
      date: new Date(date),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Descrição
        </label>
        <input
          type="text"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Assinatura Mensal"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Valor
        </label>
        <input
          type="number"
          step="0.01"
          required
          className={`w-full rounded-md border ${
            errors.amount ? "border-red-500" : "border-border"
          } bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500`}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors({});
          }}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Tipo
        </label>
        <select
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Categoria
        </label>
        <select
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Assinatura">Assinatura</option>
          <option value="Infraestrutura">Infraestrutura</option>
          <option value="Serviços">Serviços</option>
          <option value="Software">Software</option>
          <option value="Projeto">Projeto</option>
          <option value="RH">RH</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Data
        </label>
        <input
          type="date"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3 pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
