import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateCSV, exportarCSV } from "./csv";
import { Transaction } from "@/types";

describe("CSV Export", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      description: "Salário",
      amount: 5000,
      type: "income",
      date: new Date(2026, 4, 29), // 29/05/2026
      category: "Trabalho",
    },
    {
      id: "2",
      description: "Aluguel",
      amount: 1500,
      type: "expense",
      date: new Date(2026, 4, 30), // 30/05/2026
      category: "Moradia",
    },
  ];

  describe("generateCSV", () => {
    it("deve gerar o formato correto do CSV com cabeçalhos e dados (Cenário 2)", () => {
      const csv = generateCSV(mockTransactions);
      const lines = csv.split("\n");
      
      expect(lines[0]).toBe("Data,Tipo,Valor,Categoria");
      expect(lines[1]).toBe("2026-05-29,Entrada,5000,Trabalho");
      expect(lines[2]).toBe("2026-05-30,Saída,1500,Moradia");
    });

    it("deve gerar apenas cabeçalhos quando não houver transações (Cenário 3)", () => {
      const csv = generateCSV([]);
      expect(csv).toBe("Data,Tipo,Valor,Categoria");
    });

    it("deve envolver em aspas campos com vírgulas (Cenário 4)", () => {
      const transactions: Transaction[] = [
        {
          id: "3",
          description: "Teste",
          amount: 100,
          type: "expense",
          date: new Date(2026, 4, 29),
          category: "Lazer, Entretenimento",
        },
      ];
      
      const csv = generateCSV(transactions);
      expect(csv).toContain('"Lazer, Entretenimento"');
    });

    it("deve preservar acentos corretamente em UTF-8 (Cenário 4)", () => {
      const transactions: Transaction[] = [
        {
          id: "4",
          description: "Refeição",
          amount: 50,
          type: "expense",
          date: new Date(2026, 4, 29),
          category: "Alimentação",
        },
      ];
      
      const csv = generateCSV(transactions);
      expect(csv).toContain("Alimentação");
    });
  });

  describe("exportarCSV", () => {
    beforeEach(() => {
      // Mock do ambiente do navegador
      global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
      global.URL.revokeObjectURL = vi.fn();
      
      // Mock do document.createElement para interceptar o link de download
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "a") {
          return {
            setAttribute: vi.fn(),
            style: {},
            click: vi.fn(),
          } as any;
        }
        return document.createElement(tagName);
      });

      vi.spyOn(document.body, "appendChild").mockImplementation(() => ({} as any));
      vi.spyOn(document.body, "removeChild").mockImplementation(() => ({} as any));
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deve iniciar o download com o nome de arquivo correto incluindo a data (Cenário 1 e 5)", () => {
      // Fixar a data do sistema para o teste
      const mockToday = new Date(2026, 4, 29); // 29/05/2026
      vi.useFakeTimers();
      vi.setSystemTime(mockToday);

      const mockLink = {
        setAttribute: vi.fn(),
        style: {},
        click: vi.fn(),
      };
      
      vi.spyOn(document, "createElement").mockReturnValue(mockLink as any);

      exportarCSV(mockTransactions);

      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        "download",
        "transacoes-piggbank-20260529.csv"
      );
      expect(mockLink.click).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});
