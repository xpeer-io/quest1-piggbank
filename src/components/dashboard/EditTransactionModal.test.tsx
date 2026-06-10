import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { EditTransactionModal } from "./EditTransactionModal";
import type { Transaction } from "@/types";

afterEach(cleanup);

const transaction: Transaction = {
  id: "1",
  description: "Assinatura Acme",
  amount: 1200,
  type: "income",
  date: new Date(2026, 3, 10),
  category: "Assinatura",
};

function renderModal(overrides: Partial<Transaction> = {}) {
  const onClose = vi.fn();
  const onSave = vi.fn();

  render(
    <EditTransactionModal
      transaction={{ ...transaction, ...overrides }}
      onClose={onClose}
      onSave={onSave}
    />,
  );

  return { onClose, onSave };
}

describe("EditTransactionModal", () => {
  it("does not render without a transaction", () => {
    render(
      <EditTransactionModal
        transaction={null}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("fills the form with transaction data", () => {
    renderModal();

    expect((screen.getByLabelText("Tipo") as HTMLSelectElement).value).toBe(
      "income",
    );
    expect((screen.getByLabelText("Valor") as HTMLInputElement).value).toBe(
      "1200",
    );
    expect((screen.getByLabelText("Data") as HTMLInputElement).value).toBe(
      "2026-04-10",
    );
    expect(
      (screen.getByLabelText("Categoria") as HTMLSelectElement).value,
    ).toBe("Assinatura");
  });

  it("requires an amount greater than zero", () => {
    const { onClose, onSave } = renderModal();

    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByRole("alert").textContent).toContain(
      "valor maior que zero",
    );
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("saves edited transaction data", () => {
    const { onSave } = renderModal();

    fireEvent.change(screen.getByLabelText("Tipo"), {
      target: { value: "expense" },
    });
    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "850.5" },
    });
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2026-06-10" },
    });
    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "Projeto" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        amount: 850.5,
        category: "Projeto",
        description: "Sa\u00edda - Projeto",
        type: "expense",
      }),
    );
    expect(onSave.mock.calls[0][0].date).toEqual(new Date(2026, 5, 10));
  });
});
