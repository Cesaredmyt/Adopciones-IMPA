"use client";

import { useMemo, useState } from "react";
import type { AdopcionAdminRow } from "@/features/adopciones/types/adopciones";
import { Search, X, Check, XCircle } from "lucide-react";
import AdopcionCardFull from "@/features/adopciones/components/client/AdopcionCardFull";
import { cn } from "@/lib/utils";

export type FiltroEstado = "todas" | AdopcionAdminRow["estado"];

type Props = {
  items: AdopcionAdminRow[];
  query: string;
  onQueryChange: (q: string) => void;
  filtroEstado: FiltroEstado;
  onFiltroEstadoChange: (v: FiltroEstado) => void;

  onAprobar?: (id: string) => void;
  onRechazar?: (id: string) => void;
};

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted",
        props.className
      )}
    />
  );
}

function EstadoBadge({ estado }: { estado: AdopcionAdminRow["estado"] }) {
  const map: Record<AdopcionAdminRow["estado"], string> = {
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    aprobada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rechazada: "bg-red-50 text-red-700 border-red-200",
  };

  const dot: Record<AdopcionAdminRow["estado"], string> = {
    pendiente: "bg-amber-500",
    aprobada: "bg-emerald-500",
    rechazada: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[estado]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[estado]}`} />
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}

export default function AdopcionesTable({
  items,
  query,
  onQueryChange,
  filtroEstado,
  onAprobar,
  onRechazar,
}: Props) {
  const [selected, setSelected] = useState<AdopcionAdminRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return items.filter((f) => {
      const matchQ =
        !q ||
        f.usuarioNombre?.toLowerCase().includes(q) ||
        f.mascotaNombre?.toLowerCase().includes(q) ||
        f.tipo_vivienda?.toLowerCase().includes(q) ||
        f.espacio_disponible?.toLowerCase().includes(q);

      const matchEstado =
        filtroEstado === "todas" || f.estado === filtroEstado;

      return matchQ && matchEstado;
    });
  }, [items, query, filtroEstado]);

  const clearQuery = () => onQueryChange("");

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm p-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search pill */}
          <div className="relative flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 rounded-xl border border-impa-line bg-white pl-3 pr-2 h-10 w-full transition-[border-color,box-shadow,background-color] duration-200 ease-impa-out hover:border-impa-300 focus-within:border-impa-500 focus-within:ring-4 focus-within:ring-impa-500/15">
              <Search className="h-4 w-4 text-impa-muted" />

              <input
                placeholder="Buscar por usuario, mascota, vivienda o espacio"
                className="flex-1 bg-transparent text-sm text-impa-text placeholder:text-impa-subtle focus:outline-none"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />

              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="grid place-items-center w-7 h-7 rounded-lg text-impa-muted hover:bg-impa-surface-3 hover:text-impa-text transition-colors duration-150 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden space-y-3">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-impa-line rounded-2xl p-4 shadow-impa-sm space-y-3 cursor-pointer transition-all duration-200 hover:shadow-impa-md hover:border-impa-line-strong hover:-translate-y-px"
            onClick={() => setSelected(f)}
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-impa-text-strong text-base truncate">
                {f.mascotaNombre ?? "Mascota"}
              </h3>
              <EstadoBadge estado={f.estado} />
            </div>

            {/* Info principal */}
            <div className="flex items-center gap-3">
              {f.mascotaImagen && (
                <img
                  src={f.mascotaImagen}
                  alt={f.mascotaNombre ?? "Mascota"}
                  className="w-14 h-14 rounded-xl object-cover border border-impa-line"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-impa-text font-semibold truncate">
                  {f.usuarioNombre}
                </p>

                <p className="text-xs text-impa-muted mt-1">
                  Vivienda:{" "}
                  <span className="font-medium text-impa-text">
                    {f.tipo_vivienda ?? "—"}
                  </span>
                </p>

                <p className="text-xs text-impa-muted">
                  Espacio:{" "}
                  <span className="font-medium text-impa-text">
                    {f.espacio_disponible ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            {/* Acciones */}
            {f.estado === "pendiente" && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAprobar?.(f.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-impa-cta text-white rounded-lg py-2 text-sm font-semibold shadow-impa-sm hover:shadow-impa-glow transition-all duration-200 cursor-pointer"
                >
                  <Check size={14} />
                  Aprobar
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRechazar?.(f.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 text-red-700 bg-red-50 rounded-lg py-2 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-colors duration-150 cursor-pointer"
                >
                  <XCircle size={14} />
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-impa-muted py-6 text-sm">
            Sin resultados con los filtros actuales
          </p>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-impa-line shadow-impa-sm overflow-hidden mt-4">
        <div className="w-full overflow-x-auto custom-scroll">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-[1]">
              <tr className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
                <Th className="text-left">Adoptante</Th>
                <Th className="text-left">Mascota</Th>
                <Th className="text-left">Estado</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-impa-line-faint">
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  className="group bg-white hover:bg-impa-tinted/60 transition-colors duration-150"
                >
                  {/* Adoptante */}
                  <td
                    className="px-4 py-3 text-impa-text font-medium cursor-pointer group-hover:text-impa-700 transition-colors duration-150"
                    onClick={() => setSelected(f)}
                  >
                    {f.usuarioNombre ?? "—"}
                  </td>

                  {/* Mascota */}
                  <td
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => setSelected(f)}
                  >
                    <div className="flex items-center gap-2.5">
                      {f.mascotaImagen ? (
                        <img
                          src={f.mascotaImagen}
                          alt={f.mascotaNombre ?? "Mascota"}
                          className="h-9 w-9 rounded-lg object-cover border border-impa-line ring-1 ring-impa-line/0 group-hover:ring-impa-300/60 transition-all duration-150"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-impa-surface-2 border border-impa-line" />
                      )}
                      <span className="text-impa-text font-medium">{f.mascotaNombre ?? "—"}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <EstadoBadge estado={f.estado} />
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-right">
                    {f.estado === "pendiente" ? (
                      <div className="flex flex-wrap gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => onAprobar?.(f.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors duration-150 cursor-pointer"
                        >
                          <Check size={13} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => onRechazar?.(f.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors duration-150 cursor-pointer"
                        >
                          <XCircle size={13} />
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-impa-quiet italic">
                        {f.estado === "aprobada" ? "Aprobada" : "Rechazada"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-impa-muted"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-impa-line bg-impa-surface-2/50">
                      <span className="text-sm">
                        Sin resultados con los filtros actuales
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLES */}
      <AdopcionCardFull
        adopcion={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onAprobar={(id) => {
          onAprobar?.(id);
          setSelected(null);
        }}
        onRechazar={(id) => {
          onRechazar?.(id);
          setSelected(null);
        }}
      />
    </>
  );
}
