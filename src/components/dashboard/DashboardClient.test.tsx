import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { DashboardClient } from "./DashboardClient";

const initialTransactions = [
  {
    id: "1",
    description: "Assinatura Acme",
    amount: 1200,
    type: "income" as const,
    date: "2026-04-10T12:00:00.000Z",
    category: "Assinatura",
  },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DashboardClient", () => {
  it("keeps a transaction when delete confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<DashboardClient initialTransactions={initialTransactions} />);
    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(screen.getByText("Assinatura Acme")).toBeTruthy();
  });

  it("removes a transaction when delete confirmation is accepted", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<DashboardClient initialTransactions={initialTransactions} />);
    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(screen.queryByText("Assinatura Acme")).toBeNull();
    expect(screen.getByText(/Nenhuma transa/)).toBeTruthy();
  });

  it("edits a transaction from the table", () => {
    render(<DashboardClient initialTransactions={initialTransactions} />);

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "Projeto" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Entrada - Projeto")).toBeTruthy();
    expect(screen.getByText("Projeto")).toBeTruthy();
    expect(screen.getByText(/\+R\$\s*500,00/)).toBeTruthy();
  });
});
