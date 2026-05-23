import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportarTransacoes } from "./ExportarTransacoes";
import type { Transaction } from "@/types";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "1",
  description: "Assinatura Acme",
  amount: 1200,
  type: "income",
  date: new Date(2026, 3, 10),
  category: "Assinatura",
  ...overrides,
});

describe("ExportarTransacoes", () => {
  const originalURL = window.URL;
  const createObjectURLSpy = vi.fn(() => "blob:mock");
  const revokeObjectURLSpy = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, "URL", {
      configurable: true,
      writable: true,
      value: {
        ...originalURL,
        createObjectURL: createObjectURLSpy,
        revokeObjectURL: revokeObjectURLSpy,
      },
    });

    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  });

  afterEach(() => {
    Object.defineProperty(window, "URL", {
      configurable: true,
      writable: true,
      value: originalURL,
    });
    createObjectURLSpy.mockReset();
  });

  it("renders the export button", () => {
    render(<ExportarTransacoes transactions={[]} />);

    expect(
      screen.getByRole("button", { name: /exportar csv/i }),
    ).toBeTruthy();
  });

  it("exports a CSV file when transactions exist", async () => {
    const transactions = [
      makeTransaction({ id: "1", description: "Receita A", type: "income", amount: 1500 }),
      makeTransaction({ id: "2", description: "Compra B", type: "expense", amount: 800 }),
    ];

    render(<ExportarTransacoes transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: /exportar csv/i }));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    const exportedBlob = createObjectURLSpy.mock.calls[0][0] as Blob;
    expect(exportedBlob).toBeInstanceOf(Blob);

    const csvText = await exportedBlob.text();
    expect(csvText).toContain("Data,Tipo,Valor,Categoria");
    expect(csvText).toContain("2026-04-10,Entrada,1500,Assinatura");
    expect(csvText).toContain("2026-04-10,Saída,800,Assinatura");
  });

  it("exports a header-only CSV when there are no transactions", async () => {
    render(<ExportarTransacoes transactions={[]} />);

    fireEvent.click(screen.getByRole("button", { name: /exportar csv/i }));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    const exportedBlob = createObjectURLSpy.mock.calls[0][0] as Blob;
    const csvText = await exportedBlob.text();

    expect(csvText).toBe("Data,Tipo,Valor,Categoria\r\n");
  });

  it("preserves accented characters in exported CSV", async () => {
    const transactions = [
      makeTransaction({ id: "1", category: "Produção", type: "income", amount: 3200 }),
    ];

    render(<ExportarTransacoes transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: /exportar csv/i }));

    const exportedBlob = createObjectURLSpy.mock.calls[0][0] as Blob;
    const csvText = await exportedBlob.text();

    expect(csvText).toContain("Produção");
  });
});
