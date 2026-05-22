"use client";

import { Button } from "@/components/ui/Button";
import { Info, PawPrint } from "lucide-react";
import SeguimientoItem from "./SeguimientoItem";

export default function SeguimientoMascotaCard({
  mascota,
  onInfo,
  onSubirSeguimiento,
}: {
  mascota: any;
  onInfo: () => void;
  onSubirSeguimiento: (seguimiento: any) => void;
}) {
  return (
    <div className="rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm transition hover:border-impa-200 hover:shadow-impa-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        <img
          src={mascota.imagen?.startsWith("http") ? mascota.imagen : "/ISOTIPO IMPA.png"}
          alt={mascota.nombre}
          className="mx-auto h-32 w-32 rounded-2xl border border-impa-line object-cover shadow-impa-xs sm:mx-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-impa-text">
            {mascota.nombre} <PawPrint size={20} />
          </h2>

          <p className="mt-1 text-sm text-impa-muted">
            <b>Fecha de adopción:</b> {mascota.fechaAdopcion}
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={onInfo}
          >
            <Info size={16} /> Cómo funciona el seguimiento
          </Button>
        </div>
      </div>

      {/* Seguimientos */}
      <div className="grid gap-3">
        {mascota.seguimientos.map((s: any, i: number) => (
          <SeguimientoItem
            key={`${mascota.id}-${i}`}
            seguimiento={s}
            onSubirEvidencia={() => onSubirSeguimiento(s)}
          />
        ))}
      </div>
    </div>
  );
}
