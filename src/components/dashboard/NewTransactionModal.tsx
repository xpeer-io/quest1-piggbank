"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { formatDisplayDate, formatUrlDate } from "@/lib/date"
import type { Transaction } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (t: Transaction) => void
}

export function NewTransactionModal({ isOpen, onClose, onSave }: Props) {
  const [type, setType] = React.useState<"income" | "expense">("income")
  const [amount, setAmount] = React.useState<string>("")
  const [date, setDate] = React.useState<Date>(new Date())
  const [category, setCategory] = React.useState<string>("Assinatura")
  const [description, setDescription] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isOpen) {
      setAmount("")
      setDate(new Date())
      setCategory("Assinatura")
      setDescription("")
      setType("income")
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  function validate() {
    const value = Number(amount.replace(/[^0-9.-]+/g, ""))
    if (Number.isNaN(value) || value <= 0) {
      setError("O valor deve ser maior que zero")
      return false
    }
    setError(null)
    return true
  }

  function handleSave() {
    if (!validate()) return
    const value = Number(amount.replace(/[^0-9.-]+/g, ""))
    const transaction: Transaction = {
      id: String(Date.now()),
      description: description || `${category}`,
      amount: Math.round(value),
      type,
      date,
      category,
    }
    onSave(transaction)
    onClose()
  }

  const summary = `${type === "income" ? "Entrada" : "Saída"} de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(amount || 0)
  )} em ${category} registrada para ${formatDisplayDate(date)}.`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[560px] rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(2,6,23,0.6)]">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-accent p-2 text-accent-foreground">
              {/* small icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Nova Transação</h3>
              <p className="mt-1 text-xs text-muted-foreground">Registre uma entrada ou saída no fluxo de caixa</p>
            </div>
          </div>

          <button aria-label="close" className="rounded-md p-2 text-muted-foreground hover:bg-muted" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Type toggle as segmented pill */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Tipo</label>
            <div className="inline-flex w-full overflow-hidden rounded-full border border-border">
              <button
                onClick={() => setType("income")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium",
                  type === "income"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground"
                )}
              >
                Entrada
              </button>
              <button
                onClick={() => setType("expense")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium",
                  type === "expense"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground"
                )}
              >
                Saída
              </button>
            </div>
          </div>

          {/* Value */}
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

          {/* Date + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Data</label>
              <Input
                type="date"
                value={formatUrlDate(date)}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="h-10"
              />
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

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Descrição</label>
            <Input
              placeholder="Ex: Assinatura cliente Acme Corp"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="py-3"
            />
          </div>

          {/* Summary card */}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTransactionModal
