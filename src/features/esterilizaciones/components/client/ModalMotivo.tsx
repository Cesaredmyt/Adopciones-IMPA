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
      <div className="space-y-4 text-[#3b2710]">
        <label className="block text-sm">
          <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-1 block">
            {label}
          </span>
          <textarea
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#17cf17]/30"
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
