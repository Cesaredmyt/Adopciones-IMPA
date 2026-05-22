"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { PlaticaAdminRow } from "@/features/platicas/types/platica";

type Props = {
  open: boolean;
  registro: PlaticaAdminRow | null;
  onClose: () => void;
  onConfirm: (payload: {
    fecha_definitiva: string;
    observaciones_internas: string | null;
  }) => void;
};

export function ModalAgendarPlatica({
  open,
  registro,
  onClose,
  onConfirm,
}: Props) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!registro) return null;

  const handleConfirm = () => {
    if (!fecha || !hora) return;
    setEnviando(true);
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = hora.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0);
    onConfirm({
      fecha_definitiva: dt.toISOString(),
      observaciones_internas: observaciones.trim() || null,
    });
    setEnviando(false);
    setFecha("");
    setHora("");
    setObservaciones("");
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Aprobar y agendar · ${registro.folio}`}
      description={`Asigna fecha y hora definitivas para la plática solicitada por ${registro.nombre_solicitante}.`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
              Fecha
            </span>
            <input
              type="date"
              min={minDate}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-impa-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
            />
          </label>

          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
              Hora
            </span>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border border-impa-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
            Observaciones internas (opcional)
          </span>
          <textarea
            rows={3}
            maxLength={1000}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Material a preparar, ponente asignado, recordatorios internos..."
            className="w-full border border-impa-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
          />
          <span className="text-[11px] text-impa-quiet">
            No será visible para el solicitante.
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={enviando}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!fecha || !hora || enviando}
          >
            Aprobar y agendar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
