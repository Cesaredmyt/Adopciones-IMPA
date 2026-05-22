"use client";
import { Search, Plus } from "lucide-react";

export default function Filtros({
  vista,
  onChangeVista,
  query,
  onChangeQuery,
  onNueva,
}: {
  vista: "hoy" | "semana" | "mes";
  onChangeVista: (v: "hoy" | "semana" | "mes") => void;
  query: string;
  onChangeQuery: (q: string) => void;
  onNueva: () => void;
}) {
  return (
    <div className="rounded-2xl border border-impa-line bg-white p-3 shadow-impa-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-impa-tinted p-1 text-sm font-semibold">
          {(["hoy", "semana", "mes"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChangeVista(v)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 transition ${
                vista === v ? "bg-impa-500 text-white shadow-impa-xs" : "text-impa-muted hover:bg-impa-50 hover:text-impa-700"
              }`}
            >
              {v === "hoy" ? "Hoy" : v === "semana" ? "Esta semana" : "Todo"}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder="Buscar por mascota, motivo, vet..."
            className="w-full rounded-2xl border border-impa-line bg-white py-2.5 pl-10 pr-3 text-[15px] text-impa-text shadow-impa-xs outline-none transition placeholder:text-impa-subtle hover:border-impa-300 focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15"
          />
        </div>
        <button
          onClick={onNueva}
          className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-impa-500 px-4 py-2 text-sm font-bold text-white shadow-impa-sm transition hover:bg-impa-600 hover:shadow-impa-md"
        >
          <Plus size={16} /> Nueva cita
        </button>
      </div>
    </div>
  );
}
