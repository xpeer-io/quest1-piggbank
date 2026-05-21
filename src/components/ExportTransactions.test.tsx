import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	try {
		vi.useRealTimers();
	} catch (_) {}
});

import { ExportTransactions } from "./ExportTransactions";
import type { Transaction } from "@/types";

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
	id: "1",
	description: "Receita Teste",
	amount: 1500,
	type: "income",
	date: new Date(2026, 3, 10),
	category: "Salário",
	...overrides,
});

describe("ExportTransactions", () => {
	beforeEach(() => {
		// Freeze time for predictable filename
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 4, 16)); // 2026-05-16
	});

	it("renders the Exportar CSV button", () => {
		render(<ExportTransactions transactions={[makeTransaction()]} />);
		expect(screen.getByRole("button", { name: /Exportar CSV/i })).toBeTruthy();
	});

	it("generates automatic download with correct CSV (header and UTF-8 BOM) and filename", () => {
		const transactions = [
			makeTransaction({ date: new Date(2026, 4, 1), amount: 1200, type: "income", category: "Salário" }),
			makeTransaction({ id: "2", date: new Date(2026, 4, 2), amount: 800, type: "expense", category: "Alimentação" }),
		];

		// Capture Blob parts
		let capturedParts: unknown[] | undefined;
		// Stub global Blob constructor to capture parts and options
		// @ts-expect-error override for test
		const RealBlob = globalThis.Blob;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// @ts-ignore
		globalThis.Blob = function (parts: any[], options?: any) {
			capturedParts = parts;
			// return a simple object that has a type so createObjectURL can be called
			return { size: 0, type: options?.type ?? "text/csv" } as unknown as Blob;
		} as unknown as typeof Blob;

		const createURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

		let capturedAnchor: HTMLAnchorElement | undefined;
		const originalCreateElement = document.createElement.bind(document);
		const createSpy = vi.spyOn(document, "createElement").mockImplementation((tagName: any) => {
			const el = originalCreateElement(tagName);
			if (tagName === "a") capturedAnchor = el as HTMLAnchorElement;
			return el;
		});

		const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

		render(<ExportTransactions transactions={transactions} />);

		const btn = screen.getByRole("button", { name: /Exportar CSV/i });
		fireEvent.click(btn);

		expect(createURLSpy).toHaveBeenCalled();
		expect(clickSpy).toHaveBeenCalled();
		expect(capturedAnchor).toBeDefined();

		// Filename should be transacoes-piggbank-YYYYMMDD.csv
		expect(capturedAnchor!.download).toBe("transacoes-piggbank-20260516.csv");

		// CSV content should include BOM and header "Data, Tipo, Valor, Categoria"
		expect(capturedParts).toBeDefined();
		const joined = (capturedParts || []).join("");
		expect(joined.startsWith("\uFEFF")).toBeTruthy();
		expect(joined).toContain("Data, Tipo, Valor, Categoria");

		// restore real Blob
		// @ts-ignore
		globalThis.Blob = RealBlob;
		createSpy.mockRestore();
	});

	it("disables export when there are no transactions and does not trigger download", () => {
		const createURLSpy = vi.spyOn(URL, "createObjectURL").mockImplementation(() => "");
		const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

		render(<ExportTransactions transactions={[]} />);
		const btn = screen.getByRole("button", { name: /Exportar CSV/i });
		expect(btn).toBeDisabled();

		fireEvent.click(btn);
		expect(createURLSpy).not.toHaveBeenCalled();
		expect(clickSpy).not.toHaveBeenCalled();
	});
});

