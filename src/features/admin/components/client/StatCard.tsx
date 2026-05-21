"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
        "text-left w-full rounded-2xl border p-5 transition-all hover:shadow-impa-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15",
        hasAlert
          ? "border-impa-300 bg-impa-50/60 hover:border-impa-400"
          : "border-impa-line bg-white hover:border-impa-300"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-impa-muted text-xs font-semibold uppercase tracking-wide">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-impa-text mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={cn(
            "grid place-items-center w-12 h-12 rounded-xl",
            color ?? "bg-impa-50 text-impa-600"
          )}
        >
          {icon}
        </div>
      </div>
    </button>
  );
}
