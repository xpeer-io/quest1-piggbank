"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Transaction } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
};

export function NewTransactionModal({ isOpen, onClose, onAdd }: Props) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"expense" | "income">("expense");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function parseAmount(value: string) {
    // accept both 1234.56 and 1.234,56 formats; normalize to dot
    const normalized = value.replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseAmount(amount);
    if (!description.trim()) return alert("Preencha a descrição.");
    if (!isFinite(amt) || amt <= 0) return alert("Informe um valor válido.");
    if (!date) return alert("Informe a data.");

    const tx: Transaction = {
      id: String(Date.now()),
      description: description.trim(),
      amount: Math.round(amt * 100) / 100,
      type: type,
      date: new Date(date),
      category: category.trim() || "Outros",
    };

    onAdd(tx);
    // reset form
    setDescription("");
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setType("expense");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      ref={backdropRef}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-xl bg-card p-6 shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Nova Transação</h3>
            <p className="text-sm text-muted-foreground">Preencha os dados para adicionar</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <input
              ref={firstInputRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Aluguel, Salário, Compra"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Valor (BRL)</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-right text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Compras"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
          >
            Confirmar Transação
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewTransactionModal;
