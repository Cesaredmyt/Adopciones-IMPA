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

export function ModalMotivoPlatica({
  open,
  title,
  label,
  placeholder,
  onClose,
  onConfirm,
}: Props) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleConfirm = async () => {
    if (motivo.trim().length < 3) return;
    setEnviando(true);
    await onConfirm(motivo.trim());
    setEnviando(false);
    setMotivo("");
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <label className="block text-sm">
          <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
            {label}
          </span>
          <textarea
            rows={4}
            maxLength={500}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={placeholder ?? "Escribe el motivo..."}
            className="w-full border border-impa-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
          />
          <span className="text-[11px] text-impa-quiet">
            Mínimo 3 caracteres · Máximo 500.
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={enviando}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={motivo.trim().length < 3 || enviando}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
