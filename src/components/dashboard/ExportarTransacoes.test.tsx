import { describe, it, expect } from "vitest";
import { mockTransactions } from "@/data/mock";
import { generateTransactionsCsv } from "@/lib/export";
import { formatUrlDate } from "@/lib/date";

describe("generateTransactionsCsv", () => {
  it("generates CSV and filename for transactions", () => {
    const now = new Date("2026-04-11");
    const { filename, csv } = generateTransactionsCsv(mockTransactions.slice(0, 2), { now });
    expect(filename).toBe("transacoes-piggbank-20260411.csv");
    expect(csv).toContain("Date,Type,Amount,Category");
    // first transaction date and category present
    expect(csv).toContain(mockTransactions[0].date.toISOString().slice(0, 10));
    expect(csv).toContain("Assinatura");
  });

  it("returns header only when no transactions", () => {
    const { filename, csv } = generateTransactionsCsv([] as any[], { now: new Date("2026-05-01") });
    expect(filename).toBe("transacoes-piggbank-20260501.csv");
    expect(csv.trim()).toBe("Date,Type,Amount,Category");
  });

  it("escapes fields with commas and preserves UTF-8 characters", () => {
    const special = [
      {
        id: "x",
        description: "Conta, com vírgula",
        amount: 123,
        type: "income",
        date: new Date("2026-01-02"),
        category: "Café, e coisas",
      },
    ];
    const { csv } = generateTransactionsCsv(special as any);
    // category should be quoted because it contains comma
    expect(csv).toContain('"Café, e coisas"');
    expect(csv).toContain(new Date("2026-01-02").toISOString().slice(0, 10));
  });

  it("filters by date range when provided", () => {
    const from = new Date("2026-03-01");
    const to = new Date("2026-03-30");
    const { csv } = generateTransactionsCsv(mockTransactions, { from, to });
    // expect only transactions with date in March appear (ids 5,6,7,8 in mock)
    expect(csv).toContain(new Date("2026-03-28").toISOString().slice(0, 10));
    expect(csv).not.toContain(new Date("2026-04-10").toISOString().slice(0, 10));
  });
});
