"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { formatDisplayDate, formatUrlDate } from "@/lib/date"
import type { Transaction } from "@/types"
import { cn } from "@/lib/utils"
import { parseCurrency, formatCurrency } from "@/lib/currency"

type Props = {
  initial?: Transaction | null
  onSubmit: (t: Transaction) => void
  onCancel?: () => void
}

export function TransactionForm({ initial, onSubmit, onCancel }: Props) {
  const [type, setType] = React.useState<"income" | "expense">("income")
  const [amount, setAmount] = React.useState<string>("")
  const [date, setDate] = React.useState<Date>(new Date())
  const [category, setCategory] = React.useState<string>("Assinatura")
  const [description, setDescription] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!initial) return
    setType(initial.type)
    setAmount(String(initial.amount))
    setDate(initial.date)
    setCategory(initial.category)
    setDescription(initial.description)
    setError(null)
  }, [initial])

  function validate() {
    const value = parseCurrency(amount)
    if (Number.isNaN(value) || value <= 0) {
      setError("O valor deve ser maior que zero")
      return false
    }
    setError(null)
    return true
  }

  function handleSubmit() {
    if (!validate()) return
    const value = parseCurrency(amount)
    const transaction: Transaction = {
      id: initial?.id ?? String(Date.now()),
      description: description || `${category}`,
      amount: Math.round(value),
      type,
      date,
      category,
    }
    onSubmit(transaction)
  }

  const summary = `${type === "income" ? "Entrada" : "Saída"} de ${formatCurrency(parseCurrency(amount || "0"))} em ${category} registrada para ${formatDisplayDate(date)}.`

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Tipo</label>
        <div className="inline-flex w-full overflow-hidden rounded-full border border-border">
          <button
            onClick={() => setType("income")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium",
              type === "income" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground"
            )}
          >
            Entrada
          </button>
          <button
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium",
              type === "expense" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground"
            )}
          >
            Saída
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Valor *</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
          <Input
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            className="pl-10"
          />
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Data</label>
          <Input type="date" value={formatUrlDate(date)} onChange={(e) => setDate(new Date(e.target.value))} className="h-10" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Categoria</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10">
            <option>Assinatura</option>
            <option>Infraestrutura</option>
            <option>Serviços</option>
            <option>Software</option>
            <option>RH</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Descrição</label>
        <Input placeholder="Ex: Assinatura cliente Acme Corp" value={description} onChange={(e) => setDescription(e.target.value)} className="py-3" />
      </div>

      <div className="flex items-start gap-3 rounded-md border border-border bg-popover/60 px-4 py-3">
        <div className="rounded-md bg-accent p-2 text-accent-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">Resumo</div>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSubmit}>Salvar</Button>
      </div>
    </div>
  )
}

export default TransactionForm
