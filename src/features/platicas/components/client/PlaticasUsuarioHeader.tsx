"use client";

import { Button } from "@/components/ui/Button";
import { Plus, ArrowLeft, Megaphone } from "lucide-react";
import type { ModoPlaticasUsuario } from "@/features/platicas/hooks/usePlaticasUsuarioPageState";

type Props = {
  modo: ModoPlaticasUsuario;
  setModo: (m: ModoPlaticasUsuario) => void;
};

export function PlaticasUsuarioHeader({ modo, setModo }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div className="flex items-start gap-3">
        <div className="hidden sm:grid place-items-center w-12 h-12 rounded-2xl border border-impa-line bg-white shadow-impa-sm text-impa-600 shrink-0">
          <Megaphone size={20} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-impa-text-strong tracking-tight">
            Pláticas de concientización
          </h1>
          <p className="text-impa-muted text-sm sm:text-base max-w-2xl">
            Solicita una plática del IMPA para tu escuela, empresa o colonia
            y sigue el proceso desde aquí.
          </p>
        </div>
      </div>

      <div>
        {modo === "lista" ? (
          <Button variant="primary" onClick={() => setModo("solicitar")}>
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
