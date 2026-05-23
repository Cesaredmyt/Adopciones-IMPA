"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Info, PawPrint, Heart, CalendarHeart, Activity } from "lucide-react";
import SeguimientoItem from "./SeguimientoItem";

/**
 * Tarjeta de seguimiento de una mascota adoptada.
 * Identidad IMPA: foto destacada con halo verde, badges semánticos,
 * info crítica visible (fecha de adopción, total de seguimientos completados).
 */
export default function SeguimientoMascotaCard({
  mascota,
  onInfo,
  onSubirSeguimiento,
}: {
  mascota: any;
  onInfo: () => void;
  onSubirSeguimiento: (seguimiento: any) => void;
}) {
  const total = mascota.seguimientos?.length ?? 0;
  const completados =
    mascota.seguimientos?.filter(
      (s: any) => s.estado?.toLowerCase() === "completado"
    ).length ?? 0;
  const activos =
    mascota.seguimientos?.filter(
      (s: any) => s.estado?.toLowerCase() === "activo"
    ).length ?? 0;

  const progresoPct = total > 0 ? Math.round((completados / total) * 100) : 0;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm transition-all duration-200 ease-impa-out hover:shadow-impa-md hover:border-impa-line-strong">
      {/* Top hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-impa-50/70 via-impa-tinted to-white p-5 sm:p-6 border-b border-impa-line">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Foto con halo */}
          <div className="relative mx-auto sm:mx-0 shrink-0">
            <div
              className="absolute inset-0 rounded-2xl bg-impa-cta blur-2xl opacity-15 scale-110"
              aria-hidden
            />
            <img
              src={mascota.imagen?.startsWith("http") ? mascota.imagen : "/ISOTIPO IMPA.png"}
              alt={mascota.nombre}
              className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-[3px] border-white object-cover shadow-impa-md ring-1 ring-impa-200"
            />
            <span
              className="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-impa-cta text-white shadow-impa-sm ring-2 ring-white"
              aria-hidden
            >
              <Heart size={12} className="fill-white" />
            </span>
          </div>

          {/* Datos */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <Badge variant="brand" size="sm" className="inline-flex">
              <PawPrint size={11} />
              Mascota adoptada
            </Badge>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-impa-text-strong tracking-tight">
              {mascota.nombre}
            </h2>

            <p className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-impa-muted">
              <CalendarHeart size={13} className="text-impa-600" />
              <span>Fecha de adopción:</span>
              <strong className="text-impa-text">{mascota.fechaAdopcion}</strong>
            </p>

            {/* Progreso */}
            {total > 0 && (
              <div className="mt-3 max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-impa-muted mb-1.5">
                  <span className="inline-flex items-center gap-1">
                    <Activity size={11} />
                    Progreso
                  </span>
                  <span className="text-impa-700">
                    {completados}/{total} · {progresoPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-impa-surface-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-impa-500 to-impa-600 rounded-full transition-all duration-700 ease-impa-out"
                    style={{ width: `${progresoPct}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-4 cursor-pointer"
              onClick={onInfo}
            >
              <Info size={14} />
              Cómo funciona el seguimiento
            </Button>
          </div>

          {/* Mini stats lateral (solo desktop xl) */}
          {total > 0 && (
            <div className="hidden xl:flex flex-col gap-2 shrink-0">
              <MiniStat label="Total" value={total} />
              <MiniStat label="Completados" value={completados} tone="success" />
              {activos > 0 && <MiniStat label="Pendientes" value={activos} tone="warning" />}
            </div>
          )}
        </div>
      </header>

      {/* Lista de seguimientos */}
      <div className="p-5 sm:p-6 space-y-3">
        {mascota.seguimientos?.map((s: any, i: number) => (
          <SeguimientoItem
            key={`${mascota.id}-${i}`}
            seguimiento={s}
            onSubirEvidencia={() => onSubirSeguimiento(s)}
          />
        ))}
      </div>
    </article>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "warning";
}) {
  return (
    <div
      className={
        "rounded-xl border px-3 py-2 text-center min-w-[80px] " +
        (tone === "success"
          ? "bg-impa-success-soft border-emerald-200 text-impa-success-ink"
          : tone === "warning"
          ? "bg-impa-warning-soft border-amber-200 text-impa-warning-ink"
          : "bg-impa-surface-2 border-impa-line text-impa-text")
      }
    >
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="text-lg font-bold leading-tight mt-0.5">{value}</p>
    </div>
  );
}
