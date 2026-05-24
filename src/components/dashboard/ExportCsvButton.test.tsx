import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ExportCsvButton } from "./ExportCsvButton";
import type { Transaction } from "@/types";

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "1",
  date: new Date(2026, 4, 15),
  type: "income",
  amount: 1200,
  category: "Assinatura",
  description: "Assinatura cliente",
  ...overrides,
});

describe("ExportCsvButton", () => {
  const createObjectURL = vi.fn(() => "blob:test-url");
  const revokeObjectURL = vi.fn();
  const originalURL = global.URL;

  beforeEach(() => {
    Object.defineProperty(global, "URL", {
      configurable: true,
      value: {
        ...global.URL,
        createObjectURL,
        revokeObjectURL,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    Object.defineProperty(global, "URL", {
      configurable: true,
      value: originalURL,
    });
  });

  it("renders the export button", () => {
    render(<ExportCsvButton transactions={[makeTransaction()]} />);
    expect(screen.getByText("Exportar CSV")).toBeTruthy();
  });

  it("creates and revokes a blob URL when clicked", () => {
    render(<ExportCsvButton transactions={[makeTransaction()]} />);

    fireEvent.click(screen.getByText("Exportar CSV"));

    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
  });
});