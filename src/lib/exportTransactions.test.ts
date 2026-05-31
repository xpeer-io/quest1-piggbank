import { describe, it, expect, vi } from 'vitest';
import { convertToCSV, generateExportFilename } from './exportTransactions';
import type { Transaction } from '@/types';

describe('exportTransactions logic', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: new Date('2024-05-20T10:00:00Z'),
      type: 'income',
      amount: 1500.5,
      category: 'Serviços',
      description: 'Freelance'
    },
    {
      id: '2',
      date: new Date('2024-05-21T10:00:00Z'),
      type: 'expense',
      amount: 50.25,
      category: 'Alimentação',
      description: 'Almoço'
    }
  ];

  it('should generate CSV header correctly even without transactions', () => {
    const csv = convertToCSV([]);
    expect(csv).toBe('Data,Tipo,Valor,Categoria,Descrição');
  });

  it('should convert transactions to CSV string correctly', () => {
    const csv = convertToCSV(mockTransactions);
    const lines = csv.split('\n');
    
    expect(lines[0]).toBe('Data,Tipo,Valor,Categoria,Descrição');
    expect(lines[1]).toBe('2024-05-20,Entrada,1500.5,Serviços,Freelance');
    expect(lines[2]).toBe('2024-05-21,Saída,50.25,Alimentação,Almoço');
  });

  it('should handle special characters and accents', () => {
    const transactions: Transaction[] = [{
      id: '3',
      date: new Date('2024-05-22'),
      type: 'income',
      amount: 100,
      category: 'Ação & Promoção',
      description: 'Teste'
    }];
    const csv = convertToCSV(transactions);
    expect(csv).toContain('Ação & Promoção');
  });

  it('should generate the correct filename pattern', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
    
    const filename = generateExportFilename(new Date());
    expect(filename).toBe('transacoes-piggbank-20240615.csv');
    
    vi.useRealTimers();
  });
});