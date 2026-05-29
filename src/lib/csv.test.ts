import { describe, it, expect } from "vitest";
import { generateCSV } from "./csv";
import type { Transaction } from "@/types";

describe("generateCSV", () => {
  it("generates a CSV with correct headers", () => {
    const csv = generateCSV([]);
    expect(csv.startsWith("Data,Tipo,Valor,Categoria,Descrição")).toBe(true);
  });

  it("formats transactions correctly (Scenario 1 & 7)", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Venda",
        amount: 1500.5,
        type: "income",
        date: new Date(2026, 3, 10), // 10/04/2026
        category: "Vendas",
      },
    ];
    const csv = generateCSV(transactions);
    const lines = csv.trim().split("\n");
    expect(lines[1]).toBe("2026-04-10,Entrada,1500.5,Vendas,Venda");
  });

  it("handles special characters (Scenario 5)", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Manutenção de Ações (Ç/Á)",
        amount: 100,
        type: "expense",
        date: new Date(2026, 3, 10),
        category: "Financeiro",
      },
    ];
    const csv = generateCSV(transactions);
    expect(csv).toContain("Manutenção de Ações (Ç/Á)");
  });

  it("escapes commas and newlines (Scenario 6)", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: 'Descrição com "aspas", vírgula e\nquebra de linha',
        amount: 100,
        type: "expense",
        date: new Date(2026, 3, 10),
        category: "Teste",
      },
    ];
    const csv = generateCSV(transactions);
    // CSV standard: fields with commas/newlines should be quoted, quotes should be doubled
    expect(csv).toContain('"Descrição com ""aspas"", vírgula e\nquebra de linha"');
  });

  it("exports monetary values with correct signal (Scenario 8)", () => {
    const transactions: Transaction[] = [
      { id: "1", description: "In", amount: 100, type: "income", date: new Date(), category: "C" },
      { id: "2", description: "Out", amount: 50, type: "expense", date: new Date(), category: "C" },
      { id: "3", description: "Zero", amount: 0, type: "income", date: new Date(), category: "C" },
    ];
    const csv = generateCSV(transactions);
    expect(csv).toContain(",Entrada,100,");
    expect(csv).toContain(",Saída,50,");
    expect(csv).toContain(",Entrada,0,");
  });

  it("handles large volume of data (Scenario 9)", () => {
    const transactions: Transaction[] = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      description: `Transação ${i}`,
      amount: i,
      type: "income",
      date: new Date(),
      category: "Teste",
    }));
    const csv = generateCSV(transactions);
    const lines = csv.trim().split("\n");
    expect(lines.length).toBe(1001); // headers + 1000 records
  });
});
