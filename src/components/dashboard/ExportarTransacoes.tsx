import React from 'react';

export interface Transacao {
  data: string; // Formato YYYY-MM-DD
  tipo: 'Entrada' | 'Saída' | 'entrada' | 'saida';
  valor: number;
  categoria: string;
}

interface ExportarTransacoesProps {
  transacoes: Transacao[];
}

export const ExportarTransacoes: React.FC<ExportarTransacoesProps> = ({ transacoes }) => {
  
  const formatarDataArquivo = (): string => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
  };

  const exportarParaCSV = () => {
    if (!transacoes || transacoes.length === 0) {
      alert('Nenhuma transação disponível para exportação.');
      return;
    }

    const cabecalho = ['Data', 'Tipo', 'Valor', 'Categoria'];
    
    const linhas = transacoes.map(t => {
      // CORRIGIDO: Agora a variável está junta em camelCase
      const tipoFormatado = t.tipo.toLowerCase().startsWith('ent') ? 'Entrada' : 'Saída';
      const categoriaSanitizada = t.categoria.includes(',') ? `"${t.categoria}"` : t.categoria;

      return [t.data, tipoFormatado, t.valor, categoriaSanitizada];
    });

    const conteudoCSV = '\uFEFF' + [cabecalho.join(','), ...linhas.map(l => l.join(','))].join('\n');
    
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transacoes-piggbank-${formatarDataArquivo()}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportarParaCSV}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
      aria-label="Exportar transações para CSV"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Exportar CSV
    </button>
  );
};