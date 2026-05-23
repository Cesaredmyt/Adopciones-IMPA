"use client";

import { useMemo, useState } from "react";
import type { AdopcionAdminRow } from "@/features/adopciones/types/adopciones";
import { Search, X, Check, XCircle } from "lucide-react";
import AdopcionCardFull from "@/features/adopciones/components/client/AdopcionCardFull";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
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

      const matchEstado = filtroEstado === "todas" || f.estado === filtroEstado;

      return matchQ && matchEstado;
    });
  }, [items, query, filtroEstado]);

  const clearQuery = () => onQueryChange("");

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-impa-line shadow-impa-sm p-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
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
          <article
            key={f.id}
            className={cn(
              "bg-white border border-impa-line rounded-2xl p-4 shadow-impa-sm space-y-3 cursor-pointer",
              "transition-all duration-200 hover:shadow-impa-md hover:border-impa-line-strong hover:-translate-y-px"
            )}
            onClick={() => setSelected(f)}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-impa-text-strong text-base truncate">
                {f.mascotaNombre ?? "Mascota"}
              </h3>
              <StatusBadge estado={f.estado} />
            </div>

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

            {f.estado === "pendiente" && (
              <div className="flex gap-2 pt-1">
                <Button
                  variant="cta"
                  size="sm"
                  full
                  onClick={(e) => {
                    e.stopPropagation();
                    onAprobar?.(f.id);
                  }}
                >
                  <Check size={14} />
                  Aprobar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  full
                  onClick={(e) => {
                    e.stopPropagation();
                    onRechazar?.(f.id);
                  }}
                >
                  <XCircle size={14} />
                  Rechazar
                </Button>
              </div>
            )}
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-impa-muted py-6 text-sm">
            Sin resultados con los filtros actuales
          </p>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block mt-4">
        <Table stickyHeader>
          <TableHead>
            <TableRow noHover>
              <TableHeader>Adoptante</TableHeader>
              <TableHeader>Mascota</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader align="right">Acciones</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell
                  primary
                  className="cursor-pointer"
                  onClick={() => setSelected(f)}
                >
                  {f.usuarioNombre ?? "—"}
                </TableCell>

                <TableCell className="cursor-pointer" onClick={() => setSelected(f)}>
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
                </TableCell>

                <TableCell>
                  <StatusBadge estado={f.estado} />
                </TableCell>

                <TableCell align="right">
                  {f.estado === "pendiente" ? (
                    <div className="flex flex-wrap gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onAprobar?.(f.id)}
                      >
                        <Check size={13} />
                        Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onRechazar?.(f.id)}
                      >
                        <XCircle size={13} />
                        Rechazar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-impa-quiet italic">
                      {f.estado === "aprobada" ? "Aprobada" : "Rechazada"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableEmpty colSpan={4}>
                Sin resultados con los filtros actuales
              </TableEmpty>
            )}
          </TableBody>
        </Table>
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
