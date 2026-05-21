import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DashboardClient } from "./DashboardClient";

vi.mock("@/lib/api", () => ({
  getTransactions: vi.fn(),
  getMetrics: vi.fn(),
  persistTransaction: vi.fn(),
}));

import { getTransactions, getMetrics } from "@/lib/api";
import type { Transaction, MetricSummary } from "@/types";

const getTransactionsMock = vi.mocked(getTransactions);
const getMetricsMock = vi.mocked(getMetrics);

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

describe("NewTransactionModal / integration", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("opens the modal and validates value, then saves a new transaction", async () => {
    getTransactionsMock.mockResolvedValueOnce([makeTransaction()]);
    getMetricsMock.mockResolvedValueOnce([
      makeMetric(),
      makeMetric({ label: "Despesas", value: 2800 }),
      makeMetric({ label: "Lucro Líquido", value: 9200 }),
      makeMetric({ label: "Transações", value: 1, currency: false }),
    ]);

    render(<DashboardClient />);

    // Wait for initial transaction to appear
    await screen.findByText(/Assinatura cliente Acme Corp/i);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /Abrir formulário de nova transação/i }));

    // Modal title
    expect(await screen.findByRole("heading", { name: /Nova Transação/i })).toBeTruthy();

    // Try to submit invalid value
    const saveButton = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(saveButton);

    await screen.findByText(/O valor deve ser maior que zero/i);

    // Fill fields
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Venda teste" } });
    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: "150.5" } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: "Vendas" } });

    // Save
    fireEvent.click(saveButton);

    // New transaction appears in table
    await waitFor(() => expect(screen.getByText(/Venda teste/i)).toBeTruthy());
  });
});
