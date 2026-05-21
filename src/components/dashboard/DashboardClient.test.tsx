import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

vi.mock("@/lib/api", () => ({
  getTransactions: vi.fn(),
  getMetrics: vi.fn(),
  persistTransaction: vi.fn(),
}));

import { DashboardClient } from "./DashboardClient";
import { getTransactions, getMetrics, persistTransaction } from "@/lib/api";

const getTransactionsMock = vi.mocked(getTransactions);
const getMetricsMock = vi.mocked(getMetrics);
const persistTransactionMock = vi.mocked(persistTransaction);

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "1",
  description: "Assinatura cliente Acme Corp",
  amount: 12000,
  type: "income",
  date: new Date(2026, 3, 10),
  category: "Assinatura",
  ...overrides,
});

const makeMetric = (overrides: Partial<MetricSummary> = {}): MetricSummary => ({
  label: "Faturamento",
  value: 12000,
  currency: true,
  ...overrides,
});

describe("DashboardClient", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the dashboard and the date range filter", async () => {
    getTransactionsMock.mockResolvedValueOnce([makeTransaction()]);
    getMetricsMock.mockResolvedValueOnce([makeMetric(), makeMetric({ label: "Despesas", value: 2800 }), makeMetric({ label: "Lucro Líquido", value: 9200 }), makeMetric({ label: "Transações", value: 1, currency: false })]);

    render(<DashboardClient />);

    expect(screen.getByText(/visão geral/i)).toBeTruthy();
    expect(screen.getByText(/métricas financeiras do período/i)).toBeTruthy();
    expect(screen.getByText(/carregando transações/i)).toBeTruthy();

    await screen.findByText(/Assinatura cliente Acme Corp/i);

    expect(screen.getByLabelText(/data de início/i)).toBeTruthy();
    expect(screen.getByLabelText(/data de fim/i)).toBeTruthy();
    expect(screen.getByText(/Faturamento/i)).toBeTruthy();
    expect(screen.getByText(/Despesas/i)).toBeTruthy();
    expect(screen.getByText(/Lucro Líquido/i)).toBeTruthy();
    expect(screen.getAllByText(/Transações/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders metric cards from API response", async () => {
    getTransactionsMock.mockResolvedValueOnce([makeTransaction({ id: "2", description: "Receita B" })]);
    getMetricsMock.mockResolvedValueOnce([
      makeMetric({ label: "Faturamento", value: 18400 }),
      makeMetric({ label: "Despesas", value: 2800 }),
      makeMetric({ label: "Lucro Líquido", value: 15600 }),
      makeMetric({ label: "Transações", value: 1, currency: false }),
    ]);

    render(<DashboardClient />);

    await screen.findByText(/Receita B/i);

    expect(screen.getByText(/Faturamento/i)).toBeTruthy();
    expect(screen.getByText(/Despesas/i)).toBeTruthy();
    expect(screen.getByText(/Lucro Líquido/i)).toBeTruthy();
    expect(screen.getAllByText(/Transações/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the transactions table and updates it after changing the period", async () => {
    getTransactionsMock.mockResolvedValueOnce([makeTransaction({ id: "3", description: "Receita inicial" })]);
    getMetricsMock.mockResolvedValueOnce([
      makeMetric({ label: "Transações", value: 1, currency: false }),
    ]);
    getTransactionsMock.mockResolvedValueOnce([makeTransaction({ id: "4", description: "Receita atualizada" })]);
    getMetricsMock.mockResolvedValueOnce([
      makeMetric({ label: "Transações", value: 1, currency: false }),
    ]);

    render(<DashboardClient />);

    await screen.findByText(/Receita inicial/i);

    const allStartInputs = screen.getAllByLabelText(/data de início/i);
    const startInput = allStartInputs[allStartInputs.length - 1];
    fireEvent.change(startInput, { target: { value: "2026-04-02" } });

    await screen.findByText(/Receita atualizada/i);
    expect(screen.queryByText(/Receita inicial/i)).toBeNull();
  });

  it("renders empty state when API returns no transactions", async () => {
    getTransactionsMock.mockResolvedValueOnce([]);
    getMetricsMock.mockResolvedValueOnce([]);

    render(<DashboardClient />);

    await screen.findByText(/Nenhuma transação encontrada para o período selecionado/i);
    expect(screen.queryByText(/Faturamento/i)).toBeNull();
  });

  it("keeps a newly created transaction after changing the date range", async () => {
    const initialTransaction = makeTransaction({ id: "3", description: "Receita inicial", date: new Date("2026-05-05") });
    const savedTransaction = makeTransaction({ id: "9", description: "Venda teste", date: new Date("2026-05-10") });
    const transactionStore = [initialTransaction];

    getTransactionsMock.mockImplementation(async ({ dateRange }: DashboardFilters) => {
      return transactionStore.filter(
        (transaction) => transaction.date >= dateRange.from && transaction.date <= dateRange.to,
      );
    });

    getMetricsMock.mockImplementation(async ({ dateRange }: DashboardFilters) => {
      const filtered = transactionStore.filter(
        (transaction) => transaction.date >= dateRange.from && transaction.date <= dateRange.to,
      );
      return computeMetrics(filtered);
    });

    persistTransactionMock.mockImplementation((transaction) => {
      transactionStore.unshift(transaction);
    });

    render(<DashboardClient />);

    await screen.findByText(/Receita inicial/i);

    fireEvent.click(screen.getByRole("button", { name: /Abrir formulário de nova transação/i }));
    await screen.findByRole("heading", { name: /Nova Transação/i });

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: savedTransaction.description } });
    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: "100.00" } });
    fireEvent.change(screen.getByLabelText(/^Data$/i), { target: { value: "2026-05-10" } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: "Vendas" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await screen.findByText(/Venda teste/i);
    expect(persistTransactionMock).toHaveBeenCalledWith(expect.objectContaining({ description: "Venda teste" }));

    const allStartInputs = screen.getAllByLabelText(/data de início/i);
    const startInput = allStartInputs[allStartInputs.length - 1];
    fireEvent.change(startInput, { target: { value: "2026-04-02" } });

    await screen.findByText(/Venda teste/i);
    expect(screen.getByText(/Venda teste/i)).toBeTruthy();
  });
});
