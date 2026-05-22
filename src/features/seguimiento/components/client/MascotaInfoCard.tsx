"use client";

import { PawPrint } from "lucide-react";

export default function MascotaInfoCard({
  mascota,
  onImageClick,
}: {
  mascota: any;
  onImageClick?: (url: string | null) => void;
}) {
  return (
    <div className="mb-10 flex gap-6 rounded-2xl border border-impa-line bg-impa-tinted p-6 shadow-impa-sm">
      <img
        src={mascota.imagen_url ?? "/ISOTIPO IMPA.png"}
        className="h-40 w-40 cursor-pointer rounded-xl border border-impa-line object-cover shadow-impa-xs transition hover:opacity-90"
        onClick={() => onImageClick?.(mascota.imagen_url)}
      />

      <div className="flex flex-col justify-center">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-impa-text">
          {mascota.nombre}
          <PawPrint size={22} />
        </h2>

        <p className="mt-1 text-sm text-impa-muted">
          <b>Raza:</b> {mascota.raza?.nombre}
        </p>

        <p className="text-sm text-impa-muted">
          <b>Especie:</b> {mascota.raza?.especie}
        </p>

        <p className="text-sm text-impa-muted">
          <b>Sexo:</b> {mascota.sexo === "h" ? "Hembra" : "Macho"}
        </p>
      </div>
    </div>
  );
}
