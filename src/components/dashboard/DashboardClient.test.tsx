import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DashboardClient } from "./DashboardClient";
import { mockTransactions } from "@/data/mock";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => cleanup());

describe("DashboardClient", () => {
  it("renders metrics, transactions, and adds a new transaction", () => {
    const initialDateRange = {
      from: new Date("2026-03-01"),
      to: new Date("2026-04-30"),
    };

    render(
      <DashboardClient
        initialTransactions={mockTransactions.slice(0, 2)}
        initialDateRange={initialDateRange}
      />
    );

    expect(screen.getByText(/Visão Geral/i)).toBeTruthy();
    expect(screen.getByText(/Transações recentes/i)).toBeTruthy();
    expect(screen.getByText(mockTransactions[0].description)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /nova transação/i }));

    fireEvent.change(screen.getByLabelText(/valor da transação/i), {
      target: { value: "2000,00" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Assinatura extra" },
    });
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: "Lazer" },
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: "2026-05-28" },
    });
    fireEvent.click(screen.getByRole("button", { name: /salvar transação/i }));

    expect(screen.getByText(/Assinatura extra/i)).toBeTruthy();
  });
});
