import type { Transaction } from "@/types";

/**
 * Escapa um valor CSV, envolvendo em aspas se necessário
 * e duplicando aspas internas
 */
function escapaCSV(valor: string): string {
  if (valor.includes(",") || valor.includes('"') || valor.includes("\n")) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

/**
 * Formata uma transação para uma linha CSV
 */
function formatarLinhaTransacao(transacao: Transaction): string {
  const data = transacao.date.toISOString().split("T")[0];
  const descricao = escapaCSV(transacao.description);
  const valor = transacao.amount.toFixed(2);
  const tipo = transacao.type;
  const categoria = escapaCSV(transacao.category);

  return `${data},${descricao},${valor},${tipo},${categoria}`;
}

/**
 * Gera o conteúdo CSV a partir de um array de transações
 * 
 * @param transacoes - Array de transações para exportar
 * @returns String contendo o conteúdo CSV formatado
 */
export function generateCSVContent(transacoes: Transaction[]): string {
  const cabecalho = "Data,Descrição,Valor,Tipo,Categoria";
  
  if (transacoes.length === 0) {
    return cabecalho;
  }

  const linhas = transacoes.map((transacao) =>
    formatarLinhaTransacao(transacao)
  );

  return [cabecalho, ...linhas].join("\n");
}

/**
 * Exporta transações para um arquivo CSV
 * Retorna o nome do arquivo que seria gerado
 * 
 * @param transacoes - Array de transações para exportar
 * @returns Nome do arquivo CSV com timestamp
 */
export function exportTransactionsToCSV(transacoes: Transaction[]): string {
  const hoje = new Date().toISOString().split("T")[0];
  const nomeArquivo = `transacoes-${hoje}.csv`;

  // Em uma implementação real, aqui seria feito o download do arquivo
  // Mas para manter a função testável e seguir o padrão do projeto,
  // apenas retornamos o nome do arquivo e deixamos a lógica de download
  // para ser implementada no componente ou API route

  return nomeArquivo;
}

/**
 * Gera um Blob com o conteúdo CSV para download no navegador
 * 
 * @param transacoes - Array de transações para exportar
 * @returns Blob contendo o arquivo CSV
 */
export function generateCSVBlob(transacoes: Transaction[]): Blob {
  const conteudo = generateCSVContent(transacoes);
  return new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
}
