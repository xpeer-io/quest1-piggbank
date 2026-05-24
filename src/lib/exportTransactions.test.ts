import { describe, it, expect } from "vitest";
import { buildExportFilename, escapeCsvField, formatTransactionToCsvRow, transactionsToCsv } from "@/lib/exportTransactions";
import type { Transaction } from "@/types";

const standardTransactions: Transaction[] = [
  {
    id: "1",
    description: "Assinatura cliente Acme Corp",
    amount: 12000,
    type: "income",
    date: new Date(2026, 3, 10),
    category: "Assinatura",
  },
  {
    id: "2",
    description: "AWS — infraestrutura",
    amount: 2800,
    type: "expense",
    date: new Date(2026, 3, 8),
    category: "Infraestrutura",
  },
  {
    id: "3",
    description: "Consultoria design",
    amount: 4500,
    type: "expense",
    date: new Date(2026, 3, 5),
    category: "Serviços",
  },
  {
    id: "4",
    description: "Assinatura cliente Beta Ltda",
    amount: 8500,
    type: "income",
    date: new Date(2026, 3, 3),
    category: "Assinatura",
  },
  {
    id: "5",
    description: "Licença ferramentas dev",
    amount: 1800,
    type: "expense",
    date: new Date(2026, 2, 28),
    category: "Software",
  },
];

describe("exportTransactions util", () => {
  it("generates a CSV with header and all standard rows", () => {
    const csv = transactionsToCsv(standardTransactions);
    expect(csv).toContain("Data,Tipo,Valor,Categoria");
    expect(csv.split("\r\n").length).toBe(standardTransactions.length + 2);
    expect(csv).toContain("2026-04-10,Entrada,12000.00,Assinatura");
  });

  it("generates a filename in the required format", () => {
    const filename = buildExportFilename();
    expect(filename).toMatch(/^transacoes-piggbank-\d{8}\.csv$/);
  });

  it("preserves categories containing special characters", () => {
    const transaction: Transaction = {
      id: "7",
      description: "Exportação teste",
      amount: 100,
      type: "income",
      date: new Date(2026, 4, 15),
      category: "Pré-venda, Infraestrutura",
    };
    const csv = transactionsToCsv([transaction]);
    expect(csv).toContain('"Pré-venda, Infraestrutura"');
  });

  it("formats values as two decimal places and preserves negative sign", () => {
    const transaction: Transaction = {
      id: "8",
      description: "Ajuste negativo",
      amount: -1000,
      type: "income",
      date: new Date(2026, 4, 10),
      category: "Ajuste",
    };
    const row = formatTransactionToCsvRow(transaction);
    expect(row).toContain("-1000.00");
  });

  it("generates header-only CSV when no transactions are provided", () => {
    const csv = transactionsToCsv([]);
    expect(csv).toBe("Data,Tipo,Valor,Categoria\r\n");
  });

  it("preserves IDs with special characters only in internal transaction handling", () => {
    const transaction: Transaction = {
      id: "txn_abc123-def_456",
      description: "Descrição especial",
      amount: 500,
      type: "expense",
      date: new Date(2026, 4, 17),
      category: "Manutenção",
    };
    const csv = transactionsToCsv([transaction]);
    expect(csv).toContain("2026-05-17,Saída,500.00,Manutenção");
  });

  it("keeps zero values as 0.00", () => {
    const transaction: Transaction = {
      id: "10",
      description: "Grátis",
      amount: 0,
      type: "expense",
      date: new Date(2026, 4, 18),
      category: "Promoção",
    };
    const csv = transactionsToCsv([transaction]);
    expect(csv).toContain("2026-05-18,Saída,0.00,Promoção");
  });

  it("keeps very small values with two decimals", () => {
    const transaction: Transaction = {
      id: "11",
      description: "Micro transação",
      amount: 0.01,
      type: "expense",
      date: new Date(2026, 4, 18),
      category: "Teste",
    };
    const csv = transactionsToCsv([transaction]);
    expect(csv).toContain("2026-05-18,Saída,0.01,Teste");
  });

  it("escapes quotes inside fields correctly", () => {
    const escaped = escapeCsvField('"Café & Consultoria", R$100; €50');
    expect(escaped).toBe('"""Café & Consultoria"", R$100; €50"');
  });
});
