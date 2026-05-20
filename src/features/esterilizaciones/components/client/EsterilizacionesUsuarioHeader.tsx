"use client";

import { Button } from "@/components/ui/Button";
import { Plus, ArrowLeft } from "lucide-react";
import type { ModoEsterilizacionesUsuario } from "@/features/esterilizaciones/hooks/useEsterilizacionesUsuarioPageState";

type Props = {
  modo: ModoEsterilizacionesUsuario;
  setModo: (m: ModoEsterilizacionesUsuario) => void;
  bloqueado: boolean;
  setMensaje: (m: string | null) => void;
};

export function EsterilizacionesUsuarioHeader({
  modo,
  setModo,
  bloqueado,
  setMensaje,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B4513]">
          Esterilizaciones
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Solicita la esterilización de tus mascotas adoptadas y sigue el
          proceso desde aquí.
        </p>
      </div>

      <div>
        {modo === "lista" ? (
          <Button
            variant="primary"
            onClick={() => {
              if (bloqueado) {
                setMensaje(
                  "Ya tienes una solicitud activa. Espera su resolución antes de crear otra."
                );
                return;
              }
              setModo("solicitar");
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva solicitud
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setModo("lista")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a la lista
          </Button>
        )}
      </div>
    </div>
  );
}
