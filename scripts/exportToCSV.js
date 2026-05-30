/**
 * Exporta um array de objetos para um arquivo CSV compatível com Excel.
 * Uso: exportToCSV(data, 'arquivo.csv')
 *
 * @param {Array<Object>} data - O array de objetos a ser exportado.
 * @param {string} filename - O nome do arquivo (ex: 'dados.csv').
 * @param {Object} [options]
 * @param {string} [options.delimiter=','] - Separador de campos (',' ou ';').
 * @param {boolean} [options.bom=true] - Adicionar BOM UTF-8 para compatibilidade com Excel Windows.
 */
function exportToCSV(data, filename = 'export.csv', options = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) return;

  const { delimiter = ',', bom = true } = options;

  // Coleta todos os cabeçalhos (união das chaves) para suportar objetos com campos diferentes
  const headersSet = new Set();
  data.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(k => headersSet.add(k));
    }
  });
  const headers = Array.from(headersSet);
  if (headers.length === 0) return;

  // Escapa e formata um valor para CSV
  function formatValue(val) {
    if (val === null || val === undefined) return '';
    const s = String(val);
    // Se conter aspas duplas, vírgula/; (dependendo do delimiter) ou quebras de linha, precisa ser entre aspas
    const mustQuote = s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delimiter);
    if (mustQuote) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  const rows = [
    headers.join(delimiter),
    ...data.map(row => headers.map(h => formatValue(row && row[h] != null ? row[h] : '')).join(delimiter))
  ];

  const CRLF = '\r\n'; // Excel prefere CRLF
  const csvBody = rows.join(CRLF);

  const csvContent = (bom ? '\uFEFF' : '') + csvBody;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Compatibilidade IE/Edge antigos
  if (navigator && navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
    return;
  }

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Expor para ambiente global do navegador
if (typeof window !== 'undefined') window.exportToCSV = exportToCSV;

// --- Exemplo de Uso ---
/*
const meusDados = [
  { Nome: "João Silva", Idade: 28, Cidade: "São Paulo", Bio: "Gosta de café, e código." },
  { Nome: "Maria Souza", Idade: 35, Cidade: "Rio de Janeiro", Bio: 'Especialista em "UX"' },
  { Nome: "Carlos", Idade: 22, Cidade: "Curitiba", Bio: "Texto com\nquebra de linha" }
];

// Exporta com vírgula (padrão)
// exportToCSV(meusDados, 'usuarios.csv');

// Ou, se sua localidade do Excel espera ponto-e-vírgula como delimitador:
// exportToCSV(meusDados, 'usuarios_semi.csv', { delimiter: ';' });
*/

module.exports = typeof module !== 'undefined' && module.exports ? exportToCSV : undefined;
