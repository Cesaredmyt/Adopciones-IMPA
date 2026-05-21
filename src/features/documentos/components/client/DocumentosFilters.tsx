"use client";

interface DocumentosFiltersProps {
  filtro: string;
  onChange: (f: string) => void;
}

export default function DocumentosFilters({ filtro, onChange }: DocumentosFiltersProps) {
  const filtros = ["todos", "pendiente", "aprobado", "rechazado"];

  return (
    <div className="w-full overflow-x-auto custom-scroll mt-4">
      <div className="flex items-end gap-1 min-w-max border-b border-impa-line">
        {filtros.map((estado) => {
          const active = filtro === estado;
          return (
            <button
              key={estado}
              onClick={() => onChange(estado)}
              className={`relative -mb-px inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors duration-200 ease-impa-out ${
                active
                  ? "text-impa-700"
                  : "text-impa-muted hover:text-impa-text"
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
              <span
                className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-all duration-300 ease-impa-out ${
                  active ? "bg-impa-500" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
