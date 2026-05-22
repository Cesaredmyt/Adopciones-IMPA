"use client";

import { Card } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden rounded-2xl border-impa-line bg-white shadow-impa-sm transition-all hover:border-impa-200 hover:shadow-impa-md">
      <div className="relative w-full h-48">
        <img
          src={mascota.imagen_url || "/ISOTIPO IMPA.png"}
          alt={mascota.nombre}
          className="w-full h-full object-cover"
        />

        {mascota.sexo && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full ${
              mascota.sexo === "macho" ? "bg-blue-500" : "bg-pink-400"
            }`}
          >
            {mascota.sexo === "macho" ? "Macho" : "Hembra"}
          </span>
        )}
      </div>

      <div className="p-4 text-impa-muted">
        <h3 className="text-lg font-semibold text-impa-text">
          {mascota.nombre}
        </h3>

        {mascota.raza?.nombre && (
          <p className="text-sm">
            <span className="font-semibold">Raza:</span>{" "}
            {mascota.raza.nombre}
          </p>
        )}

        {mascota.personalidad && (
          <p className="mt-2 text-sm italic text-impa-muted">
            {mascota.personalidad}
          </p>
        )}
      </div>
    </Card>
  );
}
