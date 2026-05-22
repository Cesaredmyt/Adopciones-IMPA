"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CitaForm({
  mascota,
  onSubmit,
  onClose,
}: {
  mascota: any;
  onSubmit: (data: { motivo: string; fecha_cita: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    motivo: "",
    fecha_cita: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.motivo || !form.fecha_cita) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-lg">
      {/* 🐾 Sección de información de la mascota */}
      <div className="flex flex-col items-center border-b border-impa-line bg-impa-tinted p-6 text-center">
        <img
          src={mascota.imagen_url}
          alt={mascota.mascota_nombre}
          className="mb-3 h-32 w-32 rounded-full border border-impa-200 object-cover shadow-impa-sm"
        />
        <h2 className="text-2xl font-semibold text-impa-800">
          {mascota.mascota_nombre}
        </h2>
        <p className="mt-1 text-sm text-impa-muted">Agendar cita veterinaria</p>
      </div>

      {/* 📋 Sección del formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-semibold text-impa-text">
            Fecha tentativa
          </label>
          <input
            type="datetime-local"
            name="fecha_cita"
            value={form.fecha_cita}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-impa-text">
            Motivo de la cita
          </label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            placeholder="Describe brevemente el motivo..."
            className="h-24 w-full resize-none rounded-xl border border-impa-line bg-white p-3 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          />
        </div>

        {/* Barra inferior con botones */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-impa-line bg-impa-tinted pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="hover:bg-impa-50"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Agendar cita
          </Button>
        </div>
      </form>
    </div>
  );
}
