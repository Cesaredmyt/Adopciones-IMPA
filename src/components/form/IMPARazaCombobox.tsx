"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function IMPARazaCombobox({
  value,
  options,
  onChange,
  placeholder = "Seleccionar raza",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectValue(opt: Option) {
    onChange(opt.value);
    setQuery(opt.label);
    setOpen(false);
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <input
        type="text"
        value={open ? query : selected?.label || ""}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full h-11 rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition-all placeholder:text-[#638863] hover:border-impa-300 focus:outline-none focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15"
      />

      {open && (
        <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto custom-scroll rounded-xl border border-impa-line bg-white shadow-impa-lg py-1 animate-fade-slide">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-impa-muted italic">
              No se encontraron razas
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectValue(opt)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition",
                  opt.value === value
                    ? "bg-impa-50 text-impa-700 font-semibold"
                    : "text-impa-text hover:bg-impa-50/60"
                )}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export const CAAMRazaCombobox = IMPARazaCombobox;
