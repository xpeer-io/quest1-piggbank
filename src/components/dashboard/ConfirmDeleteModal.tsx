"use client";

import type { Transaction } from "@/types";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({ isOpen, transaction, onClose, onConfirm }: ConfirmDeleteModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold text-foreground mb-2">Excluir Transação</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tem certeza que deseja remover permanentemente a transação &quot;{transaction.description}&quot;?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/80 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}