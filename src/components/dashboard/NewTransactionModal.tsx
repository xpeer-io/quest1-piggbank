"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Transaction } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
};

export function NewTransactionModal({ isOpen, onClose, onSave }: Props) {
  const [type, setType] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>("Marketing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // reset form when closed
      setType("income");
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategory("Marketing");
      setError(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    const parsed = Number(amount);
    if (!parsed || Number.isNaN(parsed) || parsed <= 0) {
      setError("O valor deve ser maior que zero");
      return;
    }

    const transaction: Transaction = {
      id: String(Date.now()),
      description: description || (type === "income" ? "Receita" : "Despesa"),
      amount: parsed,
      type,
      date: new Date(date),
      category,
    };

    onSave(transaction);
    onClose();
  };

  return (
    // This component renders the DialogContent and form only.
    // The Dialog Root (controlled via `isOpen`) should be provided by the parent.
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova Transação</DialogTitle>
        <DialogDescription>Registre uma nova entrada ou saída.</DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="grid gap-3"
      >
        <label className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo</span>
          <Select aria-label="Tipo" value={type} onChange={(e) => setType(e.target.value as "income" | "expense") }>
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </Select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Descrição</span>
          <Input autoFocus aria-label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Valor</span>
            <Input
              aria-label="Valor"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</span>
            <Input aria-label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Categoria</span>
          <Select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Marketing</option>
            <option>Vendas</option>
            <option>Salário</option>
            <option>Impostos</option>
            <option>Outros</option>
          </Select>
        </label>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
