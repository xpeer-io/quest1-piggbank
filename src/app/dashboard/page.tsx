"use client"

import { useEffect, useState } from "react"
import { MetricsCard } from "@/components/dashboard/MetricsCard"
import { TransactionsTable } from "@/components/dashboard/TransactionsTable"
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter"
import { Button } from "@/components/ui/button"
import { getMetrics, getTransactions } from "@/lib/api"
import { getDefaultDateRange } from "@/lib/date"
import type { DateRange, MetricSummary, Transaction } from "@/types"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange())
  const [metrics, setMetrics] = useState<MetricSummary[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const clearForm = () => {
    setType("income")
    setAmount("")
    setDate("")
    setCategory("")
    setDescription("")
    setError("")
  }

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0 || !date || !category || !description) {
      setError("Todos os campos são obrigatórios e o valor deve ser maior que zero.")
      return
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(), // Simples ID único
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(date),
      category,
    }
    setTransactions(prev => [newTransaction, ...prev])
    clearForm()
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    clearForm()
    setIsModalOpen(false)
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        const filters = { dateRange }
        const [loadedMetrics, loadedTransactions] = await Promise.all([
          getMetrics(filters),
          getTransactions(filters),
        ])
        setMetrics(loadedMetrics)
        setTransactions(loadedTransactions)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [dateRange])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            🐷 piggbank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Visão Geral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Métricas financeiras do período
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangeFilter
              onFilterChange={setDateRange}
              initialRange={dateRange}
              isLoading={isLoading}
            />
            <Button onClick={() => setIsModalOpen(true)}>Nova Transação</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-base font-medium text-foreground">
            Transações recentes
          </h2>
          <TransactionsTable transactions={transactions} />
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Nova Transação</h3>
            {error && <p className="text-destructive text-sm mb-4">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Valor</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">Selecione</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                  placeholder="Descrição da transação"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

