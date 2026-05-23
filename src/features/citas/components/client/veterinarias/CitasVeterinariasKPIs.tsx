"use client";

import { cn } from "@/lib/utils";

type Totales = {
  pendientes: number;
  aprobadas: number;
  canceladas: number;
};

type Chip = {
  key: keyof Totales;
  label: string;
  classes: string;
  dot: string;
};

const CHIPS: Chip[] = [
  {
    key: "pendientes",
    label: "Pendientes",
    classes: "bg-impa-warning-soft text-impa-warning-ink border-amber-200",
    dot: "bg-impa-warning",
  },
  {
    key: "aprobadas",
    label: "Aprobadas",
    classes: "bg-impa-success-soft text-impa-success-ink border-emerald-200",
    dot: "bg-impa-success",
  },
  {
    key: "canceladas",
    label: "Canceladas",
    classes: "bg-impa-danger-soft text-impa-danger-ink border-red-200",
    dot: "bg-impa-danger",
  },
];

export function CitasVeterinariasKPIs({ totales }: { totales: Totales }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((c) => (
        <span
          key={c.key}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold",
            c.classes
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
          {c.label}: {totales[c.key]}
        </span>
      ))}
    </div>
  );
}
