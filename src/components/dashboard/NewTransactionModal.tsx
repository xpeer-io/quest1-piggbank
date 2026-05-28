"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Transaction } from "@/types";

type TransactionForm = {
  amount: string;
  type: "income" | "expense";
  date: string;
  category: string;
  description: string;
};

const defaultForm: TransactionForm = {
  amount: "",
  type: "income",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  description: "",
};

type NewTransactionModalProps = {
  onAddTransaction?: (transaction: Transaction) => void;
};

export function NewTransactionModal({ onAddTransaction }: NewTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const amountValue = useMemo(() => {
    const sanitized = form.amount.replace(/[^\d,.-]/g, "");
    if (!sanitized) return 0;

    const normalized = sanitized.replace(".", "").replace(",", ".");
    const numericValue = Number.parseFloat(normalized);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }, [form.amount]);

  function resetForm() {
    setForm(defaultForm);
    setError(null);
  }

  function closeModal() {
    setIsOpen(false);
    resetForm();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.amount || amountValue <= 0) {
      setError("Informe um valor válido para a transação.");
      return;
    }

    if (!form.category) {
      setError("Selecione uma categoria para continuar.");
      return;
    }

    const transaction: Transaction = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      amount: Math.round(amountValue * 100) / 100,
      category: form.category,
      date: new Date(form.date),
      description: form.description.trim() || "Transação cadastrada",
      type: form.type,
    };

    onAddTransaction?.(transaction);
    closeModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        Nova Transação
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Adicionar</p>
                <h2 className="text-xl font-semibold text-foreground">Nova Transação</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-accent"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-foreground">Valor da Transação</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    id="amount"
                    aria-label="Valor da Transação"
                    type="text"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                    placeholder="0,00"
                    className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-3 text-lg font-semibold text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-2">
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, type: "income" }))}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    form.type === "income"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  + Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, type: "expense" }))}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    form.type === "expense"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  − Saída
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm font-medium text-foreground">
                  <span className="mb-2 block">Data</span>
                  <input
                    aria-label="Data"
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                  />
                </label>

                <label className="block text-sm font-medium text-foreground">
                  <span className="mb-2 block">Categoria</span>
                  <select
                    aria-label="Categoria"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                  >
                    <option value="">Selecionar...</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Outros">Outros</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm font-medium text-foreground">
                <span className="mb-2 block">Descrição</span>
                <input
                  aria-label="Descrição"
                  type="text"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Ex: Freelance, Mercado..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                />
              </label>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  Salvar Transação
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
