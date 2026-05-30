import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

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

  it("renders edit and delete buttons for each row", () => {
    render(<TransactionsTable transactions={[makeTransaction()]} />);
    expect(screen.getByRole("button", { name: /editar/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /excluir/i })).toBeTruthy();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    const transaction = makeTransaction({ id: "edit-me" });
    render(<TransactionsTable transactions={[transaction]} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole("button", { name: /editar/i }));
    
    expect(onEdit).toHaveBeenCalledWith("edit-me");
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    const transaction = makeTransaction({ id: "delete-me" });
    render(<TransactionsTable transactions={[transaction]} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));
    
    expect(onDelete).toHaveBeenCalledWith("delete-me");
  });
});
