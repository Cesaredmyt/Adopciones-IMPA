"use client";

import dayjs from "dayjs";
import { Button } from "@/components/ui/Button";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { getEstadoChip } from "@/features/seguimiento/utils/estadoChip";

export default function SeguimientoItem({
  seguimiento,
  onSubirEvidencia,
}: {
  seguimiento: any;
  onSubirEvidencia: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-xl border border-impa-line bg-white px-4 py-3 shadow-impa-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <CalendarDays size={18} className="text-impa-600" />
        <div>
          <p className="text-sm font-medium text-impa-text">
            {seguimiento.nombre}
          </p>
          <p className="text-xs text-impa-muted">
            {dayjs(seguimiento.fecha).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={getEstadoChip(seguimiento.estado)}>
          {seguimiento.estado}
        </span>

        {seguimiento.estado === "Completado" ? (
          <CheckCircle2 className="text-green-600" size={20} />
        ) : seguimiento.estado === "Activo" ? (
          <Button size="sm" onClick={onSubirEvidencia}>
            Subir evidencia
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled>
            Pendiente
          </Button>
        )}
      </div>
    </div>
  );
}
