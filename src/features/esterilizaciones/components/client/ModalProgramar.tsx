"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";

type Props = {
  open: boolean;
  registro: EsterilizacionAdminRow | null;
  onClose: () => void;
  onConfirm: (fechaISO: string) => void;
};

export function ModalProgramar({
  open,
  registro,
  onClose,
  onConfirm,
}: Props) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!registro) return null;

  const handleConfirm = () => {
    if (!fecha || !hora) return;
    setEnviando(true);
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = hora.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0);
    onConfirm(dt.toISOString());
    setEnviando(false);
    setFecha("");
    setHora("");
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Programar cirugía · ${registro.folio}`}
    >
      <div className="space-y-4 text-impa-text">
        <p className="text-sm text-impa-muted">
          Asigna fecha y hora para la esterilización de{" "}
          <strong>{registro.mascota_nombre}</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
              Fecha
            </span>
            <input
              type="date"
              min={minDate}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
              Hora
            </span>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={enviando}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!fecha || !hora || enviando}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
