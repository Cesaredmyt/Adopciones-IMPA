"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Delta = {
  /** Texto a mostrar en el badge, e.g. "+12%", "-5%", "0". */
  label: string;
  /** Tendencia (controla color y flecha). */
  trend?: "up" | "down" | "neutral";
};

export function StatCard({
  label,
  value,
  icon,
  color,
  onClick,
  delta,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
  /** Badge delta (Stitch-style) en la esquina superior derecha. */
  delta?: Delta;
  /**
   * Tono opcional para destacar el KPI:
   * - "accent": fondo amarillo cálido (callout urgente / destacado del mes)
   * - undefined: comportamiento legacy (alerta auto-detectada por value > 0)
   */
  tone?: "accent";
}) {
  const hasAlert = value > 0 && label !== "Mascotas adoptables";
  const isAccent = tone === "accent";

  // Pseudo-sparkline (deterministic per label)
  const seed = label.length;
  const points = Array.from({ length: 12 }, (_, i) => {
    const v = Math.sin((seed + i) * 0.7) * 0.5 + 0.5;
    return v;
  });
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = points.map((p) => (p - min) / (max - min || 1));
  const w = 100;
  const h = 28;
  const stepX = w / (points.length - 1);
  const path = norm
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * stepX).toFixed(1)} ${(h - v * h).toFixed(1)}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  // Selección de paleta de la card según tono
  const cardPalette = isAccent
    ? "border-impa-accent bg-gradient-to-br from-impa-accent-soft to-white hover:border-impa-accent-strong"
    : hasAlert
    ? "border-impa-200 bg-gradient-to-br from-white via-impa-50/40 to-impa-100/30 hover:border-impa-300"
    : "border-impa-line bg-gradient-to-br from-white to-impa-surface-2/60 hover:border-impa-line-strong";

  const washGradient = isAccent
    ? "bg-[linear-gradient(135deg,rgba(254,246,221,0)_0%,rgba(245,200,66,0.20)_100%)]"
    : hasAlert
    ? "bg-[linear-gradient(135deg,rgba(236,253,236,0)_0%,rgba(168,241,168,0.28)_100%)]"
    : "bg-[linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(231,238,231,0.55)_100%)]";

  const topLine = isAccent
    ? "bg-gradient-to-r from-transparent via-impa-accent-strong/50 to-transparent"
    : "bg-gradient-to-r from-transparent via-impa-200/70 to-transparent";

  // Delta badge
  const deltaPalette: Record<NonNullable<Delta["trend"]>, string> = {
    up: "bg-impa-success-soft text-impa-success-ink border-emerald-200",
    down: "bg-impa-danger-soft text-impa-danger-ink border-red-200",
    neutral: "bg-impa-surface-3 text-impa-muted border-impa-line",
  };
  const trend = delta?.trend ?? "neutral";
  const DeltaIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative text-left w-full overflow-hidden rounded-2xl border p-5 cursor-pointer",
        "transition-[box-shadow,transform,border-color,background] duration-300 ease-impa-out",
        "hover:-translate-y-0.5 hover:shadow-impa-lg",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20",
        cardPalette
      )}
    >
      <span className={cn("pointer-events-none absolute inset-0 opacity-55 transition-opacity duration-500 group-hover:opacity-85", washGradient)} />
      <span className={cn("pointer-events-none absolute inset-x-0 top-0 h-px", topLine)} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.08em]", isAccent ? "text-impa-accent-ink/80" : "text-impa-muted")}>
            {label}
          </p>
          <h3 className={cn("text-[34px] font-bold mt-2 tracking-tight leading-none", isAccent ? "text-impa-accent-ink" : "text-impa-text-strong")}>
            {value}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {delta && (
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap",
              deltaPalette[trend]
            )}>
              <DeltaIcon size={10} />
              {delta.label}
            </span>
          )}
          <div
            className={cn(
              "grid place-items-center w-11 h-11 rounded-xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              isAccent
                ? "bg-white border-impa-accent text-impa-accent-strong"
                : color ?? "bg-impa-50 border-impa-200 text-impa-600"
            )}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Sparkline + CTA */}
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <defs>
            <linearGradient id={`spark-${seed}-${label.replace(/\s+/g, "_")}`} x1="0" x2="0" y1="0" y2="1">
              {isAccent ? (
                <>
                  <stop offset="0%" stopColor="rgb(245,200,66)" stopOpacity="0.40" />
                  <stop offset="100%" stopColor="rgb(245,200,66)" stopOpacity="0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgb(23,207,23)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="rgb(23,207,23)" stopOpacity="0" />
                </>
              )}
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#spark-${seed}-${label.replace(/\s+/g, "_")})`} />
          <path
            d={path}
            fill="none"
            stroke={isAccent ? "rgb(217,158,27)" : "rgb(17,166,17)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className={cn(
          "inline-flex items-center gap-1 text-[11px] font-bold opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
          isAccent ? "text-impa-accent-strong" : "text-impa-600"
        )}>
          Ver
          <ArrowUpRight size={12} />
        </span>
      </div>
    </button>
  );
}
