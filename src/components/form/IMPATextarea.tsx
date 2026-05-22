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
      "shadow-impa-xs transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out resize-y placeholder:text-impa-subtle",
      "hover:border-impa-300 hover:bg-impa-tinted",
      "focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15",
      "disabled:opacity-60 disabled:bg-impa-surface-2 disabled:cursor-not-allowed",
      className
    )}
  />
));
IMPATextarea.displayName = "IMPATextarea";

export const CAAMTextarea = IMPATextarea;
export type CAAMTextareaProps = IMPATextareaProps;
