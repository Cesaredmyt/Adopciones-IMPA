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
        "shadow-impa-xs transition-all placeholder:text-[#638863]",
        "hover:border-impa-300",
        "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15",
        "disabled:opacity-50 disabled:bg-impa-50/40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
IMPAInput.displayName = "IMPAInput";

export const CAAMInput = IMPAInput;
export type CAAMInputProps = IMPAInputProps;
