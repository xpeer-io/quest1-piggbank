"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

type NewTransactionModalProps = {
  onSubmit: (newTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) => void;
};

export function NewTransactionModal({ onSubmit }: NewTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Assinatura");
  const [date, setDate] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Number(amount) <= 0) {
      alert("O valor deve ser maior que zero");
      return;
    }

    onSubmit({
      description,
      amount: Number(amount),
      type,
      category,
      date,
    });

    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Assinatura");
    setDate("");
    closeModal();
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-white text-black hover:opacity-90"
      >
        Nova Transação
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-[#333333] bg-[#121212] p-8 shadow-[0_24px_80px_-40px_rgba(255,255,255,0.35)]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">Nova Transação</h2>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A] text-[#E5E2E1] transition hover:bg-[#232323]"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#B7B5B4]">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Assinatura Mensal"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-[#666666] focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#B7B5B4]">
                    Valor
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#B7B5B4]">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full rounded-xl border border-[#333333] bg-[#1A1A1A] px-4 pl-12 py-3 text-white placeholder:text-[#666666] focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#B7B5B4]">
                    Tipo
                  </label>
                  <div className="flex h-[46px] gap-1 rounded-xl border border-[#333333] bg-[#1A1A1A] p-1">
                    <button
                      type="button"
                      className={`flex-1 rounded-lg px-3 text-xs font-semibold transition ${
                        type === "income"
                          ? "bg-[#272727] text-white shadow-sm"
                          : "text-[#A3A3A3] hover:text-white"
                      }`}
                      onClick={() => setType("income")}
                    >
                      Entrada
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-lg px-3 text-xs font-semibold transition ${
                        type === "expense"
                          ? "bg-[#272727] text-white shadow-sm"
                          : "text-[#A3A3A3] hover:text-white"
                      }`}
                      onClick={() => setType("expense")}
                    >
                      Saída
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#B7B5B4]">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#1A1A1A] px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="Assinatura">Assinatura</option>
                  <option value="Software">Software</option>
                  <option value="RH">RH</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#B7B5B4]">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#1A1A1A] px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-[#333333] bg-[#1A1A1A] py-3 text-sm font-semibold text-[#E5E2E1] transition hover:bg-[#232323]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
