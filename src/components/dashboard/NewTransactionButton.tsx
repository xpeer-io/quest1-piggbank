"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewTransactionModal } from "./NewTransactionModal";

export function NewTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant="default">
        + Nova Transação
      </Button>

      <NewTransactionModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
