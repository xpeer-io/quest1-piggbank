"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "./DashboardClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
};

export function NewTransactionModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  if (!open) return null;

  function handleSave() {
    if (Number(amount) <= 0) {
      alert("O valor deve ser maior que zero");
      return;
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      type,
      amount: Number(amount),
      date,
      category,
      description: "Nova transação",
    };

    onSave(newTransaction);
    onClose();

    setAmount("");
    setDate("");
    setCategory("");
    setType("expense");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[420px] space-y-4 rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Nova Transação
        </h2>

        {/* Tipo */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === "income" ? "default" : "outline"}
            onClick={() => setType("income")}
          >
            Entrada
          </Button>

          <Button
            type="button"
            variant={type === "expense" ? "default" : "outline"}
            onClick={() => setType("expense")}
          >
            Saída
          </Button>
        </div>

        {/* Valor */}
        <input
          type="number"
          placeholder="Valor"
          className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Data */}
        <input
          type="date"
          className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Categoria */}
        <input
          type="text"
          placeholder="Categoria"
          className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}