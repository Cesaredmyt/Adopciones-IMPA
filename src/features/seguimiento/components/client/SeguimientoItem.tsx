"use client";

import dayjs from "dayjs";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CalendarDays, CheckCircle2, Upload, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Item individual de la lista de seguimientos post-adopción.
 * Estados normalizados a tokens IMPA: completado / activo / próximo / pendiente.
 */
export default function SeguimientoItem({
  seguimiento,
  onSubirEvidencia,
}: {
  seguimiento: any;
  onSubirEvidencia: () => void;
}) {
  const estadoLower = seguimiento.estado?.toLowerCase?.() ?? "";
  const isCompletado = estadoLower === "completado";
  const isActivo = estadoLower === "activo";
  const isProximo = estadoLower === "próximo" || estadoLower === "proximo";

  return (
    <div
      className={cn(
        "flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-impa-xs transition-colors duration-150",
        isCompletado && "border-impa-200 bg-impa-success-soft/30",
        isActivo && "border-impa-200 bg-impa-tinted/40",
        isProximo && "border-amber-200 bg-impa-warning-soft/30",
        !isCompletado && !isActivo && !isProximo && "border-impa-line"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            "grid place-items-center w-9 h-9 rounded-lg border shrink-0",
            isCompletado && "bg-white border-emerald-200 text-impa-success",
            isActivo && "bg-white border-impa-200 text-impa-600",
            isProximo && "bg-white border-amber-200 text-impa-warning",
            !isCompletado && !isActivo && !isProximo && "bg-white border-impa-line text-impa-muted"
          )}
        >
          {isCompletado ? (
            <CheckCircle2 size={16} />
          ) : isActivo ? (
            <Upload size={16} />
          ) : (
            <CalendarDays size={16} />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-impa-text-strong leading-tight">
            {seguimiento.nombre}
          </p>
          <p className="text-xs text-impa-muted inline-flex items-center gap-1 mt-0.5">
            <Clock size={11} />
            {dayjs(seguimiento.fecha).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge estado={seguimiento.estado} size="sm" />

        {isCompletado ? (
          <CheckCircle2 className="text-impa-success" size={20} />
        ) : isActivo ? (
          <Button size="sm" variant="cta" onClick={onSubirEvidencia} className="cursor-pointer">
            <Upload size={13} />
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
