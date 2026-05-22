export function parseCurrency(input: string): number {
  if (!input) return 0
  // Keep behavior compatible with previous inline parsing: remove non numeric except dot and minus,
  // then coerce to Number and round. This mirrors legacy handling in project.
  const cleaned = String(input).replace(/[^0-9.-]+/g, "")
  const value = Number(cleaned)
  if (Number.isNaN(value)) return 0
  return Math.round(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export default { parseCurrency, formatCurrency }
