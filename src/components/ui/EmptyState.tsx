"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "minimal";
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: Props) {
  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center gap-2 py-10 text-impa-muted",
          className
        )}
      >
        {icon && <div className="text-impa-quiet">{icon}</div>}
        <p className="text-sm font-medium text-impa-text">{title}</p>
        {description && <p className="text-xs">{description}</p>}
        {action && <div className="pt-2">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-impa-line bg-impa-surface-2/60 p-10 text-center",
        className
      )}
    >
      {/* Soft mesh accent */}
      <div className="pointer-events-none absolute inset-0 opacity-60 bg-impa-mesh" />
      <div className="relative flex flex-col items-center gap-4">
        {icon && (
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-white border border-impa-line shadow-impa-sm text-impa-600">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-impa-text tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-impa-muted max-w-md">{description}</p>
          )}
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
    </div>
  );
}
