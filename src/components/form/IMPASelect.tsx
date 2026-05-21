"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface IMPASelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function IMPASelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  className = "",
  disabled = false,
}: IMPASelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-11 px-3.5 flex items-center justify-between rounded-xl border bg-white text-sm shadow-impa-xs transition-all",
          open
            ? "border-impa-500 ring-4 ring-impa-500/15"
            : "border-impa-line hover:border-impa-300",
          "focus:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15",
          "disabled:opacity-50 disabled:bg-impa-50/40 disabled:cursor-not-allowed"
        )}
      >
        <span className={cn("truncate text-left", selected ? "text-impa-text" : "text-[#638863]")}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-impa-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-impa-line bg-white shadow-impa-lg max-h-60 overflow-y-auto custom-scroll py-1 animate-fade-slide"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left transition flex items-center justify-between gap-2",
                  isSelected
                    ? "bg-impa-50 text-impa-700 font-semibold"
                    : "text-impa-text hover:bg-impa-50/60"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={15} className="text-impa-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const CAAMSelect = IMPASelect;
