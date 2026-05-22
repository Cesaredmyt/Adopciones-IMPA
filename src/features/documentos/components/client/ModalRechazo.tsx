"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Documento } from "../../types/types";

interface ModalRechazoProps {
  open: boolean;
  documento: Documento | null;
  onClose: () => void;
  onConfirm: (motivo: string) => void | Promise<void>;
}

export default function ModalRechazo({
  open,
  documento,
  onClose,
  onConfirm,
}: ModalRechazoProps) {
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) setMotivo("");
  }, [open]);

  if (!open || !documento) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-impa-text/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-impa-line bg-white p-6 shadow-impa-xl"
      >
        <h2 className="mb-4 text-xl font-bold text-impa-text">
          Rechazar documento
        </h2>

        <p className="mb-2 text-sm text-impa-muted">
          Documento: <b>{documento.tipo}</b>
        </p>

        <textarea
          className="mb-4 w-full rounded-xl border border-impa-line bg-white p-3 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          rows={4}
          placeholder="Escribe el motivo del rechazo..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-impa-line bg-white px-4 py-2 text-sm font-semibold text-impa-700 transition hover:bg-impa-50"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              if (!motivo.trim()) return;
              onConfirm(motivo);
            }}
            className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-impa-xs transition hover:bg-red-700"
          >
            Rechazar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
