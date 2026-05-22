"use client";

import React from "react";

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
      {/* Foto */}
      <div className="flex justify-center mb-4">
        <img
          src={mascota?.imagen_url || "/ISOTIPO IMPA.png"}
          alt={capitalize(mascota?.nombre)}
          className="h-24 w-24 rounded-full border border-impa-line bg-impa-tinted object-cover shadow-impa-sm"
        />
      </div>

      {/* Nombre */}
      <h3 className="text-xl font-extrabold text-impa-text">
        {capitalize(mascota?.nombre)}
      </h3>

      <p className="mb-3 mt-1 text-sm font-medium text-impa-700">
        Mascota seleccionada para adopcion
      </p>

      {/* Chips */}
      <div className="flex justify-center flex-wrap gap-2 mb-5">
        {mascota?.raza?.nombre && (
          <span className="rounded-full border border-impa-200 bg-impa-50 px-3 py-1 text-xs font-semibold text-impa-700">
            {capitalize(mascota.raza.nombre)}
          </span>
        )}

        {mascota?.tamano && (
          <span className="rounded-full border border-impa-200 bg-white px-3 py-1 text-xs font-semibold text-impa-700">
            {capitalize(mascota.tamano)}
          </span>
        )}

        {mascota?.edad && (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {mascota.edad} meses
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mb-6 space-y-2 text-left text-[13px] text-impa-muted">
        {mascota?.personalidad && (
          <p>
            <strong className="text-impa-text">Personalidad:</strong>{" "}
            {capitalize(mascota.personalidad)}
          </p>
        )}

        {mascota?.peso_kg && (
          <p>
            <strong className="text-impa-text">Peso:</strong> {mascota.peso_kg}{" "}
            kg
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

      {/* ⭐ NUEVA SECCIÓN PARA LLENAR ESPACIO (elegante y útil) */}
      <div className="mb-8 mt-6 rounded-2xl border border-impa-line bg-impa-tinted p-4 text-left shadow-impa-xs">
        <p className="mb-2 text-sm font-extrabold text-impa-text">
          Sobre esta mascota
        </p>

        <ul className="space-y-1 text-[12px] leading-relaxed text-impa-muted">
          <li>- Ha sido evaluada y esta apta para convivir contigo.</li>
          <li>- El equipo del IMPA verifico su salud y comportamiento.</li>
          <li>- Lista para avanzar al siguiente paso de adopcion.</li>
        </ul>
      </div>

      {/* BOTÓN MEJORADO con animación */}
      <button
        onClick={onCancelar}
        className="
          w-full cursor-pointer rounded-xl border border-impa-600
          bg-impa-500 px-5 py-3 text-sm font-semibold text-white
          shadow-impa-sm
          transition-all duration-200
          hover:bg-impa-600
          hover:shadow-impa-md
          hover:-translate-y-[2px]
          active:scale-95
        "
      >
        Cancelar solicitud
      </button>
    </div>
  );
}
