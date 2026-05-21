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
      <div className="space-y-4 text-[#3b2710]">
        <p className="text-sm text-slate-600">
          Registra el resultado de la cirugía de{" "}
          <strong>{registro.mascota_nombre}</strong>.
        </p>

        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-2 block">
            Resultado
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEstado("completada")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                estado === "completada"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Completada
            </button>
            <button
              type="button"
              onClick={() => setEstado("complicacion")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                estado === "complicacion"
                  ? "bg-impa-100 text-impa-700 border-impa-300"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Con complicaciones
            </button>
          </div>
        </div>

        <label className="block text-sm">
          <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-1 block">
            Notas del resultado *
          </span>
          <textarea
            rows={3}
            value={resultadoNotas}
            onChange={(e) => setResultadoNotas(e.target.value)}
            placeholder="Procedimiento, anestesia, medicación post-operatoria…"
            className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#17cf17]/30"
          />
        </label>

        {estado === "complicacion" && (
          <label className="block text-sm">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0f830f] mb-1 block">
              Complicaciones *
            </span>
            <textarea
              rows={3}
              value={complicaciones}
              onChange={(e) => setComplicaciones(e.target.value)}
              placeholder="Describe las complicaciones presentadas y manejo…"
              className="w-full border border-impa-200 rounded-md px-3 py-2 bg-impa-50/40 focus:outline-none focus:ring-2 focus:ring-impa-400/30"
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
