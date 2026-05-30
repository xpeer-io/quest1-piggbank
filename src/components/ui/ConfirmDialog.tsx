"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  isOpen,
  title = "Confirmar ação",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>{cancelLabel}</Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
