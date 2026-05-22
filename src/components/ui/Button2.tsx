"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: Props) {
  const base =
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-impa-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20 disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer";

  const styles =
    variant === "ghost"
      ? "bg-white/95 text-impa-text border border-impa-line shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 hover:shadow-impa-sm"
      : "bg-impa-500 text-white border border-impa-600/20 shadow-impa-md hover:bg-impa-600 hover:shadow-impa-lg active:bg-impa-700";

  return <button type={type} className={cn(base, styles, className)} {...rest} />;
}
