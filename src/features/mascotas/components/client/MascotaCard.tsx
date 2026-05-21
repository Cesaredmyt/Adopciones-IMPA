"use client";
import React from "react";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Eye, Heart, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  m: Mascota;
  onView: () => void;
  onAdopt: () => void;
  adoptDisabled?: boolean;
};

export default function MascotaCard({
  m,
  onView,
  onAdopt,
  adoptDisabled = false,
}: Props) {
  const fotoSrc = m.imagen_url ?? null;

  const estado = m.estado?.toLowerCase() ?? "disponible";
  const disponible =
    m.disponible_adopcion !== false && estado === "disponible";

  const esHembra = m.sexo?.toLowerCase() === "hembra";

  let botonTexto = "Adoptar";
  let disabled = adoptDisabled;
  let estadoBadge: React.ReactNode = null;

  if (estado === "adoptada") {
    botonTexto = "Adoptada";
    disabled = true;
    estadoBadge = (
      <Badge variant="neutral" size="md">
        Adoptada
      </Badge>
    );
  } else if (estado === "en_proceso") {
    botonTexto = "En proceso";
    disabled = true;
    estadoBadge = (
      <Badge variant="warning" size="md">
        En proceso
      </Badge>
    );
  } else if (!disponible) {
    botonTexto = "No disponible";
    disabled = true;
  } else {
    estadoBadge = (
      <Badge variant="success" size="md" dot>
        Disponible
      </Badge>
    );
  }

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm",
        "transition-[transform,box-shadow,border-color] duration-300 ease-impa-out",
        "hover:-translate-y-1 hover:shadow-impa-lg hover:border-impa-line-strong",
        "animate-fade-in flex flex-col"
      )}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-impa-surface-2">
        {fotoSrc ? (
          <img
            src={fotoSrc}
            alt={m.nombre}
            onClick={onView}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-impa-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-impa-quiet">
            <ImageIcon size={36} />
          </div>
        )}

        {/* Top-left: género */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant={esHembra ? "female" : "male"} size="md" className="shadow-impa-sm">
            {esHembra ? "Hembra" : "Macho"}
          </Badge>
        </div>

        {/* Top-right: estado */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {estadoBadge && (
            <span className="shadow-impa-sm rounded-full">{estadoBadge}</span>
          )}
        </div>

        {/* Bottom overlay quick action */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-impa-out">
          <button
            onClick={onView}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-white/95 text-impa-text text-xs font-semibold shadow-impa-sm hover:bg-white hover:shadow-impa-md transition-all duration-200 cursor-pointer"
          >
            <Eye size={14} />
            Ver detalle
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="text-lg sm:text-[19px] font-bold text-impa-text leading-tight tracking-tight truncate"
              title={m.nombre}
            >
              {m.nombre}
            </h3>
            <p className="text-xs text-impa-muted mt-0.5 truncate">
              {m.raza?.nombre ?? "Criollo"} · {m.raza?.especie ?? "Mascota"}
            </p>
          </div>
          <button
            aria-label="Guardar favorito"
            className="grid place-items-center w-9 h-9 rounded-lg text-impa-quiet hover:text-impa-600 hover:bg-impa-50 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <Heart size={16} />
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
          <Meta label="Tamaño" value={cap(m.tamano) || "—"} />
          <Meta label="Edad" value={m.edad ? String(m.edad) : "—"} />
          <Meta
            label="Personalidad"
            value={m.personalidad || m.descripcion_fisica || "—"}
            full
          />
        </dl>

        <footer className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-impa-line-faint">
          <Button variant="ghost" size="sm" onClick={onView}>
            Ver más
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAdopt}
            disabled={disabled}
          >
            {botonTexto}
          </Button>
        </footer>
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
  full,
}: {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("min-w-0", full && "col-span-2")}>
      <dt className="text-[10px] uppercase tracking-[0.08em] font-bold text-impa-quiet">
        {label}
      </dt>
      <dd className="text-impa-text text-[13px] mt-0.5 capitalize truncate">
        {value}
      </dd>
    </div>
  );
}

function cap(s: string | null | undefined) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
