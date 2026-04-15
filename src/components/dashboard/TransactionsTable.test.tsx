import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);
import { TransactionsTable } from "./TransactionsTable";
import type { Transaction } from "@/types";

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "1",
  description: "Assinatura Acme",
  amount: 1200,
  type: "income",
  date: new Date(2026, 3, 10),
  category: "Assinatura",
  ...overrides,
});

describe("TransactionsTable", () => {
  it("renders empty state when there are no transactions", () => {
    render(<TransactionsTable transactions={[]} />);
    expect(screen.getByText(/Nenhuma transação encontrada/)).toBeTruthy();
  });

  it("renders a row for each transaction", () => {
    const transactions = [
      makeTransaction({ id: "1", description: "Receita A" }),
      makeTransaction({ id: "2", description: "Receita B" }),
    ];
    render(<TransactionsTable transactions={transactions} />);
    expect(screen.getByText("Receita A")).toBeTruthy();
    expect(screen.getByText("Receita B")).toBeTruthy();
  });

  it("formats date as dd/MM/yyyy", () => {
    render(<TransactionsTable transactions={[makeTransaction({ date: new Date(2026, 3, 10) })]} />);
    expect(screen.getByText("10/04/2026")).toBeTruthy();
  });

  it("renders the transaction category", () => {
    render(<TransactionsTable transactions={[makeTransaction({ category: "Infraestrutura" })]} />);
    expect(screen.getByText("Infraestrutura")).toBeTruthy();
  });

  it("shows + prefix for income transactions", () => {
    render(<TransactionsTable transactions={[makeTransaction({ type: "income", amount: 1200 })]} />);
    expect(screen.getByText(/^\+/)).toBeTruthy();
  });

  it("shows - prefix for expense transactions", () => {
    render(<TransactionsTable transactions={[makeTransaction({ type: "expense", amount: 800 })]} />);
    expect(screen.getByText(/^-/)).toBeTruthy();
  });

  it("does not render empty state when there are transactions", () => {
    render(<TransactionsTable transactions={[makeTransaction()]} />);
    expect(screen.queryByText(/Nenhuma transação encontrada/)).toBeNull();
  });
});
