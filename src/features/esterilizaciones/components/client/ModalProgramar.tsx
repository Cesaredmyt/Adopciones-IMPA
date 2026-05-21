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
      <div className="space-y-4 text-[#3b2710]">
        <p className="text-sm text-slate-600">
          Asigna fecha y hora para la esterilización de{" "}
          <strong>{registro.mascota_nombre}</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-1 block">
              Fecha
            </span>
            <input
              type="date"
              min={minDate}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#17cf17]/30"
            />
          </label>

          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-1 block">
              Hora
            </span>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#17cf17]/30"
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
