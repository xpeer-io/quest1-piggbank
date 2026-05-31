import type { Transaction } from "@/types";

type ExportCsvButtonProps = {
  transactions: Transaction[];
};

export function ExportCsvButton({
  transactions,
}: ExportCsvButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md border border-border px-4 py-2 text-sm"
    >
      Exportar CSV
    </button>
  );
}