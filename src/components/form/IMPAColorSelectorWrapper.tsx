"use client";

import { SelectorColores } from "@/features/mascotas/components/client/SelectorColores";

interface WrapperProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function IMPAColorSelectorWrapper({ value, onChange }: WrapperProps) {
  return (
    <div className="rounded-xl border border-impa-line p-3 bg-white shadow-impa-xs">
      <SelectorColores value={value} onChange={onChange} />
    </div>
  );
}

export const CAAMColorSelectorWrapper = IMPAColorSelectorWrapper;
