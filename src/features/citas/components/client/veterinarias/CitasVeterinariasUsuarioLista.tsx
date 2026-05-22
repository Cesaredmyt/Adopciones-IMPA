"use client";

import { useState, useMemo, useEffect } from "react";
import { Filter } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function CitasVeterinariasUsuarioLista({
  citas,
  filtro,
  setFiltro,
  obtenerMascota,
}: {
  citas: any[];
  filtro: string;
  setFiltro: (f: any) => void;
  obtenerMascota: (id: string) => string;
}) {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const estadoColor = {
    pendiente: "text-amber-700 bg-amber-50 border-amber-200",
    aprobada: "text-emerald-700 bg-emerald-50 border-emerald-200",
    cancelada: "text-red-700 bg-red-50 border-red-200",
  } as const;

  const [page, setPage] = useState(1);

  const citasFiltradas = useMemo(() => {
    if (filtro === "todas") return citas;
    return citas.filter((c) => c.estado === filtro);
  }, [citas, filtro]);

  useEffect(() => {
    setPage(1);
  }, [filtro, citas, isMobile]);

  const totalPages = Math.ceil(citasFiltradas.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return citasFiltradas.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [citasFiltradas, page, ITEMS_PER_PAGE]);


  return (
    <div>
      {/* Filtro */}
      <div className="flex justify-end mt-6 mb-4">
        <div className="flex items-center gap-2 rounded-2xl border border-impa-line bg-white p-2 shadow-impa-sm">
          <Filter className="w-4 h-4 text-impa-600" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as any)}
            className="h-10 rounded-xl border border-impa-line bg-white px-3 text-sm font-medium text-impa-text shadow-impa-xs hover:border-impa-300 hover:bg-impa-tinted focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:outline-none transition-all"
          >
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-impa-line bg-white shadow-impa-sm custom-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 text-impa-muted border-b border-impa-line">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]">Mascota</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]">Fecha</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]">Hora</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]">Motivo</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]">Estado</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((cita) => {
              const fecha = new Date(cita.fecha_cita);
              const fechaStr = fecha.toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const horaStr = fecha.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const mascota = obtenerMascota(cita.adopcion_id);

              return (
                <tr
                  key={cita.id}
                  className="border-t border-impa-line-faint hover:bg-impa-tinted/60 transition-colors duration-150"
                >
                  <td className="px-4 py-3 font-semibold text-impa-text">
                    {mascota}
                  </td>
                  <td className="px-4 py-3 font-medium text-impa-text">{fechaStr}</td>
                  <td className="px-4 py-3 font-medium text-impa-text">{horaStr}</td>
                  <td className="px-4 py-3 text-impa-muted">{cita.motivo}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${estadoColor[cita.estado]}`}>
                      {cita.estado.charAt(0).toUpperCase() +
                        cita.estado.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="grid sm:hidden gap-4 mt-4">
        {paginated.map((cita) => {
          const fecha = new Date(cita.fecha_cita);
          const fechaStr = fecha.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const horaStr = fecha.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const mascota = obtenerMascota(cita.adopcion_id);

          return (
            <div
              key={cita.id}
              className="bg-white border border-impa-line rounded-2xl p-4 shadow-impa-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-impa-text">{mascota}</h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${estadoColor[cita.estado]}`}
                >
                  {cita.estado}
                </span>
              </div>

              <p className="text-sm text-impa-muted">
                <b>Fecha:</b> {fechaStr}
              </p>
              <p className="text-sm text-impa-muted">
                <b>Hora:</b> {horaStr}
              </p>

              {cita.motivo && (
                <p className="text-sm text-impa-muted mt-1">
                  <b>Motivo:</b> {cita.motivo}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={citasFiltradas.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="citas"
            onChange={(n) => {
              setPage(n);
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 10);
            }}
          />
        </div>
      )}
    </div>
  );
}
