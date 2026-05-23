"use client";

import React from "react";
import { Heart, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function MascotaSeleccionadaCard({
  mascota,
  onCancelar,
}: {
  mascota: any;
  onCancelar: () => void;
}) {
  return (
    <div className="w-full text-center">
      {/* Foto destacada con halo verde */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-impa-cta blur-2xl opacity-20 scale-110" aria-hidden />
          <img
            src={mascota?.imagen_url || "/ISOTIPO IMPA.png"}
            alt={capitalize(mascota?.nombre)}
            className="relative h-28 w-28 rounded-full border-[3px] border-white bg-impa-tinted object-cover shadow-impa-md ring-1 ring-impa-200"
          />
          <span
            className="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-impa-cta text-white shadow-impa-sm ring-2 ring-white"
            aria-hidden
          >
            <Heart size={12} className="fill-white" />
          </span>
        </div>
      </div>

      {/* Nombre */}
      <h3 className="text-xl font-bold text-impa-text-strong tracking-tight">
        {capitalize(mascota?.nombre)}
      </h3>

      <p className="mb-4 mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-impa-700">
        <span className="impa-dot bg-impa-500" />
        Mascota seleccionada para adopción
      </p>

      {/* Chips */}
      <div className="flex justify-center flex-wrap gap-1.5 mb-5">
        {mascota?.raza?.nombre && (
          <Badge variant="brand" size="sm">{capitalize(mascota.raza.nombre)}</Badge>
        )}
        {mascota?.tamano && (
          <Badge variant="outline" size="sm">{capitalize(mascota.tamano)}</Badge>
        )}
        {mascota?.edad && (
          <Badge variant="info" size="sm">{mascota.edad} meses</Badge>
        )}
      </div>

      {/* Info */}
      <div className="mb-5 space-y-1.5 text-left text-[13px] text-impa-muted">
        {mascota?.personalidad && (
          <p>
            <strong className="text-impa-text">Personalidad:</strong>{" "}
            {capitalize(mascota.personalidad)}
          </p>
        )}
        {mascota?.peso_kg && (
          <p>
            <strong className="text-impa-text">Peso:</strong> {mascota.peso_kg} kg
          </p>
        )}
        {mascota?.altura_cm && (
          <p>
            <strong className="text-impa-text">Altura:</strong>{" "}
            {mascota.altura_cm} cm
          </p>
        )}
        {mascota?.descripcion_fisica && (
          <p>
            <strong className="text-impa-text">Descripción:</strong>{" "}
            {capitalize(mascota.descripcion_fisica)}
          </p>
        )}
      </div>

      {/* Garantía IMPA */}
      <div className="mb-5 rounded-2xl border border-impa-line bg-impa-tinted/60 p-4 text-left">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-impa-700">
          <ShieldCheck size={12} />
          Garantía IMPA
        </p>
        <ul className="space-y-1 text-[12px] leading-relaxed text-impa-muted">
          <li>· Evaluada y apta para convivir contigo.</li>
          <li>· Salud y comportamiento verificados.</li>
          <li>· Lista para el siguiente paso de adopción.</li>
        </ul>
      </div>

      {/* Botón cancelar */}
      <Button
        variant="outline"
        size="md"
        full
        onClick={onCancelar}
        className="cursor-pointer hover:border-red-300 hover:bg-impa-danger-soft hover:text-impa-danger-ink"
      >
        <X size={14} />
        Cancelar solicitud
      </Button>
    </div>
  );
}
