"use client";

import { cn } from "@/lib/utils";

interface IMPASwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  "aria-label"?: string;
}

export function IMPASwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  "aria-label": ariaLabel,
}: IMPASwitchProps) {
  const sizes = {
    sm: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
    md: { track: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" },
  };
  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20",
        s.track,
        checked ? "bg-impa-500" : "bg-impa-line",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block transform rounded-full bg-white shadow-impa-xs transition-transform duration-200",
          s.thumb,
          checked ? s.translate : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export const CAAMSwitch = IMPASwitch;
