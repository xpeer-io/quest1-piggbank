import { downloadCsv } from "./csv";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  category: string;
}

export function ExportCsvButton({ transactions }: { transactions: Transaction[] }) {
  const handleExport = () => {
    downloadCsv(transactions);
  };

  const isDisabled = transactions.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isDisabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-green-500 text-white hover:bg-green-600 shadow-md"
      }`}
      aria-label="Exportar transações em CSV"
      title="Exportar transações em CSV"
    >
      📥 Exportar CSV
    </button>
  );
}
