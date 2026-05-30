import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportarTransacoes } from "./ExportarTransacoes";
import type { Transaction } from "@/types";

// Mocking URL methods and anchor click for download simulation
const createObjectURLSpy = vi.fn(() => "blob:mock-url");
const revokeObjectURLSpy = vi.fn();
const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

describe("ExportarTransacoes", () => {
  const originalURL = window.URL;

  beforeEach(() => {
    window.URL.createObjectURL = createObjectURLSpy;
    window.URL.revokeObjectURL = revokeObjectURLSpy;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.URL = originalURL;
  });

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      description: "Salário",
      amount: 5000,
      type: "income",
      date: new Date("2026-05-01T10:00:00Z"),
      category: "Trabalho",
    },
    {
      id: "2",
      description: "Aluguel",
      amount: 1500,
      type: "expense",
      date: new Date("2026-05-05T10:00:00Z"),
      category: "Moradia",
    },
  ];

  describe("Cenário 1: Exportação Bem-Sucedida", () => {
    it("deve gerar um arquivo CSV com as colunas corretas e iniciar o download", async () => {
      render(<ExportarTransacoes transactions={mockTransactions} />);
      
      const button = screen.getByRole("button", { name: /exportar csv/i });
      fireEvent.click(button);

      expect(createObjectURLSpy).toHaveBeenCalled();
      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await blob.text();

      // Verifica cabeçalho
      expect(csvContent).toContain("Data,Tipo,Valor,Categoria");
      
      // Verifica se os dados estão presentes (ajustado para o formato yyyy-MM-dd do componente)
      expect(csvContent).toContain("2026-05-01,Entrada,5000,Trabalho");
      expect(csvContent).toContain("2026-05-05,Saída,1500,Moradia");
      
      expect(anchorClickSpy).toHaveBeenCalled();
    });
  });

  describe("Cenário 2: Sem Transações", () => {
    it("deve gerar um CSV apenas com cabeçalhos quando não houver transações", async () => {
      render(<ExportarTransacoes transactions={[]} />);
      
      const button = screen.getByRole("button", { name: /exportar csv/i });
      fireEvent.click(button);

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await blob.text();

      expect(csvContent).toBe("Data,Tipo,Valor,Categoria\r\n");
    });
  });

  describe("Cenário 3: Caracteres Especiais e Acentuação", () => {
    it("deve garantir que a codificação UTF-8 preserve caracteres acentuados", async () => {
      const transactionWithAccents: Transaction[] = [{
        id: "3",
        description: "Almoço",
        amount: 50,
        type: "expense",
        date: new Date("2026-05-10T10:00:00Z"),
        category: "Produção",
      }];

      render(<ExportarTransacoes transactions={transactionWithAccents} />);
      
      const button = screen.getByRole("button", { name: /exportar csv/i });
      fireEvent.click(button);

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await blob.text();

      expect(csvContent).toContain("Produção");
      expect(blob.type).toContain("charset=utf-8");
    });
  });
});
