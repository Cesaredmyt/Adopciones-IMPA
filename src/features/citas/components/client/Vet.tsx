"use client";
import { Stethoscope, Phone } from "lucide-react";

export default function VeterinarioDestacado({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="rounded-2xl border border-impa-line bg-white p-4 shadow-impa-xs">
      <h3 className="text-sm font-extrabold text-impa-text">Veterinario destacado</h3>
      <div className="mt-3 flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-impa-50 text-impa-600">
          <Stethoscope />
        </div>
        <div className="text-sm text-impa-muted">
          <div className="font-extrabold text-impa-text">Dra. Gómez</div>
          <div>Clínica Patitas #12</div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs"><Phone size={14}/> +52 55 1234 5678</div>
        </div>
      </div>
      <button onClick={onNueva} className="mt-4 w-full cursor-pointer rounded-xl bg-impa-500 py-2 text-sm font-bold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md">
        Agendar con este vet
      </button>
    </div>
  );
}
