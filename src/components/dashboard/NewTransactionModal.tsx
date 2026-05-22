"use client"

import * as React from "react"
import TransactionForm from "@/components/dashboard/TransactionForm"
import type { Transaction } from "@/types"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (t: Transaction) => void
  initialTransaction?: Transaction | null
}

export default function NewTransactionModal({ isOpen, onClose, onSave, initialTransaction }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[560px] rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(2,6,23,0.6)]">
        <TransactionForm initial={initialTransaction} onSubmit={(t) => { onSave(t); onClose(); }} onCancel={onClose} />
      </div>
    </div>
  )
}
