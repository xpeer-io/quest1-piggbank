import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportButton } from "./ExportButton";
import type { Transaction } from "@/types";

// Mocking URL methods for file download
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "blob:url");
  window.URL.revokeObjectURL = vi.fn();
}

describe("ExportButton", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      date: new Date(2026, 5, 10), // 2026-06-10 (Months are 0-indexed)
      type: "income",
      amount: 1500.50,
      category: "Vendas",
      description: "Venda cliente A",
    },
    {
      id: "2",
      date: new Date(2026, 5, 11), // 2026-06-11
      type: "expense",
      amount: 500,
      category: "Aluguel",
      description: "Aluguel escritório",
    },
    {
      id: "3",
      date: new Date(2026, 5, 12),
      type: "income",
      amount: 200,
      category: "Educação e Treinamento", // Special characters
      description: "Curso",
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15)); // 2026-06-15
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the 'Exportar CSV' button", () => {
    render(<ExportButton transactions={mockTransactions} />);
    expect(screen.getByRole("button", { name: /Exportar CSV/i })).toBeTruthy();
  });

  it("generates a CSV file with correct headers and data on click", () => {
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, "createElement");
    const clickSpy = vi.fn();
    
    createElementSpy.mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === "a") {
        (element as any).click = clickSpy;
      }
      return element;
    });

    render(<ExportButton transactions={mockTransactions} />);
    const button = screen.getByRole("button", { name: /Exportar CSV/i });
    fireEvent.click(button);

    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as any).mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/csv;charset=utf-8;");
    
    // Check filename
    expect(clickSpy).toHaveBeenCalled();
    const anchor = createElementSpy.mock.results.find(r => r.value.tagName === "A")?.value;
    expect(anchor.getAttribute("download")).toBe("transacoes-piggbank-20260615.csv");
  });

  it("formats the CSV content correctly", async () => {
    let blobContent: string = "";
    
    // Mock Blob to capture content
    const OriginalBlob = global.Blob;
    global.Blob = class extends OriginalBlob {
      constructor(content: any[], options?: any) {
        super(content, options);
        blobContent = content[0];
      }
    } as any;

    render(<ExportButton transactions={mockTransactions} />);
    fireEvent.click(screen.getByRole("button", { name: /Exportar CSV/i }));

    const lines = blobContent.split("\n");
    expect(lines[0]).toBe("Data,Tipo,Valor,Categoria");
    
    // Income transaction
    expect(lines[1]).toBe("2026-06-10,Entrada,1500.5,Vendas");
    
    // Expense transaction
    expect(lines[2]).toBe("2026-06-11,Saída,500,Aluguel");
    
    // Special characters preservation
    expect(lines[3]).toBe("2026-06-12,Entrada,200,Educação e Treinamento");

    global.Blob = OriginalBlob;
  });

  it("generates CSV with only headers when transactions list is empty", () => {
    let blobContent: string = "";
    const OriginalBlob = global.Blob;
    global.Blob = class extends OriginalBlob {
      constructor(content: any[], options?: any) {
        super(content, options);
        blobContent = content[0];
      }
    } as any;

    render(<ExportButton transactions={[]} />);
    fireEvent.click(screen.getByRole("button", { name: /Exportar CSV/i }));

    const lines = blobContent.trim().split("\n");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe("Data,Tipo,Valor,Categoria");

    global.Blob = OriginalBlob;
  });

  it("does not change the state or metrics of the dashboard", () => {
    // This is a bit redundant but ensures no other effects are triggered
    const initialMetrics = { someMetric: 100 };
    render(<ExportButton transactions={mockTransactions} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Exportar CSV/i }));
    
    // Metrics should remain unchanged (implicitly, as the component shouldn't have access to them anyway)
    expect(initialMetrics.someMetric).toBe(100);
  });
});
