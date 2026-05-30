import type { Transaction } from "@/types";

function formatDateUTC(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function csvEscape(value: string | number | Date): string {
  const s = value instanceof Date ? formatDateUTC(value) : String(value ?? "");
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function generateTransactionsCsv(
  transactions: Transaction[],
  opts?: { from?: Date; to?: Date; now?: Date }
): { filename: string; csv: string } {
  const { from, to, now } = opts ?? {};
  const filtered = transactions.filter((t) => {
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    return true;
  });

  const header = ["Date", "Type", "Amount", "Category"].join(",");

  const rows = filtered.map((t) => {
    const date = formatDateUTC(t.date);
    const type = t.type === "income" ? "Entry" : "Exit";
    const amount = t.amount;
    const category = t.category ?? "";
    return [csvEscape(date), csvEscape(type), csvEscape(amount), csvEscape(category)].join(",");
  });

  const csv = [header, ...rows].join("\n") + "\n";

  const nowDate = now ?? new Date();
  const yyyy = nowDate.getUTCFullYear();
  const mm = String(nowDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(nowDate.getUTCDate()).padStart(2, "0");
  const filename = `transacoes-piggbank-${yyyy}${mm}${dd}.csv`;

  return { filename, csv };
}

export default generateTransactionsCsv;
