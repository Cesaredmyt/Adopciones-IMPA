"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Limita el contenedor a una anchura distinta */
  width?: "default" | "wide" | "narrow" | "full";
  /** Aplica el fondo decorativo con mesh sutil */
  decorated?: boolean;
};

const widthMap: Record<NonNullable<Props["width"]>, string> = {
  narrow: "max-w-[920px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1400px]",
  full: "max-w-none",
};

export default function PageShell({
  children,
  className,
  width = "default",
  decorated = true,
}: Props) {
  return (
    <main
      className={cn(
        "relative min-h-[calc(100vh-4rem)] text-impa-text",
        decorated &&
          "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(60%_50%_at_8%_-5%,rgba(23,207,23,0.08),transparent_60%),radial-gradient(60%_50%_at_100%_0%,rgba(23,207,23,0.05),transparent_55%)]"
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 animate-fade-in",
          widthMap[width],
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}
