import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NewTransactionModal } from "./NewTransactionModal";

afterEach(() => cleanup());

describe("NewTransactionModal", () => {
  it("opens the form and submits a new transaction", () => {
    const onAddTransaction = vi.fn();

    render(<NewTransactionModal onAddTransaction={onAddTransaction} />);

    fireEvent.click(screen.getByRole("button", { name: /nova transação/i }));

    expect(screen.getByRole("heading", { name: /nova transação/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/valor da transação/i), {
      target: { value: "1250,00" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Freelance" },
    });
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: "Trabalho" },
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: "2026-05-27" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrada/i }));
    fireEvent.click(screen.getByRole("button", { name: /salvar transação/i }));

    expect(onAddTransaction).toHaveBeenCalledTimes(1);
    expect(onAddTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 1250,
        category: "Trabalho",
        description: "Freelance",
        type: "income",
      })
    );
  });

  it("shows an error when the amount is invalid", () => {
    const onAddTransaction = vi.fn();

    render(<NewTransactionModal onAddTransaction={onAddTransaction} />);

    fireEvent.click(screen.getByRole("button", { name: /nova transação/i }));
    fireEvent.change(screen.getByLabelText(/valor da transação/i), {
      target: { value: "0,00" },
    });
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: "Trabalho" },
    });
    fireEvent.click(screen.getByRole("button", { name: /salvar transação/i }));

    expect(screen.getByText(/Informe um valor válido para a transação/)).toBeTruthy();
    expect(onAddTransaction).not.toHaveBeenCalled();
  });

  it("shows an error when the category is missing", () => {
    const onAddTransaction = vi.fn();

    render(<NewTransactionModal onAddTransaction={onAddTransaction} />);

    fireEvent.click(screen.getByRole("button", { name: /nova transação/i }));
    fireEvent.change(screen.getByLabelText(/valor da transação/i), {
      target: { value: "1200,00" },
    });
    fireEvent.click(screen.getByRole("button", { name: /salvar transação/i }));

    expect(screen.getByText(/Selecione uma categoria para continuar/)).toBeTruthy();
    expect(onAddTransaction).not.toHaveBeenCalled();
  });

  it("submits an expense transaction and uses the default description when none is provided", () => {
    const onAddTransaction = vi.fn();

    render(<NewTransactionModal onAddTransaction={onAddTransaction} />);

    fireEvent.click(screen.getByRole("button", { name: /nova transação/i }));
    fireEvent.click(screen.getByRole("button", { name: /saída/i }));
    fireEvent.change(screen.getByLabelText(/valor da transação/i), {
      target: { value: "250,00" },
    });
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: "Alimentação" },
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: "2026-05-27" },
    });
    fireEvent.click(screen.getByRole("button", { name: /salvar transação/i }));

    expect(onAddTransaction).toHaveBeenCalledTimes(1);
    expect(onAddTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 250,
        category: "Alimentação",
        description: "Transação cadastrada",
        type: "expense",
      })
    );
  });
});
