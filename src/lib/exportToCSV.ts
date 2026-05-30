/**
 * Exporta um array de objetos para CSV (compatível com Excel).
 * Mantive a implementação simples e sem dependências externas.
 */
export default function exportToCSV(
  data: Array<Record<string, any>>,
  filename = "export.csv",
  options?: { delimiter?: string; bom?: boolean },
  headersOverride?: string[]
) {
  if (!Array.isArray(data)) data = [];

  const { delimiter = ",", bom = true } = options || {};

  // Use headersOverride if provided; otherwise infer from data
  let headers: string[] = [];
  if (Array.isArray(headersOverride) && headersOverride.length > 0) {
    headers = headersOverride;
  } else {
    const headersSet = new Set<string>();
    data.forEach((item) => {
      if (item && typeof item === "object") {
        Object.keys(item).forEach((k) => headersSet.add(k));
      }
    });
    headers = Array.from(headersSet);
  }

  // If still no headers, nothing to export
  if (!headers || headers.length === 0) return;

  function formatValue(val: any) {
    if (val === null || val === undefined) return "";
    const s = String(val);
    const mustQuote = s.includes('"') || s.includes("\n") || s.includes("\r") || s.includes(delimiter);
    if (mustQuote) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  const rows = [headers.join(delimiter), ...data.map((row) => headers.map((h) => formatValue(row && row[h] != null ? row[h] : "")).join(delimiter))];
  const csv = (bom ? "\uFEFF" : "") + rows.join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (typeof navigator !== "undefined" && (navigator as any).msSaveBlob) {
    (navigator as any).msSaveBlob(blob, filename);
    return;
  }

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
