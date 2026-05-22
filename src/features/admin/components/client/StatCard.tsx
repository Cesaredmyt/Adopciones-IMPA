"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon,
  color,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}) {
  const hasAlert = value > 0 && label !== "Mascotas adoptables";

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

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative text-left w-full overflow-hidden rounded-2xl border p-5 cursor-pointer",
        "transition-[box-shadow,transform,border-color,background] duration-300 ease-impa-out",
        "hover:-translate-y-0.5 hover:shadow-impa-lg",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20",
        hasAlert
          ? "border-impa-200 bg-gradient-to-br from-white via-impa-50/40 to-impa-100/30 hover:border-impa-300"
          : "border-impa-line bg-gradient-to-br from-white to-impa-surface-2/60 hover:border-impa-line-strong"
      )}
    >
      {/* Subtle depth wash */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 opacity-55 transition-opacity duration-500 group-hover:opacity-85",
          hasAlert
            ? "bg-[linear-gradient(135deg,rgba(236,253,236,0)_0%,rgba(168,241,168,0.28)_100%)]"
            : "bg-[linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(231,238,231,0.55)_100%)]"
        )}
      />

      {/* Top highlight line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-impa-muted text-[11px] font-bold uppercase tracking-[0.08em]">
            {label}
          </p>
          <h3 className="text-[34px] font-bold text-impa-text-strong mt-2 tracking-tight leading-none">
            {value}
          </h3>
        </div>

        <div
          className={cn(
            "grid place-items-center w-11 h-11 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            color ?? "bg-impa-50 border-impa-200 text-impa-600"
          )}
        >
          {icon}
        </div>
      </div>

      {/* Sparkline + CTA */}
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <defs>
            <linearGradient id={`spark-${seed}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(23,207,23)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(23,207,23)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#spark-${seed})`} />
          <path
            d={path}
            fill="none"
            stroke="rgb(17,166,17)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-impa-600 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Ver
          <ArrowUpRight size={12} />
        </span>
      </div>
    </button>
  );
}
