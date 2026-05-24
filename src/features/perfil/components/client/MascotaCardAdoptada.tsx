"use client";

import { PawPrint, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export type MascotaAdoptadaMin = {
  id: string;
  nombre: string;
  imagen_url: string | null;
  sexo?: string;
  tamano?: string;
  edad?: string | null;
  personalidad?: string | null;
  raza?: { nombre: string; especie: string } | null;
};

export function MascotaCardAdoptada({
  mascota,
}: {
  mascota: MascotaAdoptadaMin;
}) {
  const esHembra = mascota.sexo?.toLowerCase() === "hembra";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm transition-all duration-200 ease-impa-out hover:shadow-impa-md hover:border-impa-line-strong">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent z-10" />

      <div className="relative w-full h-44">
        {mascota.imagen_url ? (
          <img
            src={mascota.imagen_url}
            alt={mascota.nombre}
            className="w-full h-full object-cover transition-transform duration-500 ease-impa-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-impa-tinted text-impa-600">
            <PawPrint size={36} />
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {mascota.sexo && (
            <Badge variant={esHembra ? "female" : "male"} size="sm" className="shadow-impa-sm">
              {esHembra ? "Hembra" : "Macho"}
            </Badge>
          )}
        </div>

        <span className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-impa-500 shadow-impa-sm">
          <Heart size={14} className="fill-impa-500" />
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-impa-text-strong leading-tight truncate">
          {mascota.nombre}
        </h3>
        {mascota.raza?.nombre && (
          <p className="text-xs text-impa-muted mt-0.5 truncate">
            {mascota.raza.nombre}
            {mascota.tamano && <> · {mascota.tamano}</>}
            {mascota.edad && <> · {mascota.edad}</>}
          </p>
        )}
        {mascota.personalidad && (
          <p className="mt-2 text-xs italic text-impa-muted line-clamp-2 leading-relaxed">
            {mascota.personalidad}
          </p>
        )}
      </div>
    </article>
  );
}
