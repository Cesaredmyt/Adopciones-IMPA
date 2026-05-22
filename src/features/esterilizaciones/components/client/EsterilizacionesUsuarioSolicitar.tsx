"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { MascotaEsterilizable } from "@/features/esterilizaciones/types/esterilizacion";

type Props = {
  mascotas: MascotaEsterilizable[];
  cargandoMascotas: boolean;
  enviando: boolean;
  onConfirmar: (input: {
    mascota_id: string;
    mascota_nombre: string;
    peso_kg: number;
    observaciones_previas?: string | null;
  }) => void;
};

export function EsterilizacionesUsuarioSolicitar({
  mascotas,
  cargandoMascotas,
  enviando,
  onConfirmar,
}: Props) {
  const [mascotaId, setMascotaId] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const elegibles = mascotas.filter((m) => !m.mascota_esterilizada);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const mascota = elegibles.find((m) => m.mascota_id === mascotaId);
    const pesoNum = Number(peso);

    if (!mascota) {
      setError("Selecciona una mascota válida.");
      return;
    }
    if (!Number.isFinite(pesoNum) || pesoNum <= 0 || pesoNum >= 200) {
      setError("Ingresa un peso válido (mayor a 0, menor a 200 kg).");
      return;
    }

    onConfirmar({
      mascota_id: mascota.mascota_id,
      mascota_nombre: mascota.mascota_nombre,
      peso_kg: pesoNum,
      observaciones_previas: observaciones.trim() || null,
    });
  };

  if (cargandoMascotas) {
    return (
      <div className="flex items-center justify-center py-12 text-impa-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando tus mascotas adoptadas...
      </div>
    );
  }

  if (elegibles.length === 0) {
    return (
      <div className="bg-impa-50 border border-impa-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-impa-800">
          No tienes mascotas elegibles para solicitar esterilización.
        </p>
        <p className="text-sm text-impa-700 mt-2">
          Solo puedes solicitar la cirugía para mascotas con adopción aprobada y
          que aún no estén esterilizadas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm"
    >
      <h2 className="text-lg font-bold text-impa-text">
        Nueva solicitud de esterilización
      </h2>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
          Selecciona la mascota *
        </span>
        <select
          value={mascotaId}
          onChange={(e) => setMascotaId(e.target.value)}
          className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
          required
        >
          <option value="">Selecciona una mascota...</option>
          {elegibles.map((m) => (
            <option key={m.mascota_id} value={m.mascota_id}>
              {m.mascota_nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
          Peso actual (kg) *
        </span>
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="199"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Ej. 12.5"
          required
          className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-bold uppercase text-impa-700">
          Observaciones previas (opcional)
        </span>
        <textarea
          rows={4}
          maxLength={1000}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Alergias conocidas, medicación actual, comportamientos…"
          className="w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enviar solicitud
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
