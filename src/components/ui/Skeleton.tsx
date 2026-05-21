import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-impa-50 relative overflow-hidden",
        className
      )}
    >
      <span className="absolute inset-0 impa-shimmer" />
    </div>
  );
}
