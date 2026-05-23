"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Tone = "info" | "danger" | "success" | "warning";

interface Props {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: Tone;
  /** Acción opcional al pie (botón o link). */
  action?: React.ReactNode;
}

const toneStyles: Record<
  Tone,
  { section: string; icon: string; title: string; desc: string; line: string }
> = {
  info: {
    section: "border-impa-200 bg-gradient-to-br from-white to-impa-50",
    icon: "bg-impa-cta text-white",
    title: "text-impa-900",
    desc: "text-impa-700",
    line: "via-impa-200/70",
  },
  success: {
    section: "border-emerald-200 bg-gradient-to-br from-white to-impa-success-soft",
    icon: "bg-impa-success text-white",
    title: "text-impa-success-ink",
    desc: "text-impa-success-ink/80",
    line: "via-emerald-200/70",
  },
  warning: {
    section: "border-amber-200 bg-gradient-to-br from-white to-impa-warning-soft",
    icon: "bg-impa-warning text-white",
    title: "text-impa-warning-ink",
    desc: "text-impa-warning-ink/80",
    line: "via-amber-200/70",
  },
  danger: {
    section: "border-red-200 bg-gradient-to-br from-white to-impa-danger-soft",
    icon: "bg-impa-danger text-white",
    title: "text-impa-danger-ink",
    desc: "text-impa-danger-ink/80",
    line: "via-red-200/70",
  },
};

/**
 * Panel de estado del flujo de adopción.
 * Visual unificado con tokens IMPA semánticos (success/warning/danger/info).
 * Usar para mensajes destacados: documentos rechazados, en revisión, aprobados, etc.
 */
export default function PanelEstado({
  icon,
  title,
  desc,
  tone = "info",
  action,
}: Props) {
  const t = toneStyles[tone];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-impa-sm",
        t.section
      )}
    >
      {/* Hairline superior */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          t.line
        )}
      />

      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-2xl shadow-impa-sm shrink-0",
            t.icon
          )}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className={cn("text-base font-bold tracking-tight", t.title)}>{title}</h3>
          <p className={cn("mt-1 text-sm leading-relaxed", t.desc)}>{desc}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </section>
  );
}
