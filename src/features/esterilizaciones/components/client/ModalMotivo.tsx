"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
};

export function ModalMotivo({
  open,
  title,
  label,
  placeholder,
  onClose,
  onConfirm,
}: Props) {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = () => {
    if (motivo.trim().length < 3) return;
    onConfirm(motivo.trim());
    setMotivo("");
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4 text-impa-text">
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
            {label}
          </span>
          <textarea
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={motivo.trim().length < 3}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
