'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

type NewTransactionButtonProps = {
  onAdd: (transaction: Transaction) => void;
};

export function NewTransactionButton({
  onAdd,
}: NewTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Outros");

  function handleSave() {
    const numero = Number(amount);

    if (numero <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: "Nova transação",
      amount: numero,
      type,
      date: date ? new Date(date) : new Date(),
      category,
    };

    onAdd(newTransaction);

    setIsOpen(false);
    setAmount("");
    setDate("");
    setCategory("Outros");
    setType("income");
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Nova Transação
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Nova Transação
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-foreground">
                  Tipo
                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "income" | "expense")
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-foreground">
                  Valor
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-foreground">
                  Data
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-foreground">
                  Categoria
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white"
                >
                  <option>Alimentação</option>
                  <option>Transporte</option>
                  <option>Salário</option>
                  <option>Outros</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>

                <Button type="button" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}