"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  TIPOS_LUGAR_PLATICA,
  type TipoLugarPlatica,
} from "@/features/platicas/types/platica";
import { labelTipoLugarPlatica } from "@/features/platicas/utils/formatearEstadoPlatica";
import type { SolicitarPlaticaInput } from "@/features/platicas/schemas/platicas-schemas";

type Props = {
  enviando: boolean;
  onConfirmar: (input: SolicitarPlaticaInput) => void;
};

export function PlaticasUsuarioSolicitar({ enviando, onConfirmar }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoLugar, setTipoLugar] = useState<TipoLugarPlatica>("escuela");
  const [nombreLugar, setNombreLugar] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState<string>("");
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [error, setError] = useState<string | null>(null);

  const minDate = new Date(Date.now() + 1000 * 60 * 60 * 24)
    .toISOString()
    .split("T")[0]; // mañana

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const personas = Number(numeroPersonas);

    if (nombre.trim().length < 3) {
      setError("Tu nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!/^[0-9+()\s-]{7,20}$/.test(telefono.trim())) {
      setError("Ingresa un teléfono válido (7-20 caracteres).");
      return;
    }
    if (!Number.isFinite(personas) || personas <= 0 || personas >= 10000) {
      setError("Indica un número de personas válido.");
      return;
    }
    if (direccion.trim().length < 5) {
      setError("La dirección es demasiado corta.");
      return;
    }
    if (!fecha) {
      setError("Selecciona una fecha tentativa.");
      return;
    }

    onConfirmar({
      nombre_solicitante: nombre.trim(),
      telefono_contacto: telefono.trim(),
      tipo_lugar: tipoLugar,
      nombre_lugar: nombreLugar.trim() || null,
      numero_personas: personas,
      direccion: direccion.trim(),
      fecha_tentativa: fecha,
      comentarios: comentarios.trim() || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-impa-line rounded-2xl shadow-impa-sm p-6 space-y-5"
    >
      <header>
        <h2 className="text-lg font-bold text-impa-text-strong">
          Nueva solicitud de plática
        </h2>
        <p className="text-sm text-impa-muted">
          Llena los datos del lugar y de la persona responsable. El IMPA revisará
          tu solicitud y te contactará para confirmar la fecha.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre del solicitante *">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Teléfono o medio de contacto *">
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 443 123 4567"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Tipo de lugar *">
          <select
            value={tipoLugar}
            onChange={(e) => setTipoLugar(e.target.value as TipoLugarPlatica)}
            className={inputClass}
            required
          >
            {TIPOS_LUGAR_PLATICA.map((t) => (
              <option key={t} value={t}>
                {labelTipoLugarPlatica(t)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nombre del lugar (opcional)">
          <input
            type="text"
            value={nombreLugar}
            onChange={(e) => setNombreLugar(e.target.value)}
            placeholder="Ej. Primaria Benito Juárez"
            className={inputClass}
          />
        </Field>

        <Field label="Número aproximado de personas *">
          <input
            type="number"
            min={1}
            max={9999}
            value={numeroPersonas}
            onChange={(e) => setNumeroPersonas(e.target.value)}
            placeholder="Ej. 60"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Fecha tentativa *">
          <input
            type="date"
            min={minDate}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Dirección / lugar exacto *">
        <textarea
          rows={2}
          maxLength={300}
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Calle, número, colonia, ciudad, referencias..."
          required
          className={inputClass}
        />
      </Field>

      <Field label="Comentarios adicionales (opcional)">
        <textarea
          rows={4}
          maxLength={1000}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Edad del público, temas específicos, equipo disponible..."
          className={inputClass}
        />
      </Field>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-2">
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

const inputClass =
  "w-full border border-impa-line rounded-md px-3 py-2 bg-white text-impa-text focus:outline-none focus:ring-2 focus:ring-impa-500/30 focus:border-impa-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
        {label}
      </span>
      {children}
    </label>
  );
}
