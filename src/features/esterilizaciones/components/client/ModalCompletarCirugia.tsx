"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";

type Props = {
  open: boolean;
  registro: EsterilizacionAdminRow | null;
  onClose: () => void;
  onConfirm: (payload: {
    estado: "completada" | "complicacion";
    resultado_notas: string;
    complicaciones?: string | null;
  }) => void;
};

export function ModalCompletarCirugia({
  open,
  registro,
  onClose,
  onConfirm,
}: Props) {
  const [estado, setEstado] = useState<"completada" | "complicacion">(
    "completada"
  );
  const [resultadoNotas, setResultadoNotas] = useState("");
  const [complicaciones, setComplicaciones] = useState("");

  if (!registro) return null;

  const handleConfirm = () => {
    if (!resultadoNotas.trim()) return;
    if (estado === "complicacion" && !complicaciones.trim()) return;
    onConfirm({
      estado,
      resultado_notas: resultadoNotas,
      complicaciones: estado === "complicacion" ? complicaciones : null,
    });
    setEstado("completada");
    setResultadoNotas("");
    setComplicaciones("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Registrar resultado · ${registro.folio}`}
    >
      <div className="space-y-4 text-impa-text">
        <p className="text-sm text-impa-muted">
          Registra el resultado de la cirugía de{" "}
          <strong>{registro.mascota_nombre}</strong>.
        </p>

        <div>
          <span className="mb-2 block text-xs font-bold uppercase text-impa-700">
            Resultado
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEstado("completada")}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                estado === "completada"
                  ? "border-impa-300 bg-impa-50 text-impa-700 shadow-impa-xs"
                  : "border-impa-line bg-white text-impa-muted hover:border-impa-300 hover:bg-impa-50"
              }`}
            >
              Completada
            </button>
            <button
              type="button"
              onClick={() => setEstado("complicacion")}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                estado === "complicacion"
                  ? "border-amber-300 bg-amber-50 text-amber-800 shadow-impa-xs"
                  : "border-impa-line bg-white text-impa-muted hover:border-impa-300 hover:bg-impa-50"
              }`}
            >
              Con complicaciones
            </button>
          </div>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
            Notas del resultado *
          </span>
          <textarea
            rows={3}
            value={resultadoNotas}
            onChange={(e) => setResultadoNotas(e.target.value)}
            placeholder="Procedimiento, anestesia, medicación post-operatoria…"
            className="w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          />
        </label>

        {estado === "complicacion" && (
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
              Complicaciones *
            </span>
            <textarea
              rows={3}
              value={complicaciones}
              onChange={(e) => setComplicaciones(e.target.value)}
              placeholder="Describe las complicaciones presentadas y manejo…"
              className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-amber-300 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300/25"
            />
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={
              !resultadoNotas.trim() ||
              (estado === "complicacion" && !complicaciones.trim())
            }
          >
            Registrar resultado
          </Button>
        </div>
      </div>
    </Modal>
  );
}
