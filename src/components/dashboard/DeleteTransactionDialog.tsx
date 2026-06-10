"use client";

import { useEffect, useId } from "react";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

type DeleteTransactionDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
};

export function DeleteTransactionDialog({
  onCancel,
  onConfirm,
  transaction,
}: DeleteTransactionDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!transaction) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, transaction]);

  if (!transaction) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Excluir Transa&ccedil;&atilde;o
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-muted-foreground">
          Esta a&ccedil;&atilde;o remover&aacute; &quot;
          {transaction.description}&quot; da lista.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </section>
    </div>
  );
}
