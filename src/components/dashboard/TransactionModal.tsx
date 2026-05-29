'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category: string;
    description: string;
  }) => void;
}

const CATEGORIES = [
  'Assinatura',
  'Infraestrutura',
  'Serviços',
  'Software',
  'Marketing',
  'Salários',
  'Outros',
];

export function TransactionModal({ isOpen, onClose, onSave }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSave() {
    setError('');
    if (!amount || Number(amount) <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }
    if (!date) {
      setError('Selecione uma data.');
      return;
    }
    if (!category) {
      setError('Selecione uma categoria.');
      return;
    }
    if (!description) {
      setError('Digite uma descrição.');
      return;
    }
    onSave({ type, amount: Number(amount), date, category, description });
    setAmount('');
    setDate('');
    setCategory('');
    setDescription('');
    setError('');
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{
        background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px',
        padding: '2rem', width: '100%', maxWidth: '460px', color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Nova Transação</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Toggle Entrada/Saída */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
          <button
            onClick={() => setType('income')}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: type === 'income' ? '#16a34a' : '#2a2a2a', color: '#fff', fontWeight: 500
            }}
          >
            ↑ Entrada
          </button>
          <button
            onClick={() => setType('expense')}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: type === 'expense' ? '#dc2626' : '#2a2a2a', color: '#fff', fontWeight: 500
            }}
          >
            ↓ Saída
          </button>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Descrição</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Assinatura cliente Acme"
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444',
              background: '#2a2a2a', color: '#fff', fontSize: '14px', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Valor */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Valor (R$)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
            min="0.01"
            step="0.01"
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444',
              background: '#2a2a2a', color: '#fff', fontSize: '14px', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Data */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Data</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444',
              background: '#2a2a2a', color: '#fff', fontSize: '14px', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Categoria */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Categoria</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444',
              background: '#2a2a2a', color: category ? '#fff' : '#aaa', fontSize: '14px', boxSizing: 'border-box'
            }}
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Erro */}
        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '1rem' }}>{error}</p>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #444',
              background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <Button onClick={handleSave} style={{ flex: 1 }}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}