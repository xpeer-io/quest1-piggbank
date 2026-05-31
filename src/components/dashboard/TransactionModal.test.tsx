import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TransactionModal } from './TransactionModal';

describe('TransactionModal', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  it('não deve renderizar quando isOpen é false', () => {
    render(<TransactionModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Nova Transação')).toBeNull();
  });

  it('deve renderizar corretamente quando isOpen é true', () => {
    render(<TransactionModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /nova transação/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/assinatura cliente acme/i)).toBeTruthy();
  });

  it('deve chamar onClose ao clicar no botão fechar ou cancelar', () => {
    render(<TransactionModal {...defaultProps} />);
    
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  it('deve exibir erro se tentar salvar sem preencher os campos', () => {
    render(<TransactionModal {...defaultProps} />);
    
    const saveBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveBtn);
    expect(screen.getByText(/o valor deve ser maior que zero/i)).toBeTruthy();
  });

  it('deve alternar entre Entrada e Saída', () => {
    render(<TransactionModal {...defaultProps} />);
    
    const inputEntrada = screen.getByRole('button', { name: /entrada/i });
    const inputSaida = screen.getByRole('button', { name: /saída/i });
    
    fireEvent.click(inputSaida);
    fireEvent.click(inputEntrada);
  });

  it('deve chamar onSave com os dados corretos ao preencher o formulário', () => {
    render(<TransactionModal {...defaultProps} />);
    
    fireEvent.change(screen.getByPlaceholderText(/assinatura cliente acme/i), {
      target: { value: 'Pagamento Internet' },
    });
    fireEvent.change(screen.getByPlaceholderText('0,00'), {
      target: { value: '150.50' },
    });
    
    // Como o label não está associado via 'for', buscamos o input pelo tipo date
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    
    fireEvent.change(dateInput, {
      target: { value: '2026-05-30' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Software' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /saída/i }));
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    
    expect(defaultProps.onSave).toHaveBeenCalledWith({
      type: 'expense',
      amount: 150.50,
      date: '2026-05-30',
      category: 'Software',
      description: 'Pagamento Internet',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
