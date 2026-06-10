import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { NewTransactionModal } from "./NewTransactionModal";

afterEach(cleanup);

function renderModal() {
  const onClose = vi.fn();
  const onSave = vi.fn();

  render(<NewTransactionModal open onClose={onClose} onSave={onSave} />);

  return { onClose, onSave };
}

describe("NewTransactionModal", () => {
  it("does not render when closed", () => {
    render(
      <NewTransactionModal open={false} onClose={vi.fn()} onSave={vi.fn()} />,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
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

  it("saves a valid transaction and closes the modal", () => {
    const { onClose, onSave } = renderModal();

    fireEvent.change(screen.getByLabelText("Tipo"), {
      target: { value: "expense" },
    });
    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "150.5" },
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
        amount: 150.5,
        category: "Projeto",
        description: "Sa\u00edda - Projeto",
        type: "expense",
      }),
    );
    expect(onSave.mock.calls[0][0].date).toEqual(new Date(2026, 5, 10));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
