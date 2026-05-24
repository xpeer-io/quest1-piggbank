import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockAddTransaction = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

vi.mock("@/lib/TransactionContext", () => ({
  useTransactions: () => ({
    addTransaction: mockAddTransaction,
    transactions: [],
    isLoading: false,
  }),
}));

import NewTransactionPage from "./page";

describe("NewTransactionPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockAddTransaction.mockClear();
  });

  afterEach(() => {
    cleanup();
  });
  it("renders the modal title", () => {
    render(<NewTransactionPage />);
    expect(screen.getByText("Nova Transação")).toBeTruthy();
  });

  it("renders the modal subtitle", () => {
    render(<NewTransactionPage />);
    expect(
      screen.getByText("Insira os detalhes do fluxo financeiro")
    ).toBeTruthy();
  });

  it("renders transaction type labels Entrada and Saída", () => {
    render(<NewTransactionPage />);
    const allText = screen.getAllByText(/Entrada|Saída/);
    expect(allText.length).toBeGreaterThan(0);
  });

  it("renders action buttons", () => {
    render(<NewTransactionPage />);
    expect(screen.getByText("Salvar Transação")).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
  });

  it("renders category select element", () => {
    render(<NewTransactionPage />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThan(0);
  });

  it("renders background dashboard elements", () => {
    render(<NewTransactionPage />);
    expect(screen.getByText("Capital Control")).toBeTruthy();
    expect(screen.getByText("Total Balance")).toBeTruthy();
    expect(screen.getByText("Recent Transactions")).toBeTruthy();
  });

  it("renders navigation items", () => {
    render(<NewTransactionPage />);
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.getByText("Ledger")).toBeTruthy();
    expect(screen.getByText("Insights")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("has form with inputs for transaction", () => {
    const { container } = render(<NewTransactionPage />);
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    
    const inputs = form?.querySelectorAll("input");
    expect(inputs && inputs.length).toBeGreaterThan(0);
  });

  it("accepts numeric input for transaction value", () => {
    render(<NewTransactionPage />);
    const spinButtons = screen.getAllByRole("spinbutton");
    if (spinButtons[0]) {
      fireEvent.change(spinButtons[0], { target: { value: "1234.56" } });
      expect((spinButtons[0] as HTMLInputElement).value).toBe("1234.56");
    }
  });

  it("submits form on button click", () => {
    const { container } = render(<NewTransactionPage />);

    const numberInput = container.querySelector('input[type="number"]');
    const dateInput = container.querySelector('input[type="date"]');

    expect(numberInput).toBeTruthy();
    expect(dateInput).toBeTruthy();

    fireEvent.change(numberInput as HTMLInputElement, {
      target: { value: "1234.56" },
    });
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { value: "2026-05-15" },
    });

    const submitButton = screen.getByText("Salvar Transação");
    fireEvent.click(submitButton);

    expect(mockAddTransaction).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("renders all currency transaction inputs", () => {
    render(<NewTransactionPage />);
    expect(screen.getByText("Valor da Transação")).toBeTruthy();
  });

  it("has correct styling classes", () => {
    const { container } = render(<NewTransactionPage />);
    const modal = container.querySelector(".fixed.inset-0");
    expect(modal).toBeTruthy();
  });
});
