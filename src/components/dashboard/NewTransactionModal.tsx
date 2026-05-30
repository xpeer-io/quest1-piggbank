"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createTransaction } from "@/lib/api";
import { formatDisplayDate, startOfDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewTransactionModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  // Estados do Formulário
  const [type, setType] = React.useState<"income" | "expense">("income");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [date, setDate] = React.useState<Date>(() => startOfDay(new Date()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return; // Validação obrigatória
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        type,
        amount: numericAmount,
        description,
        category,
        date,
      });
      setIsOpen(false);
      router.refresh(); // Atualiza os dados do dashboard
      
      // Reset
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(startOfDay(new Date()));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        <Plus className="mr-2 size-4" />
        Nova Transação
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Nova Transação</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex p-1 bg-muted rounded-lg">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                  type === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                {t === "income" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/90">Descrição</label>
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ex: Pagamento Fornecedor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/90">Valor (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/90">Categoria</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione...</option>
                <option value="Assinatura">Assinatura</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Serviços">Serviços</option>
                <option value="Software">Software</option>
                <option value="RH">RH</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-semibold text-foreground/90">Data</label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start text-left font-normal h-10 border-border"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDisplayDate(date) : <span>Selecione uma data</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}