"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ThumbsUp, ThumbsDown, XCircle, BadgeCheck, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    asistencia: "asistio" | "no_asistio_no_apto";
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota: string | null;
  }) => void;

  citaLabel: string;

  defaultAsistencia?: "asistio" | "no_asistio_no_apto" | null;
  defaultInteraccion?: "buena_aprobada" | "no_apta" | null;
  defaultNota?: string;
};

export default function CitaEvalModal({
  open,
  onClose,
  onConfirm,
  citaLabel,
  defaultAsistencia = null,
  defaultInteraccion = null,
  defaultNota = "",
}: Props) {

  const [asistencia, setAsistencia] =
    useState<"asistio" | "no_asistio_no_apto">("asistio");
  const [interaccion, setInteraccion] =
    useState<"buena_aprobada" | "no_apta" | null>("buena_aprobada");
  const [nota, setNota] = useState(defaultNota);

  useEffect(() => {
    if (defaultAsistencia) setAsistencia(defaultAsistencia);
    if (defaultInteraccion !== undefined) setInteraccion(defaultInteraccion ?? null);
    setNota(defaultNota ?? "");
  }, [defaultAsistencia, defaultInteraccion, defaultNota]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-impa-text-strong/55 backdrop-blur-md p-4 animate-fade-in">

      {/* CONTENEDOR */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-impa-line shadow-impa-xl overflow-hidden animate-scale-in">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2 to-white">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-200 text-impa-700">
              <BadgeCheck className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-impa-text tracking-tight">Evaluar cita</h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-6 py-5 space-y-6">

          {/* INFO */}
          <div className="bg-impa-50 border border-impa-200 rounded-xl px-4 py-3">
            <p className="text-sm leading-snug">
              <span className="font-semibold text-impa-text">{citaLabel}</span>
            </p>
            <p className="text-xs text-impa-muted mt-1">Ingresa evaluación de la cita.</p>
          </div>

          {/* ASISTENCIA */}
          <div>
            <label className="text-xs font-semibold text-impa-text">
              Asistencia
            </label>

            <div className="grid gap-2 mt-2">

              {/* Asistió */}
              <label
                className={`
                    flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150
                    ${asistencia === "asistio"
                    ? "border-emerald-400 bg-emerald-50 shadow-impa-xs"
                    : "border-impa-line bg-white hover:bg-impa-tinted hover:border-impa-300"
                  }
                  `}
              >
                <input
                  type="radio"
                  name="asistencia"
                  className="accent-emerald-600"
                  checked={asistencia === "asistio"}
                  onChange={() => setAsistencia("asistio")}
                />
                <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                <span className="text-sm font-medium text-impa-text">
                  Asistió
                </span>
              </label>

              {/* No asistió */}
              <label
                className={`
                    flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150
                    ${asistencia === "no_asistio_no_apto"
                    ? "border-red-400 bg-red-50 shadow-impa-xs"
                    : "border-impa-line bg-white hover:bg-impa-tinted hover:border-impa-300"
                  }
                  `}
              >
                <input
                  type="radio"
                  name="asistencia"
                  className="accent-red-600"
                  checked={asistencia === "no_asistio_no_apto"}
                  onChange={() => {
                    setAsistencia("no_asistio_no_apto");
                    setInteraccion(null);
                  }}
                />
                <XCircle className="text-red-600 w-5 h-5" />
                <span className="text-sm font-medium text-impa-text">
                  No asistió / No apto
                </span>
              </label>
            </div>
          </div>

          {/* INTERACCIÓN */}
          {asistencia === "asistio" && (
            <div>
              <label className="text-xs font-semibold text-impa-text">
                Interacción
              </label>

              <div className="grid gap-2 mt-2">

                {/* Buena */}
                <label
                  className={`
                      flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150
                      ${interaccion === "buena_aprobada"
                      ? "border-impa-400 bg-impa-50 shadow-impa-xs"
                      : "border-impa-line bg-white hover:bg-impa-tinted hover:border-impa-300"
                    }
                    `}
                >
                  <input
                    type="radio"
                    name="interaccion"
                    className="accent-impa-500"
                    checked={interaccion === "buena_aprobada"}
                    onChange={() => setInteraccion("buena_aprobada")}
                  />

                  <ThumbsUp className="text-impa-600 w-5 h-5" />
                  <span className="text-sm font-medium text-impa-text">
                    Buena (aprobada)
                  </span>
                </label>

                {/* No apta */}
                <label
                  className={`
                      flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150
                      ${interaccion === "no_apta"
                      ? "border-impa-quiet bg-impa-surface-3 shadow-impa-xs"
                      : "border-impa-line bg-white hover:bg-impa-tinted hover:border-impa-300"
                    }
                    `}
                >
                  <input
                    type="radio"
                    name="interaccion"
                    className="accent-gray-500"
                    checked={interaccion === "no_apta"}
                    onChange={() => setInteraccion("no_apta")}
                  />

                  <ThumbsDown className="text-impa-muted w-5 h-5" />
                  <span className="text-sm font-medium text-impa-text">
                    No apta
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* NOTA */}
          <div>
            <label className="text-xs font-semibold text-impa-text">
              Nota (opcional)
            </label>

            <textarea
              rows={4}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Observaciones…"
              className="mt-2 w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs placeholder:text-impa-subtle transition-[border-color,box-shadow,background-color] duration-200 ease-impa-out hover:border-impa-300 hover:bg-impa-tinted focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15 focus-visible:bg-white resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-impa-line bg-impa-surface-2/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-impa-line bg-white text-sm font-semibold text-impa-text shadow-impa-xs hover:bg-impa-50 hover:border-impa-300 transition-all duration-150 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={() =>
              onConfirm({
                asistencia,
                interaccion: asistencia === "asistio" ? interaccion : "no_apta",
                nota,
              })
            }
            className="h-10 px-4 rounded-xl bg-impa-cta text-white text-sm font-semibold shadow-impa-sm hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer"
          >
            Guardar evaluación
          </button>
        </div>
      </div>
    </div>
  );
}
