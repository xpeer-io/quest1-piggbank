import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DashboardClient } from './DashboardClient';
import { exportarCSV } from '@/lib/csv';

// Mock do módulo de exportação
vi.mock('@/lib/csv', () => ({
  exportarCSV: vi.fn(),
}));

describe('DashboardClient', () => {
  afterEach(() => {
    cleanup();
  });

  const mockMetrics = [
    { label: 'Saldo Total', value: 1000, currency: true },
    { label: 'Entradas', value: 1500, currency: true },
    { label: 'Saídas', value: 500, currency: true },
    { label: 'Transações', value: 5, currency: false },
  ];

  const mockTransactions = [
    {
      id: '1',
      description: 'Freelance',
      amount: 1000,
      type: 'income' as const,
      date: new Date(2026, 4, 1),
      category: 'Trabalho',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar as métricas e o título corretamente', () => {
    render(<DashboardClient initialMetrics={mockMetrics} initialTransactions={mockTransactions} />);
    
    expect(screen.getByRole('heading', { name: /visão geral/i })).toBeTruthy();
    expect(screen.getByText('Saldo Total')).toBeTruthy();
    expect(screen.getByText('Freelance')).toBeTruthy();
  });

  it('deve abrir o modal ao clicar em "Nova Transação"', () => {
    render(<DashboardClient initialMetrics={mockMetrics} initialTransactions={mockTransactions} />);
    
    fireEvent.click(screen.getByRole('button', { name: /\+ nova transação/i }));
    expect(screen.getByRole('heading', { name: /nova transação/i })).toBeTruthy();
  });

  it('deve chamar exportarCSV ao clicar no botão de exportar', () => {
    render(<DashboardClient initialMetrics={mockMetrics} initialTransactions={mockTransactions} />);
    
    const exportBtn = screen.getByRole('button', { name: /exportar csv/i });
    fireEvent.click(exportBtn);
    
    expect(exportarCSV).toHaveBeenCalledWith(expect.any(Array));
    expect(exportarCSV).toHaveBeenCalledWith(mockTransactions);
  });

  it('deve adicionar uma nova transação à lista ao salvar no modal', () => {
    render(<DashboardClient initialMetrics={mockMetrics} initialTransactions={mockTransactions} />);
    
    fireEvent.click(screen.getByRole('button', { name: /\+ nova transação/i }));
    
    // Preencher o modal
    fireEvent.change(screen.getByPlaceholderText(/assinatura cliente acme/i), {
      target: { value: 'Nova Compra' },
    });
    fireEvent.change(screen.getByPlaceholderText('0,00'), {
      target: { value: '50' },
    });
    
    // Buscar o input de data pelo tipo date
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    fireEvent.change(dateInput, {
      target: { value: '2026-05-30' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Outros' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    
    // Verificar se a nova transação aparece na tabela
    expect(screen.getByText('Nova Compra')).toBeTruthy();
  });
});
