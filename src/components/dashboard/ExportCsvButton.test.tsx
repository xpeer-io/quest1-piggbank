import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportCsvButton } from "./ExportCsvButton";
import * as csvUtils from "@/lib/csv";
import type { Transaction } from "@/types";

vi.mock("@/lib/csv", () => ({
  generateCsvContent: vi.fn(() => "mock,csv,content"),
  downloadCsv: vi.fn(),
}));

describe("ExportCsvButton (Versão Gemini)", () => {
  const mockTransactions: Transaction[] = [
    { id: "1", date: new Date(), type: "income", amount: 100, category: "Test" },
  ];

  it("should render with correct label", () => {
    render(<ExportCsvButton transactions={mockTransactions} />);
    expect(screen.getByText(/Exportar CSV/i)).toBeDefined();
  });

  it("should be disabled when there are no transactions", () => {
    render(<ExportCsvButton transactions={[]} />);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("should call download function when clicked", () => {
    render(<ExportCsvButton transactions={mockTransactions} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    expect(csvUtils.generateCsvContent).toHaveBeenCalledWith(mockTransactions);
    expect(csvUtils.downloadCsv).toHaveBeenCalled();
  });

  it("should generate filename with current date", () => {
    const spy = vi.spyOn(csvUtils, "downloadCsv");
    render(<ExportCsvButton transactions={mockTransactions} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    const call = spy.mock.calls[0];
    const filename = call[1];
    
    expect(filename).toMatch(/transacoes-piggbank-\d{8}\.csv/);
  });
});
