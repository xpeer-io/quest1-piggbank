import { describe, it, expect } from "vitest";
import { formatCsvValue, generateCsvContent } from "./csv";
import type { Transaction } from "@/types";

describe("CSV Utilities (Versão Gemini)", () => {
  describe("formatCsvValue", () => {
    it("should escape commas by wrapping in quotes", () => {
      expect(formatCsvValue("Salário, Bônus")).toBe('"Salário, Bônus"');
    });

    it("should double quotes inside a string", () => {
      expect(formatCsvValue('Compra "Gamer"')).toBe('"Compra ""Gamer"""');
    });

    it("should format numbers with 2 decimal places", () => {
      expect(formatCsvValue(1250.5)).toBe("1250.50");
      expect(formatCsvValue(100)).toBe("100.00");
    });

    it("should preserve special characters (UTF-8)", () => {
      expect(formatCsvValue("Alimentação")).toBe("Alimentação");
    });
  });

  describe("generateCsvContent", () => {
    it("should generate a CSV with header and mapped values", () => {
      const transactions: Transaction[] = [
        {
          id: "1",
          date: new Date("2026-05-01"),
          type: "income",
          amount: 5000,
          category: "Salário",
        },
        {
          id: "2",
          date: new Date("2026-05-02"),
          type: "expense",
          amount: 150.75,
          category: "Lazer, Cinema",
        },
      ];

      const csv = generateCsvContent(transactions);
      const lines = csv.split("\n");

      expect(lines[0]).toBe("Data,Tipo,Valor,Categoria");
      expect(lines[1]).toBe("2026-05-01,Entrada,5000.00,Salário");
      expect(lines[2]).toBe('2026-05-02,Saída,150.75,"Lazer, Cinema"');
    });

    it("should return only the header for empty transaction list", () => {
      const csv = generateCsvContent([]);
      expect(csv).toBe("Data,Tipo,Valor,Categoria");
    });
  });
});
