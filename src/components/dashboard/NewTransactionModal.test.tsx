import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NewTransactionModal } from "./NewTransactionModal";

describe("NewTransactionModal", () => {
  it("abre modal", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);

    expect(screen.getByText("Salvar")).toBeTruthy();
  });

  it("fecha modal ao clicar em cancelar", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);
    fireEvent.click(screen.getByText("Cancelar"));

    expect(screen.queryByText("Salvar")).toBeNull();
  });

  it("fecha modal ao clicar no X", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);
    fireEvent.click(screen.getByText("✕"));

    expect(screen.queryByText("Salvar")).toBeNull();
  });

  it("mostra alerta para valor inválido", () => {
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);
    fireEvent.click(screen.getByText("Salvar"));

    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it("troca o tipo para saída", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);

    fireEvent.click(screen.getByText("Saída"));

    expect(screen.getByText("Saída")).toBeTruthy();
  });

  it("altera categoria", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);

    fireEvent.change(
      screen.getByDisplayValue("Assinatura"),
      {
        target: {
          value: "Marketing",
        },
      }
    );

    expect(
      screen.getByDisplayValue("Marketing")
    ).toBeTruthy();
  });

  it("preenche descrição", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);

    const input = screen.getByPlaceholderText(
      "Ex: Assinatura Mensal"
    );

    fireEvent.change(input, {
      target: {
        value: "Netflix",
      },
    });

    expect(
      screen.getByDisplayValue("Netflix")
    ).toBeTruthy();
  });

  it("preenche valor", () => {
    render(<NewTransactionModal onSubmit={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Nova Transação")[0]);

    const input = screen.getByPlaceholderText("0,00");

    fireEvent.change(input, {
      target: {
        value: "100",
      },
    });

    expect(
      screen.getByDisplayValue("100")
    ).toBeTruthy();
  });
});