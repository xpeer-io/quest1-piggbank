import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

afterEach(cleanup);
import { TransactionsDashboard } from "./TransactionsDashboard";
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

describe("TransactionsDashboard", () => {
  it("manages transaction removal via state", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const transactions = [
      makeTransaction({ id: "1", description: "Transacao 1" }),
    ];
    
    render(<TransactionsDashboard initialTransactions={transactions} />);
    expect(screen.getByText("Transacao 1")).toBeTruthy();
    
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));
    
    expect(screen.queryByText("Transacao 1")).toBeNull();
    expect(screen.getByText(/Nenhuma transação encontrada/)).toBeTruthy();
  });

  it("does not remove item if deletion is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const transactions = [
      makeTransaction({ id: "1", description: "Transacao 1" }),
    ];
    
    render(<TransactionsDashboard initialTransactions={transactions} />);
    
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));
    
    expect(screen.getByText("Transacao 1")).toBeTruthy();
  });
});
