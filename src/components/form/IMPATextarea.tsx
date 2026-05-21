"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type IMPATextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const IMPATextarea = React.forwardRef<
  HTMLTextAreaElement,
  IMPATextareaProps
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={cn(
      "w-full min-h-[96px] rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text",
      "shadow-impa-xs transition-all resize-y placeholder:text-[#638863]",
      "hover:border-impa-300",
      "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15",
      "disabled:opacity-50 disabled:bg-impa-50/40",
      className
    )}
  />
));
IMPATextarea.displayName = "IMPATextarea";

export const CAAMTextarea = IMPATextarea;
export type CAAMTextareaProps = IMPATextareaProps;
