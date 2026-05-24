import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TransactionFormModal } from "@/components/transaction/TransactionFormModal";

describe("TransactionFormModal", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders title and submit label", () => {
    render(
      <TransactionFormModal
        title="Nova Transação"
        submitLabel="Salvar Transação"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Nova Transação")).toBeTruthy();
    expect(screen.getByText("Salvar Transação")).toBeTruthy();
  });

  it("calls onSubmit with transformed payload", () => {
    const handleSubmit = vi.fn();
    render(
      <TransactionFormModal
        title="Nova Transação"
        submitLabel="Salvar Transação"
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Valor da Transação"), {
      target: { value: "100.25" },
    });
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2026-05-24" },
    });
    fireEvent.click(screen.getByText("Salvar Transação"));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100.25,
        category: "Vendas",
        description: expect.any(String),
      })
    );
  });
});
