"use client";

import { ReactNode } from "react";

type TransactionDialogProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function TransactionDialog({
  isOpen,
  title,
  children,
  onClose,
}: TransactionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}