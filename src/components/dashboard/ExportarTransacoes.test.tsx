import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportarTransacoes } from "./ExportarTransacoes";
import type { Transaction } from "@/types";

afterEach(cleanup);

// Mocking global objects for download simulation
const createObjectURLMock = vi.fn();
const revokeObjectURLMock = vi.fn();

if (typeof window !== "undefined") {
  window.URL.createObjectURL = createObjectURLMock;
  window.URL.revokeObjectURL = revokeObjectURLMock;
}

// Mocking the click on anchor tag
const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
const setAttributeSpy = vi.spyOn(HTMLAnchorElement.prototype, "setAttribute");

describe("ExportarTransacoes", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      description: "Venda de Produto",
      amount: 1500,
      type: "income",
      date: new Date(2026, 3, 10), // 2026-04-10
      category: "Vendas",
    },
    {
      id: "2",
      description: "Aluguel",
      amount: 2000,
      type: "expense",
      date: new Date(2026, 3, 15), // 2026-04-15
      category: "Infraestrutura",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    createObjectURLMock.mockReturnValue("blob:mock-url");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders export button", () => {
    render(<ExportarTransacoes transactions={mockTransactions} />);
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeTruthy();
  });

  it("triggers download with correct filename when clicking the button", () => {
    vi.setSystemTime(new Date(2026, 4, 20)); // 2026-05-20
    render(<ExportarTransacoes transactions={mockTransactions} />);
    const button = screen.getByRole("button", { name: /exportar csv/i });
    fireEvent.click(button);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledWith("download", expect.stringMatching(/transacoes-piggbank-20260520\.csv/));
    expect(anchorClickSpy).toHaveBeenCalled();
  });

  it("shows alert when no transactions are available to export", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<ExportarTransacoes transactions={[]} />);
    const button = screen.getByRole("button", { name: /exportar csv/i });
    fireEvent.click(button);

    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/não há transações para exportar/i));
    expect(createObjectURLMock).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it("handles transactions with special characters and commas", () => {
    const specialTransactions: Transaction[] = [
      {
        id: "3",
        description: "Café, pão e leite (açúcar)",
        amount: 50,
        type: "expense",
        date: new Date(2026, 3, 20),
        category: "Alimentação",
      },
    ];
    render(<ExportarTransacoes transactions={specialTransactions} />);
    const button = screen.getByRole("button", { name: /exportar csv/i });
    fireEvent.click(button);

    expect(createObjectURLMock).toHaveBeenCalled();
  });
});
