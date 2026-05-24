"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTransactions } from "@/lib/TransactionContext";
import { TransactionFormModal } from "@/components/transaction/TransactionFormModal";
import type { Transaction } from "@/types";

export default function NewTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (transaction: Omit<Transaction, "id">) => {
    setIsSubmitting(true);
    try {
      addTransaction(transaction);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      {/* Background Dashboard (Blurred) */}
      <div className="fixed inset-0 z-0 overflow-y-auto filter blur-sm grayscale pointer-events-none">
        {/* TopAppBar (Simulated) */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 w-full bg-white dark:bg-black border-b border-slate-950/10 dark:border-white/10">
          <div className="font-black text-xl tracking-tighter text-slate-950 dark:text-white uppercase">
            Capital Control
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </header>
        <main className="p-6 md:p-12 space-y-10">
          {/* Hero Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="md:col-span-2 border border-black/10 dark:border-white/10 p-6 space-y-4">
              <p className="font-label-caps text-label-caps text-on-primary-container">
                Total Balance
              </p>
              <h2 className="font-metric-lg text-metric-lg">$142,850.00</h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold">
                  +12% vs last month
                </span>
              </div>
            </div>
            <div className="border border-black/10 dark:border-white/10 p-6 flex flex-col justify-between">
              <p className="font-label-caps text-label-caps text-on-primary-container">
                Burn Rate
              </p>
              <h2 className="font-display-table text-display-table">
                $12,400
              </h2>
            </div>
          </div>
          {/* Table Placeholder */}
          <div className="border border-black/10 dark:border-white/10">
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps">
                Recent Transactions
              </h3>
            </div>
            <div className="divide-y divide-black/10 dark:divide-white/10">
              <div className="h-12 w-full flex items-center px-4 justify-between bg-surface-container-low/20">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 bg-black dark:bg-white"></div>
                  <div className="w-32 h-2 bg-black/10 dark:bg-white/10"></div>
                </div>
                <div className="w-16 h-2 bg-black/10 dark:bg-white/10"></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TransactionFormModal
        title="Nova Transação"
        submitLabel="Salvar Transação"
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Persistent Bottom Nav (Suppressing because modal is active focus) */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 h-20 pb-safe bg-white dark:bg-black border-t border-slate-950/10 dark:border-white/10 opacity-50 grayscale pointer-events-none">
        <div className="flex flex-col items-center justify-center text-slate-950 dark:text-white border-t-2 border-slate-950 dark:border-white pt-2">
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span className="font-['Inter'] font-bold text-[10px] tracking-widest uppercase">
            Dashboard
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 pt-2">
          <span className="material-symbols-outlined" data-icon="receipt_long">
            receipt_long
          </span>
          <span className="font-['Inter'] font-bold text-[10px] tracking-widest uppercase">
            Ledger
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 pt-2">
          <span className="material-symbols-outlined" data-icon="query_stats">
            query_stats
          </span>
          <span className="font-['Inter'] font-bold text-[10px] tracking-widest uppercase">
            Insights
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 pt-2">
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="font-['Inter'] font-bold text-[10px] tracking-widest uppercase">
            Settings
          </span>
        </div>
      </nav>
    </>
  );
}
