"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type IMPANumberInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const IMPANumberInput = React.forwardRef<
  HTMLInputElement,
  IMPANumberInputProps
>(({ className = "", ...props }, ref) => (
  <input
    type="number"
    ref={ref}
    {...props}
    className={cn(
      "w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text",
      "shadow-impa-xs transition-all placeholder:text-[#638863]",
      "hover:border-impa-300",
      "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15",
      "disabled:opacity-50 disabled:bg-impa-50/40",
      className
    )}
  />
));
IMPANumberInput.displayName = "IMPANumberInput";

export const CAAMNumberInput = IMPANumberInput;
export type CAAMNumberInputProps = IMPANumberInputProps;
