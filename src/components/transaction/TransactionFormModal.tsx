import { useEffect, useState, type FormEvent } from "react";
import type { Transaction } from "@/types";

export type TransactionFormValues = {
  transactionType: "entrada" | "saida";
  value: string;
  date: string;
  category: string;
  description: string;
};

type TransactionFormModalProps = {
  title: string;
  submitLabel: string;
  initialValues?: TransactionFormValues;
  isSubmitting?: boolean;
  onSubmit: (transaction: Omit<Transaction, "id">) => void | Promise<void>;
  onClose: () => void;
};

const defaultValues: TransactionFormValues = {
  transactionType: "entrada",
  value: "0.00",
  date: "",
  category: "Vendas",
  description: "",
};

export function TransactionFormModal({
  title,
  submitLabel,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onClose,
}: TransactionFormModalProps) {
  const [transactionType, setTransactionType] = useState<"entrada" | "saida">(
    initialValues?.transactionType ?? defaultValues.transactionType
  );
  const [value, setValue] = useState<string>(initialValues?.value ?? defaultValues.value);
  const [date, setDate] = useState<string>(initialValues?.date ?? defaultValues.date);
  const [category, setCategory] = useState<string>(initialValues?.category ?? defaultValues.category);
  const [description, setDescription] = useState<string>(initialValues?.description ?? defaultValues.description);

  useEffect(() => {
    setTransactionType(initialValues?.transactionType ?? defaultValues.transactionType);
    setValue(initialValues?.value ?? defaultValues.value);
    setDate(initialValues?.date ?? defaultValues.date);
    setCategory(initialValues?.category ?? defaultValues.category);
    setDescription(initialValues?.description ?? defaultValues.description);
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !category || !value) return;

    const amount = parseFloat(value);
    if (Number.isNaN(amount)) return;

    await onSubmit({
      type: transactionType === "entrada" ? "income" : "expense",
      amount,
      date: new Date(date),
      category,
      description: description || `${transactionType === "entrada" ? "Receita" : "Despesa"} - ${category}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-slate-950/20 dark:border-white/20 shadow-2xl relative overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-black/5 dark:border-white/5 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="font-display-table text-display-table text-slate-950 dark:text-white">
              {title}
            </h2>
            <p className="font-label-caps text-label-caps text-on-secondary-container">
              Insira os detalhes do fluxo financeiro
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex p-1 bg-surface-container-low dark:bg-white/5 border border-black/5 dark:border-white/5">
            <label className="flex-1">
              <input
                checked={transactionType === "entrada"}
                onChange={() => setTransactionType("entrada")}
                className="sr-only peer"
                name="type"
                type="radio"
              />
              <div className="text-center py-3 font-label-caps text-label-caps cursor-pointer transition-all peer-checked:bg-white dark:peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm">
                Entrada
              </div>
            </label>
            <label className="flex-1">
              <input
                checked={transactionType === "saida"}
                onChange={() => setTransactionType("saida")}
                className="sr-only peer"
                name="type"
                type="radio"
              />
              <div className="text-center py-3 font-label-caps text-label-caps cursor-pointer transition-all peer-checked:bg-white dark:peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm">
                Saída
              </div>
            </label>
          </div>

          <div className="space-y-3">
            <label htmlFor="transaction-value" className="font-label-caps text-label-caps text-on-secondary-container block">
              Valor da Transação
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-metric-lg text-metric-lg text-on-primary-container">
                R$
              </span>
              <input
                id="transaction-value"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white outline-none pl-14 py-4 font-metric-lg text-metric-lg text-slate-950 dark:text-white transition-colors appearance-none"
                min="0.01"
                required
                step="0.01"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="transaction-description" className="font-label-caps text-label-caps text-on-secondary-container block">
              Descrição (Opcional)
            </label>
            <input
              id="transaction-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full bg-surface-container-low dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 font-body-main text-on-surface focus:border-black dark:focus:border-white outline-none transition-all"
              placeholder="Ex: Venda para cliente XYZ"
              type="text"
            />
          </div>

          <div className="grid grid-cols-2 gap-gutter">
            <div className="space-y-2">
              <label htmlFor="transaction-date" className="font-label-caps text-label-caps text-on-secondary-container block">
                Data
              </label>
              <div className="relative">
                <input
                  id="transaction-date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full bg-surface-container-low dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 font-body-main text-on-surface focus:border-black dark:focus:border-white outline-none transition-all"
                  type="date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-secondary-container block">
                Categoria
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full bg-surface-container-low dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 font-body-main text-on-surface focus:border-black dark:focus:border-white outline-none transition-all appearance-none"
              >
                <option>Vendas</option>
                <option>Marketing</option>
                <option>Operacional</option>
                <option>Impostos</option>
                <option>Folha de Pagamento</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-label-caps text-label-caps hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : submitLabel}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 border border-black/10 dark:border-white/10 text-on-surface font-label-caps text-label-caps hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
          <span
            className="material-symbols-outlined text-[200px]"
            style={{ fontVariationSettings: "'wght' 100" }}
          >
            payments
          </span>
        </div>
      </div>
    </div>
  );
}
