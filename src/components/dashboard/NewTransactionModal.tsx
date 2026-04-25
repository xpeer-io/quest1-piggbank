"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction } from "@/types";

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewTransactionModal({
    isOpen,
    onClose,
}: NewTransactionModalProps) {
    const [type, setType] = React.useState<"entrada" | "saida">("entrada");
    const [amount, setAmount] = React.useState("");
    const [date, setDate] = React.useState<Date>();
    const [category, setCategory] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    const isValid = !!amount && parseFloat(amount) > 0 && category && date;

    const handleAmountChange = (value: string) => {
        setAmount(value);
        if (errorMessage) setErrorMessage("");
    };

    const handleClose = () => {
        setAmount("");
        setDate(undefined);
        setCategory("");
        setType("entrada");
        setErrorMessage("");
        onClose();
    };

 const handleSave = async () => {
    if (!isValid || !date || !category) {
        setErrorMessage("Preencha todos os campos corretamente");
        return;
    }

    const newTransaction: Transaction = {
        id: Date.now().toString(),
        description: category, // simples por enquanto
        amount: parseFloat(amount),
        type: type === "entrada" ? "income" : "expense",
        date: date,
        category: category,
    };

    // chama API
    const { addTransaction } = await import("@/lib/api");
    await addTransaction(newTransaction);

    // limpa formulário
    setAmount("");
    setDate(undefined);
    setCategory("");
    setType("entrada");

    // 🔥 atualiza dashboard
    window.location.reload();

    onClose();
};

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold text-foreground">
                        Nova Transação
                    </h2>

                    <form className="mt-4 space-y-4" onSubmit={handleSave}>
                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Tipo
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={type === "entrada" ? "default" : "outline"}
                                    onClick={() => setType("entrada")}
                                    className="flex-1"
                                >
                                    Entrada
                                </Button>
                                <Button
                                    type="button"
                                    variant={type === "saida" ? "default" : "outline"}
                                    onClick={() => setType("saida")}
                                    className="flex-1"
                                >
                                    Saída
                                </Button>
                            </div>
                        </div>

                        {/* Valor */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Valor
                            </label>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="0.00"
                            />
                            {errorMessage && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Data
                            </label>
                            <Popover>
                                <PopoverTrigger>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                            format(date, "PPP", { locale: ptBR })
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Categoria */}
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Categoria
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="alimentacao">Alimentação</option>
                                <option value="transporte">Transporte</option>
                                <option value="lazer">Lazer</option>
                                <option value="saude">Saúde</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>

                        {/* Botões */}
                        <div className="mt-6 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={!isValid}>
                                Salvar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}