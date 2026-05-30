import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ExportarTransacoes, Transacao } from './ExportarTransacoes';
import React from 'react';

describe('ExportarTransacoes - Componente de Exportação CSV', () => {
  const mockTransacoes: Transacao[] = [
    { data: '2026-05-28', tipo: 'Entrada', valor: 5000, categoria: 'Salário' },
    { data: '2026-05-29', tipo: 'Saída', valor: 150, categoria: 'Alimentação' }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
    window.alert = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o botão de exportação corretamente', () => {
    render(<ExportarTransacoes transacoes={mockTransacoes} />);
    const botao = screen.getByRole('button');
    // CORREÇÃO AQUI: Usando o textContent nativo para evitar o erro do TypeScript
    expect(botao.textContent).toMatch(/exportar csv/i);
  });

  it('deve disparar o download do arquivo CSV ao clicar no botão com dados', () => {
    const spyClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    
    render(<ExportarTransacoes transacoes={mockTransacoes} />);
    const botao = screen.getByRole('button');
    
    fireEvent.click(botao);

    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(spyClick).toHaveBeenCalled();
  });

  it('deve exibir um alerta se o usuário tentar exportar uma lista vazia', () => {
    render(<ExportarTransacoes transacoes={[]} />);
    const botao = screen.getByRole('button');
    
    fireEvent.click(botao);

    expect(window.alert).toHaveBeenCalledWith('Nenhuma transação disponível para exportação.');
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
  });
});