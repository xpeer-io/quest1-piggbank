"use client";

import { FormEvent, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatUrlDate, parseUrlDate } from "@/lib/date";
import type { Transaction } from "@/types";

export type TransactionFormValues = Pick<
  Transaction,
  "amount" | "category" | "date" | "type"
>;

type TransactionFormModalProps = {
  description: string;
  initialValues: TransactionFormValues;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => void;
  open: boolean;
  submitLabel?: string;
  title: string;
};

const categoryOptions = [
  "Assinatura",
  "Projeto",
  "Servi\u00e7os",
  "Infraestrutura",
  "Software",
  "RH",
  "Impostos",
  "Marketing",
];

const labelClassName = "text-sm font-medium text-foreground";
const fieldClassName =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50";

export function TransactionFormModal({
  description,
  initialValues,
  onClose,
  onSubmit,
  open,
  submitLabel = "Salvar",
  title,
}: TransactionFormModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const typeId = useId();
  const amountId = useId();
  const dateId = useId();
  const categoryId = useId();

  const [type, setType] = useState<Transaction["type"]>(initialValues.type);
  const [amount, setAmount] = useState(String(initialValues.amount));
  const [date, setDate] = useState(formatUrlDate(initialValues.date));
  const [category, setCategory] = useState(initialValues.category);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setType(initialValues.type);
    setAmount(String(initialValues.amount));
    setDate(formatUrlDate(initialValues.date));
    setCategory(initialValues.category);
    setError("");
  }, [
    initialValues.amount,
    initialValues.category,
    initialValues.date,
    initialValues.type,
    open,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (!date) {
      setError("Informe a data da transacao.");
      return;
    }

    onSubmit({
      amount: parsedAmount,
      category,
      date: parseUrlDate(date),
      type,
    });
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div>
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className={labelClassName} htmlFor={typeId}>
              Tipo
            </label>
            <select
              className={fieldClassName}
              id={typeId}
              value={type}
              onChange={(event) =>
                setType(event.target.value as Transaction["type"])
              }
            >
              <option value="income">Entrada</option>
              <option value="expense">Sa&iacute;da</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className={labelClassName} htmlFor={amountId}>
              Valor
            </label>
            <input
              aria-invalid={Boolean(error)}
              className={fieldClassName}
              id={amountId}
              inputMode="decimal"
              min="0.01"
              placeholder="0,00"
              required
              step="0.01"
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
            />
          </div>

          <div className="grid gap-2">
            <label className={labelClassName} htmlFor={dateId}>
              Data
            </label>
            <input
              className={fieldClassName}
              id={dateId}
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className={labelClassName} htmlFor={categoryId}>
              Categoria
            </label>
            <select
              className={fieldClassName}
              id={categoryId}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
