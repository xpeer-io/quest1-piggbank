"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onOpenModal: () => void;
};

export function DashboardHeader({ onOpenModal }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Visão Geral
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Métricas financeiras do período
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          Últimos 30 dias
        </div>

        <Button onClick={onOpenModal}>
          Nova Transação
        </Button>
      </div>
    </div>
  );
}