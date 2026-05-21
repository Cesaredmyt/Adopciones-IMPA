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
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20 disabled:opacity-50 disabled:pointer-events-none";

  const styles =
    variant === "ghost"
      ? "bg-white text-impa-text border border-impa-line shadow-impa-xs hover:bg-impa-50 hover:border-impa-300"
      : "bg-impa-500 text-white shadow-impa-sm hover:bg-impa-600 active:bg-impa-700";

  return <button type={type} className={cn(base, styles, className)} {...rest} />;
}
