"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
          ? "border-impa-200 bg-gradient-to-br from-white via-impa-50/50 to-impa-100/30 hover:border-impa-300"
          : "border-impa-line bg-gradient-to-br from-white to-impa-surface-2/60 hover:border-impa-line-strong"
      )}
    >
      {/* Decorative blob */}
      <span
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          hasAlert ? "bg-impa-300/30" : "bg-impa-200/25"
        )}
      />

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
            "grid place-items-center w-12 h-12 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-105",
            color ?? "bg-impa-50 border-impa-200 text-impa-600"
          )}
        >
          {icon}
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-1.5 text-xs font-semibold text-impa-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Ver detalle
        <ArrowRight size={12} />
      </div>
    </button>
  );
}
