"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

import {
  GRAVEDADES_REPORTE,
  type GravedadReporte,
} from "@/features/reportes-maltrato/types/reporte";
import { labelGravedadReporte } from "@/features/reportes-maltrato/utils/formatearEstadoReporte";
import { subirEvidenciasReporte } from "@/features/reportes-maltrato/utils/uploadEvidencias";
import type { CrearReporteInput } from "@/features/reportes-maltrato/schemas/reportes-schemas";

type Props = {
  enviando: boolean;
  onSubmit: (input: CrearReporteInput) => void;
  prefill?: { nombre: string; email: string; telefono: string } | null;
};

export function ReporteFormularioPublico({ enviando, onSubmit, prefill }: Props) {
  const [esAnonimo, setEsAnonimo] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Pre-llenar datos cuando el usuario está autenticado
  useEffect(() => {
    if (!prefill || esAnonimo) return;
    if (prefill.nombre) setNombre(prefill.nombre);
    if (prefill.email) setEmail(prefill.email);
    if (prefill.telefono) setTelefono(prefill.telefono);
  }, [prefill, esAnonimo]);
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [colonia, setColonia] = useState("");
  const [fechaIncidente, setFechaIncidente] = useState("");
  const [gravedad, setGravedad] = useState<GravedadReporte>("media");

  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const incoming = Array.from(list);
    const next = [...archivos, ...incoming].slice(0, 5);

    setArchivos(next);
    setPreviews((prev) => {
      // limpiar las URL objetuales viejas
      prev.forEach((u) => URL.revokeObjectURL(u));
      return next.map((f) => URL.createObjectURL(f));
    });
    // limpiar el input para permitir re-elegir el mismo archivo si quita y agrega
    e.target.value = "";
  };

  const removeFile = (i: number) => {
    const next = archivos.filter((_, idx) => idx !== i);
    setArchivos(next);
    setPreviews((prev) => {
      const url = prev[i];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (asunto.trim().length < 5) {
      setError("El asunto debe tener al menos 5 caracteres.");
      return;
    }
    if (descripcion.trim().length < 20) {
      setError("La descripción debe tener al menos 20 caracteres.");
      return;
    }
    if (direccion.trim().length < 5) {
      setError("La dirección es demasiado corta.");
      return;
    }
    if (colonia.trim().length < 2) {
      setError("Indica la colonia o zona del incidente.");
      return;
    }
    if (!esAnonimo) {
      if (nombre.trim().length < 3) {
        setError("Indica tu nombre o marca el reporte como anónimo.");
        return;
      }
      const tieneTel = /^[0-9+()\s-]{7,20}$/.test(telefono.trim());
      const tieneMail = /.+@.+\..+/.test(email.trim());
      if (!tieneTel && !tieneMail) {
        setError("Proporciona teléfono o correo para contacto.");
        return;
      }
    }

    let urls: string[] = [];
    try {
      if (archivos.length > 0) {
        setSubiendo(true);
        urls = await subirEvidenciasReporte(archivos);
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al subir las evidencias.");
      setSubiendo(false);
      return;
    } finally {
      setSubiendo(false);
    }

    onSubmit({
      es_anonimo: esAnonimo,
      nombre_reportante: esAnonimo ? null : nombre.trim() || null,
      telefono_contacto: esAnonimo ? null : telefono.trim() || null,
      email_contacto: esAnonimo ? null : email.trim() || null,
      asunto: asunto.trim(),
      descripcion: descripcion.trim(),
      direccion_incidente: direccion.trim(),
      colonia: colonia.trim(),
      fecha_incidente: fechaIncidente || null,
      gravedad,
      evidencias_urls: urls,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-impa-line rounded-2xl shadow-impa-md p-6 sm:p-8 space-y-6"
    >
      {/* IDENTIDAD */}
      <section className="space-y-3">
        <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg border border-impa-line bg-impa-surface-2 hover:bg-impa-50 transition-colors">
          <input
            type="checkbox"
            checked={esAnonimo}
            onChange={(e) => setEsAnonimo(e.target.checked)}
            className="mt-1 h-4 w-4 accent-impa-500"
          />
          <span>
            <span className="block font-semibold text-impa-text text-sm">
              Quiero reportar de forma anónima
            </span>
            <span className="block text-xs text-impa-muted">
              No solicitaremos tus datos. Sin embargo, no podremos darte
              seguimiento personalizado.
            </span>
          </span>
        </label>

        {!esAnonimo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tu nombre *">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre y apellido"
                className={inputClass}
              />
            </Field>
            <Field label="Correo electrónico">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className={inputClass}
              />
            </Field>
            <Field label="Teléfono">
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="443 123 4567"
                className={inputClass}
              />
            </Field>
            <p className="text-xs text-impa-muted sm:col-span-2">
              * Necesitamos al menos un correo o teléfono para contactarte si
              requerimos más información o avisarte de la resolución.
            </p>
          </div>
        )}
      </section>

      {/* INCIDENTE */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Asunto *">
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Resumen breve del incidente"
            maxLength={160}
            className={inputClass}
          />
        </Field>

        <Field label="Gravedad *">
          <select
            value={gravedad}
            onChange={(e) => setGravedad(e.target.value as GravedadReporte)}
            className={inputClass}
          >
            {GRAVEDADES_REPORTE.map((g) => (
              <option key={g} value={g}>
                {labelGravedadReporte(g)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Colonia *" className="sm:col-span-1">
          <input
            type="text"
            value={colonia}
            onChange={(e) => setColonia(e.target.value)}
            placeholder="Ej. Colonia Centro"
            maxLength={160}
            className={inputClass}
          />
        </Field>

        <Field label="Fecha aproximada del incidente" className="sm:col-span-1">
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={fechaIncidente}
            onChange={(e) => setFechaIncidente(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Dirección del incidente *" className="sm:col-span-2">
          <textarea
            rows={2}
            maxLength={300}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Calle, número, referencias..."
            className={inputClass}
          />
        </Field>

        <Field label="Descripción detallada *" className="sm:col-span-2">
          <textarea
            rows={5}
            maxLength={2000}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe lo que ocurrió, cuántos animales están involucrados, condiciones en las que se encuentran, posibles responsables..."
            className={inputClass}
          />
        </Field>
      </section>

      {/* EVIDENCIAS */}
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
          Evidencia fotográfica (opcional, máx. 5)
        </p>

        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-impa-200 bg-impa-50/60 rounded-xl py-6 cursor-pointer hover:bg-impa-50 transition-colors">
          <Upload size={20} className="text-impa-600 mb-2" />
          <span className="text-sm font-medium text-impa-text">
            Selecciona o arrastra imágenes
          </span>
          <span className="text-xs text-impa-muted">
            JPG, PNG o WebP · Máximo 5 MB cada una
          </span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFiles}
            className="hidden"
            disabled={archivos.length >= 5}
          />
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {previews.map((url, i) => (
              <div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden border border-impa-line"
              >
                <img
                  src={url}
                  alt={`Evidencia ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 grid place-items-center w-7 h-7 rounded-full bg-white/90 text-impa-text border border-impa-line shadow-impa-xs hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Quitar imagen"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={enviando || subiendo}
        >
          {enviando || subiendo ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {subiendo ? "Subiendo evidencias..." : "Enviando reporte..."}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar reporte
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
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="font-bold text-xs uppercase tracking-wider text-impa-700 mb-1 block">
        {label}
      </span>
      {children}
    </label>
  );
}
