"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type IMPAInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const IMPAInput = React.forwardRef<HTMLInputElement, IMPAInputProps>(
  ({ className = "", value, onChange, ...props }, ref) => (
    <input
      ref={ref}
      value={value ?? ""}
      onChange={(e) => onChange?.(e)}
      className={cn(
        "w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text",
        "shadow-impa-xs transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out placeholder:text-impa-subtle",
        "hover:border-impa-300 hover:bg-impa-tinted",
        "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15",
        "disabled:opacity-60 disabled:bg-impa-surface-2 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
IMPAInput.displayName = "IMPAInput";

export const CAAMInput = IMPAInput;
export type CAAMInputProps = IMPAInputProps;
