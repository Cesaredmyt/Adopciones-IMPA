"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useIsMobile } from "@/hooks/useIsMobile";
import Pagination from "@/components/ui/Pagination";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import { cn } from "@/lib/utils";

export type RowMascota = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  tamano: string | null;
  edadMeses: string;
  descripcion: string;
  foto: string | null;
  original?: Mascota;
};

type RowActions = {
  onViewCard?: (row: RowMascota) => void;
  onEdit?: (row: RowMascota) => void;
  onDelete?: (row: RowMascota) => void;
};

type Props = {
  data: RowMascota[];
  actions?: RowActions;
  deleteDisabledForId?: (id: string) => boolean;
  mode?: "default" | "seguimiento";

  totalItems: number;
  page: number;
  onPageChange: (page: number) => void;
};

function getFotoSrc(m: RowMascota) {
  return m.foto || null;
}

export default function MascotasTable({
  data,
  actions,
  deleteDisabledForId,
  mode = "default",

  page,
  onPageChange,
  totalItems,
}: Props) {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;
  const disableActions = mode === "seguimiento";

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = data.slice(startIndex, endIndex);

  return (
    <>
      {/* MOBILE */}
      {isMobile ? (
        <div className="grid gap-3">
          {pageData.map((m) => {
            const foto = getFotoSrc(m);
            const esHembra = m.sexo?.toLowerCase() === "hembra";

            return (
              <article
                key={m.id}
                className="impa-card-hover bg-white border border-impa-line rounded-2xl overflow-hidden"
              >
                <div className="relative h-44 bg-impa-surface-2">
                  {foto ? (
                    <img
                      src={foto}
                      alt={m.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-impa-quiet">
                      <ImageIcon size={28} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant={esHembra ? "female" : "male"} size="sm">
                      {esHembra ? "Hembra" : "Macho"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-impa-text leading-tight truncate">
                        {m.nombre}
                      </h3>
                      <p className="text-xs text-impa-muted mt-0.5">
                        {m.especie} · {m.raza || "Criollo"}
                      </p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <Info label="Tamaño" value={m.tamano || "—"} />
                    <Info label="Edad" value={m.edadMeses || "—"} />
                  </dl>

                  {m.descripcion && (
                    <p className="text-xs text-impa-muted line-clamp-2">
                      {m.descripcion}
                    </p>
                  )}

                  {!disableActions && (
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actions?.onEdit?.(m)}
                      >
                        <Pencil size={13} />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleteDisabledForId?.(m.id)}
                        onClick={() => actions?.onDelete?.(m)}
                      >
                        <Trash2 size={13} />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* DESKTOP — Premium table */
        <div className="rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden">
          <div className="w-full overflow-x-auto custom-scroll">
            <table className="min-w-[980px] w-full">
              <thead className="bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line">
                <tr className="text-left">
                  <Th>Mascota</Th>
                  <Th>Especie</Th>
                  <Th>Sexo</Th>
                  <Th>Raza</Th>
                  <Th>Tamaño</Th>
                  <Th>Edad</Th>
                  <Th>Personalidad</Th>
                  {!disableActions && <Th className="text-right">Acciones</Th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-impa-line-faint">
                {pageData.map((m) => {
                  const foto = getFotoSrc(m);
                  const esHembra = m.sexo?.toLowerCase() === "hembra";

                  return (
                    <tr
                      key={m.id}
                      className="group hover:bg-impa-tinted/60 transition-colors duration-150"
                    >
                      <Td>
                        <button
                          onClick={() => actions?.onViewCard?.(m)}
                          className="flex items-center gap-3 group/btn cursor-pointer text-left max-w-[280px]"
                        >
                          <span className="relative block w-12 h-12 rounded-xl overflow-hidden bg-impa-surface-2 ring-1 ring-impa-line shrink-0 transition-transform duration-200 group-hover/btn:scale-105">
                            {foto ? (
                              <img
                                src={foto}
                                alt={m.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="absolute inset-0 grid place-items-center text-impa-quiet">
                                <ImageIcon size={16} />
                              </span>
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-impa-text text-[14px] leading-tight group-hover/btn:text-impa-700 transition-colors duration-150 truncate">
                              {m.nombre}
                            </span>
                            <span className="block text-[11px] text-impa-muted mt-0.5 truncate">
                              {m.raza || "Criollo"}
                            </span>
                          </span>
                        </button>
                      </Td>

                      <Td>
                        <span className="text-impa-text text-sm">{m.especie}</span>
                      </Td>

                      <Td>
                        <Badge variant={esHembra ? "female" : "male"} size="sm">
                          {esHembra ? "Hembra" : "Macho"}
                        </Badge>
                      </Td>

                      <Td className="text-impa-text">{m.raza || "Criollo"}</Td>
                      <Td className="text-impa-text capitalize">{m.tamano || "—"}</Td>
                      <Td className="text-impa-text">{m.edadMeses || "—"}</Td>

                      <Td className="max-w-[280px]">
                        <p className="line-clamp-2 text-impa-muted text-sm">
                          {m.descripcion || "—"}
                        </p>
                      </Td>

                      {!disableActions && (
                        <Td className="text-right">
                          <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actions?.onEdit?.(m)}
                              aria-label="Editar"
                            >
                              <Pencil size={13} />
                              <span className="hidden xl:inline">Editar</span>
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deleteDisabledForId?.(m.id)}
                              onClick={() => actions?.onDelete?.(m)}
                              aria-label="Eliminar"
                            >
                              <Trash2 size={13} />
                              <span className="hidden xl:inline">Eliminar</span>
                            </Button>
                          </div>
                        </Td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {page !== undefined &&
        onPageChange &&
        typeof totalItems === "number" && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="mascotas"
            onChange={onPageChange}
          />
        )}
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <dt className="text-impa-quiet font-medium">{label}:</dt>
      <dd className="text-impa-text font-medium truncate">{value}</dd>
    </div>
  );
}

function Th({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted",
        className
      )}
    />
  );
}

function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={cn("px-4 py-3 align-middle text-sm", className)}
    />
  );
}
