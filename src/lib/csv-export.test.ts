import { describe, it, expect } from "vitest";
import { exportTransactionsToCSV, generateCSVContent } from "./csv-export";
import { mockTransactions } from "@/data/mock";
import type { Transaction } from "@/types";

describe("CSV Export - Cenário 1: Exportação Bem-Sucedida", () => {
  it("deve gerar conteúdo CSV válido com transações", () => {
    const csv = generateCSVContent(mockTransactions);
    
    expect(csv).toBeTruthy();
    expect(typeof csv).toBe("string");
  });

  it("deve incluir cabeçalhos CSV", () => {
    const csv = generateCSVContent(mockTransactions);
    const lines = csv.split("\n");
    
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]).toContain("Data");
    expect(lines[0]).toContain("Descrição");
    expect(lines[0]).toContain("Valor");
    expect(lines[0]).toContain("Tipo");
    expect(lines[0]).toContain("Categoria");
  });

  it("deve incluir todas as transações no CSV", () => {
    const csv = generateCSVContent(mockTransactions);
    const lines = csv.split("\n").filter((line) => line.trim());
    
    // 1 linha de cabeçalho + N transações
    expect(lines.length).toBe(mockTransactions.length + 1);
  });

  it("deve formatar valores monetários com 2 casas decimais", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Teste",
        amount: 1000,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("1000.00");
  });

  it("deve formatar datas corretamente", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Teste",
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("2026-04-10");
  });

  it("deve escapar valores com vírgula entre aspas", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Descrição, com, vírgulas",
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Categoria",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain('"Descrição, com, vírgulas"');
  });

  it("deve escapar valores com aspas", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: 'Descrição com "aspas"',
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Categoria",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    // Aspas duplas devem ser escapadas
    expect(csv).toContain('""');
  });

  it("deve manter a ordem das colunas", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Teste",
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    const lines = csv.split("\n");
    const header = lines[0];
    
    const dataIndex = header.indexOf("Data");
    const descIndex = header.indexOf("Descrição");
    const valorIndex = header.indexOf("Valor");
    
    expect(dataIndex).toBeLessThan(descIndex);
    expect(descIndex).toBeLessThan(valorIndex);
  });

  it("deve gerar arquivo com nome correto", () => {
    const filename = exportTransactionsToCSV(mockTransactions);
    
    expect(filename).toMatch(/transacoes-\d{4}-\d{2}-\d{2}\.csv/);
  });

  it("deve incluir data do dia no nome do arquivo", () => {
    const today = new Date().toISOString().split("T")[0];
    const filename = exportTransactionsToCSV(mockTransactions);
    
    expect(filename).toContain(today);
  });
});

describe("CSV Export - Cenário 2: Sem Transações", () => {
  it("deve gerar CSV com cabeçalhos vazios quando não há transações", () => {
    const csv = generateCSVContent([]);
    const lines = csv.split("\n").filter((line) => line.trim());
    
    // Apenas linha de cabeçalho
    expect(lines.length).toBe(1);
  });

  it("deve manter estrutura de cabeçalhos com transações vazias", () => {
    const csv = generateCSVContent([]);
    
    expect(csv).toContain("Data");
    expect(csv).toContain("Descrição");
    expect(csv).toContain("Valor");
    expect(csv).toContain("Tipo");
    expect(csv).toContain("Categoria");
  });

  it("deve gerar nome de arquivo válido mesmo sem transações", () => {
    const filename = exportTransactionsToCSV([]);
    
    expect(filename).toMatch(/transacoes-\d{4}-\d{2}-\d{2}\.csv/);
  });
});

describe("CSV Export - Casos Adicionais", () => {
  it("deve diferenciar entre income e expense", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Receita",
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Receita",
      },
      {
        id: "2",
        description: "Despesa",
        amount: 50,
        type: "expense",
        date: new Date("2026-04-10"),
        category: "Despesa",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("income");
    expect(csv).toContain("expense");
  });

  it("deve suportar números grandes", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Valor grande",
        amount: 999999.99,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("999999.99");
  });

  it("deve suportar valores pequenos", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Valor pequeno",
        amount: 0.01,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("0.01");
  });

  it("deve preservar ordem das transações", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Primeira",
        amount: 100,
        type: "income",
        date: new Date("2026-04-10"),
        category: "Teste",
      },
      {
        id: "2",
        description: "Segunda",
        amount: 200,
        type: "income",
        date: new Date("2026-04-11"),
        category: "Teste",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    const lines = csv.split("\n");
    
    const firstIndex = csv.indexOf("Primeira");
    const secondIndex = csv.indexOf("Segunda");
    
    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it("deve utilizar encoding UTF-8", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        description: "Café com açúcar",
        amount: 15,
        type: "expense",
        date: new Date("2026-04-10"),
        category: "Alimentação",
      },
    ];
    
    const csv = generateCSVContent(transactions);
    expect(csv).toContain("Café com açúcar");
    expect(csv).toContain("Alimentação");
  });
});
