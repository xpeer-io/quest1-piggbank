import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { NewTransactionModal } from "./NewTransactionModal"

describe("NewTransactionModal", () => {
  it("renders the trigger button", () => {
    render(<NewTransactionModal />)
    expect(screen.getByRole("button", { name: /Nova Transação/i })).toBeTruthy()
  })

  it("opens the modal and displays the form fields", () => {
    render(<NewTransactionModal />)
    fireEvent.click(screen.getByRole("button", { name: /Nova Transação/i }))

    expect(screen.getByText(/Nova transação/i)).toBeTruthy()
    expect(screen.getByLabelText(/Tipo/i)).toBeTruthy()
    expect(screen.getByLabelText(/Valor/i)).toBeTruthy()
    expect(screen.getByLabelText(/Categoria/i)).toBeTruthy()
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeTruthy()
  })

  it("shows validation error when amount is not greater than zero", () => {
    render(<NewTransactionModal />)
    fireEvent.click(screen.getByRole("button", { name: /Nova Transação/i }))

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }))

    expect(screen.getByText(/O valor deve ser maior que 0/i)).toBeTruthy()
  })
})
