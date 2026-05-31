"use client"

import * as React from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"
import { formatDisplayDate } from "@/lib/date"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("O valor deve ser maior que 0"),
  date: z.date(),
  category: z.string().min(1, "A categoria é obrigatória"),
})

type TransactionForm = z.infer<typeof transactionSchema>

type FieldErrors = Partial<Record<keyof TransactionForm, string>>

export function NewTransactionModal() {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<TransactionForm["type"]>("income")
  const [amount, setAmount] = React.useState("")
  const [date, setDate] = React.useState<TransactionForm["date"]>(new Date())
  const [category, setCategory] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors>({})

  const selectedDateLabel = React.useMemo(
    () => formatDisplayDate(date),
    [date],
  )

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amountValue = Number(amount)
    const validation = transactionSchema.safeParse({
      type,
      amount: amountValue,
      date,
      category: category.trim(),
    })

    if (!validation.success) {
      const fieldErrors: FieldErrors = {}

      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof TransactionForm] = issue.message
        }
      }

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setOpen(false)
    setAmount("")
    setCategory("")
    setType("income")
    setDate(new Date())
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Nova Transação</Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-[min(95vw,28rem)] rounded-xl border border-border bg-card p-6 shadow-lg"
      >
        <PopoverHeader>
          <PopoverTitle>Nova transação</PopoverTitle>
          <PopoverDescription>
            Preencha os dados abaixo para adicionar uma nova transação.
          </PopoverDescription>
        </PopoverHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSave}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="transaction-type">
              Tipo
            </label>
            <select
              id="transaction-type"
              value={type}
              onChange={(event) => setType(event.target.value as TransactionForm["type"])}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="transaction-amount">
              Valor
            </label>
            <input
              id="transaction-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
            {errors.amount ? (
              <span className="text-xs text-destructive">{errors.amount}</span>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="transaction-date">
              Data
            </label>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <span className="block text-xs text-muted-foreground">Selecionado</span>
              <span id="transaction-date" className="font-medium">
                {selectedDateLabel}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-background p-2">
              <Calendar selected={date} onSelect={(selectedDate) => selectedDate && setDate(selectedDate)} />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="transaction-category">
              Categoria
            </label>
            <input
              id="transaction-category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Ex: Alimentação"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
            {errors.category ? (
              <span className="text-xs text-destructive">{errors.category}</span>
            ) : null}
          </div>

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
