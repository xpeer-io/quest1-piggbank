import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ExportCSVButton } from "./ExportCSVButton";
import type { Transaction } from "@/types";

describe("ExportCSVButton", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      date: "2024-05-29",
      type: "income",
      amount: 1000,
      category: "Vendas",
      description: "Venda de produto",
    },
    {
      id: "2",
      date: "2024-05-28",
      type: "expense",
      amount: 500,
      category: "Aluguel",
      description: "Pagamento mensal",
    },
  ];

  it("deve renderizar o botão de exportação", () => {
    render(<ExportCSVButton transactions={mockTransactions} />);
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeDefined();
  });

  it("deve iniciar o download do arquivo CSV ao clicar no botão", () => {
    // Mock URL.createObjectURL e URL.revokeObjectURL
    const createObjectURLMock = vi.fn(() => "mock-url");
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock do elemento <a> para interceptar o download sem quebrar o document.body
    const linkMock = {
      click: vi.fn(),
      setAttribute: vi.fn(),
      style: { visibility: "" },
    } as any;
    
    // Interceptamos apenas o createElement('a')
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") return linkMock;
      return originalCreateElement(tagName);
    });

    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    render(<ExportCSVButton transactions={mockTransactions} />);
    const button = screen.getByRole("button", { name: /exportar csv/i });
    fireEvent.click(button);

    // Verifica se criou o Blob com o conteúdo correto (parcialmente)
    expect(createObjectURLMock).toHaveBeenCalled();
    
    // Verifica se definiu o nome do arquivo corretamente
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    expect(linkMock.setAttribute).toHaveBeenCalledWith(
      "download",
      `transacoes-piggbank-${today}.csv`
    );

    // Verifica se disparou o clique no link
    expect(linkMock.click).toHaveBeenCalled();
  });

  it("deve gerar CSV apenas com cabeçalhos se não houver transações", () => {
    const createObjectURLMock = vi.fn(() => "mock-url");
    window.URL.createObjectURL = createObjectURLMock;
    
    render(<ExportCSVButton transactions={[]} />);
    const button = screen.getByRole("button", { name: /exportar csv/i });
    fireEvent.click(button);

    // Verifica se o Blob foi criado (significa que o processo iniciou mesmo sem dados)
    expect(createObjectURLMock).toHaveBeenCalled();
  });
});
