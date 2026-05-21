"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  right?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export default function PageHead({
  title,
  subtitle,
  eyebrow,
  right,
  icon,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8",
        className
      )}
    >
      <div className="flex items-start gap-4 min-w-0">
        {icon && (
          <div className="hidden sm:grid place-items-center w-12 h-12 rounded-2xl border border-impa-line bg-white shadow-impa-sm text-impa-600 shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1.5 min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-impa-600">
              {eyebrow}
            </div>
          )}
          <h1 className="m-0 font-bold text-2xl sm:text-3xl md:text-[34px] leading-[1.1] tracking-tight text-impa-text-strong">
            {title}
          </h1>
          {subtitle && (
            <div className="m-0 text-sm sm:text-[15px] text-impa-muted max-w-2xl">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {right && <div className="flex-shrink-0">{right}</div>}
    </header>
  );
}
