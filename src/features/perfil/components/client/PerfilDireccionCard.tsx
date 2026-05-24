"use client";

import { MapPin, MapPinOff, Plus, Pencil, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Direccion } from "@/features/perfil/types/perfil";

/**
 * Card de "Dirección principal" del Perfil.
 * Estilo Stitch: header con título + botón "Agregar/Editar", contenido
 * con empty state limpio (icono en círculo) cuando no hay dirección.
 */
export default function PerfilDireccionCard({
  direccion,
  onEdit,
}: {
  direccion: Direccion | null;
  onEdit: () => void;
}) {
  const tiene = !!direccion;

  return (
    <section
      id="direccion"
      className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm scroll-mt-24"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-impa-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-600 shadow-impa-xs">
            <MapPin size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-impa-text-strong leading-tight">
              Dirección principal
            </h2>
            <p className="text-xs text-impa-muted leading-tight">
              Necesaria para programar visitas y entregas de tu mascota.
            </p>
          </div>
        </div>
        <Button variant="cta" size="sm" onClick={onEdit} className="cursor-pointer shrink-0">
          {tiene ? (
            <>
              <Pencil size={13} />
              Editar
            </>
          ) : (
            <>
              <Plus size={14} />
              Agregar
            </>
          )}
        </Button>
      </header>

      <div className="p-5 sm:p-6">
        {tiene ? (
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-impa-tinted border border-impa-line text-impa-600 shrink-0 mt-0.5">
              <Home size={18} />
            </span>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-impa-text-strong">
                {direccion!.calle}{" "}
                {direccion!.numero_exterior}
                {direccion!.numero_interior
                  ? `, Int. ${direccion!.numero_interior}`
                  : ""}
              </p>
              <p className="text-impa-muted">
                Col. {direccion!.colonia} · CP {direccion!.codigo_postal}
              </p>
              <p className="text-impa-muted">
                {direccion!.municipio}, {direccion!.estado} · {direccion!.pais ?? "México"}
              </p>
            </div>
          </div>
        ) : (
          <EmptyDireccion />
        )}
      </div>
    </section>
  );
}

function EmptyDireccion() {
  return (
    <div className="rounded-xl border border-dashed border-impa-line bg-impa-surface-2/50 px-5 py-6 flex items-center gap-4">
      <span className="grid place-items-center w-12 h-12 rounded-full bg-white border border-impa-line text-impa-quiet shrink-0">
        <MapPinOff size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-impa-text">
          No tienes dirección principal registrada
        </p>
        <p className="text-xs text-impa-muted mt-0.5 leading-relaxed">
          Agrega tu dirección para agilizar la programación de visitas y la
          entrega de mascotas adoptadas.
        </p>
      </div>
    </div>
  );
}
