import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-impa-surface-2 border border-impa-line-faint relative overflow-hidden",
        className
      )}
    >
      <span className="absolute inset-0 impa-shimmer" />
    </div>
  );
}
