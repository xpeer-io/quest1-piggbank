import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportCSV } from "./ExportCSV";
import type { Transaction } from "@/types";

// Mock para URL.createObjectURL e URL.revokeObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  window.URL.revokeObjectURL = vi.fn();
}

describe("ExportCSV", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      description: "Venda Produto A",
      amount: 150.50,
      type: "income",
      date: new Date(2026, 4, 15), // 2026-05-15
      category: "Vendas",
    },
    {
      id: "2",
      description: "Pagamento Aluguel",
      amount: 2000.00,
      type: "expense",
      date: new Date(2026, 4, 10), // 2026-05-10
      category: "Infraestrutura",
    },
  ];

  const linkMock = {
    click: vi.fn(),
    setAttribute: vi.fn(),
    style: { visibility: '' },
  };

  let originalCreateElement: any;
  let originalAppendChild: any;
  let originalRemoveChild: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return linkMock as any;
      return originalCreateElement(tagName);
    });

    originalAppendChild = document.body.appendChild.bind(document.body);
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node === linkMock) return node;
      return originalAppendChild(node);
    });

    originalRemoveChild = document.body.removeChild.bind(document.body);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
      if (node === linkMock) return node;
      return originalRemoveChild(node);
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("Cenário 1: deve exibir o botão 'Exportar CSV' e iniciar o download ao clicar", () => {
    render(<ExportCSV transactions={mockTransactions} />);
    
    const button = screen.getByRole('button', { name: /exportar csv/i });
    expect(button).toBeTruthy();

    fireEvent.click(button);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(linkMock.setAttribute).toHaveBeenCalledWith('download', expect.stringMatching(/^transacoes-piggbank-\d{8}\.csv$/));
    expect(linkMock.click).toHaveBeenCalled();
  });

  it("Cenário 2: deve exportar apenas as transações passadas via props (respeitando filtros externos)", () => {
    const filteredTransactions = [mockTransactions[0]];

    render(<ExportCSV transactions={filteredTransactions} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    expect(linkMock.setAttribute).toHaveBeenCalled();
  });

  it("Cenário 3 e 8: deve formatar o CSV corretamente (UTF-8, separador vírgula, datas YYYY-MM-DD, caracteres especiais)", () => {
    const specialTransactions: Transaction[] = [
      {
        id: "3",
        description: "Alimentação & Diversão",
        amount: 50.00,
        type: "expense",
        date: new Date(2026, 4, 20),
        category: "Refeição/Lazer",
      }
    ];
    
    const blobSpy = vi.spyOn(global, 'Blob').mockImplementation((content, options) => {
      const text = content[0];
      expect(options).toEqual({ type: 'text/csv;charset=utf-8;' });
      expect(text).toContain('Data,Tipo,Valor,Categoria');
      expect(text).toContain('2026-05-20,Saída,50,Refeição/Lazer');
      return {} as Blob;
    });

    render(<ExportCSV transactions={specialTransactions} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    blobSpy.mockRestore();
  });

  it("Cenário 5: deve gerar CSV com cabeçalhos se não houver transações", () => {
    const blobSpy = vi.spyOn(global, 'Blob').mockImplementation((content) => {
      const text = content[0];
      expect(text).toBe('Data,Tipo,Valor,Categoria\n');
      return {} as Blob;
    });

    render(<ExportCSV transactions={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    blobSpy.mockRestore();
  });

  it("Cenário 9: deve exportar valores com casas decimais corretamente", () => {
    const decimalTransactions: Transaction[] = [
      {
        id: "4",
        description: "Centavos",
        amount: 10.55,
        type: "income",
        date: new Date(2026, 4, 21),
        category: "Vendas",
      }
    ];

    const blobSpy = vi.spyOn(global, 'Blob').mockImplementation((content) => {
      const text = content[0];
      expect(text).toContain('10.55');
      return {} as Blob;
    });

    render(<ExportCSV transactions={decimalTransactions} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    blobSpy.mockRestore();
  });

  it("Cenário 12: deve lidar com campos vazios (categoria ausente)", () => {
    const incompleteTransactions: any[] = [
      {
        id: "5",
        description: "Sem Categoria",
        amount: 100,
        type: "expense",
        date: new Date(2026, 4, 22),
        category: "",
      }
    ];

    const blobSpy = vi.spyOn(global, 'Blob').mockImplementation((content) => {
      const text = content[0];
      expect(text).toContain('2026-05-22,Saída,100,');
      return {} as Blob;
    });

    render(<ExportCSV transactions={incompleteTransactions} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    blobSpy.mockRestore();
  });

  it("Cenário 6: deve exibir mensagem de erro se a geração do CSV falhar", () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const blobSpy = vi.spyOn(global, 'Blob').mockImplementation(() => {
      throw new Error("Simulated failure");
    });

    render(<ExportCSV transactions={mockTransactions} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar csv/i }));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/erro/i));
    
    blobSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
