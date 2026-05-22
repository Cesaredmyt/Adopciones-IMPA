"use client";
import React from "react";
import type { Mascota } from "@/types/mascotas.types";
import { X, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

function capitalize(text?: string | null): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function getFotoSrc(m: Partial<Mascota>) {
  return (
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    m.imagen_url ||
    "/ISOTIPO IMPA.png"
  );
}

type Props = {
  m: Mascota | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
};

export default function MascotaCardFull({
  m,
  open,
  onClose,
  onEdit,
  onDelete,
  deleteDisabled,
}: Props) {
  if (!m) return null;

  const fotoSrc = getFotoSrc(m);

  const esHembra =
    m.sexo?.toLowerCase().startsWith("he") ||
    m.sexo?.toLowerCase().startsWith("fe") ||
    ["h", "f"].includes(m.sexo?.toLowerCase());

  const sexoLabel = capitalize(m.sexo || "Desconocido");

  const estadoEtiqueta =
    m.estado === "en_proceso"
      ? "En proceso"
      : m.estado === "disponible"
      ? "Disponible"
      : m.estado === "adoptada"
      ? "Adoptada"
      : capitalize(m.estado || "Desconocido");

  const estadoBadge =
    m.estado === "disponible"
      ? "bg-emerald-500 text-white"
      : m.estado === "en_proceso"
      ? "bg-yellow-500 text-white"
      : m.estado === "adoptada"
      ? "bg-blue-500 text-white"
      : "bg-impa-muted text-white";

  const coloresFormatted =
    m.colores?.map((c) => capitalize(c)).join(", ") || null;

  // estilo de subtítulos de sección
  const tituloSuave = {
    color: "var(--impa-700)",
    fontWeight: 700,
    fontSize: "0.78rem",
    letterSpacing: 0,
    textTransform: "uppercase" as const,
    marginBottom: "8px",
    display: "inline-block",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-impa-text-strong/55 backdrop-blur-md px-4 py-8"
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-white rounded-3xl shadow-impa-xl grid md:grid-cols-2 overflow-hidden border border-impa-line"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-300/70 to-transparent z-10" />
            {/* IMAGEN */}
            <div className="relative h-full bg-impa-surface-2">
              <img
                src={fotoSrc}
                alt={m.nombre}
                className="w-full h-full object-cover"
              />

              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-4 right-4 grid place-items-center w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-impa-md hover:bg-white hover:shadow-impa-lg transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5 text-impa-text" />
              </button>

              {/* Sexo + Estado juntos */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold text-xs sm:text-sm shadow
                    ${esHembra ? "bg-pink-500/90" : "bg-blue-500/90"}
                  `}
                >
                  {sexoLabel}
                </span>

                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs sm:text-sm shadow ${estadoBadge}`}
                >
                  {estadoEtiqueta}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-6 py-4">
                <h2 className="text-3xl font-bold">
                  {capitalize(m.nombre)}
                </h2>
                <p className="text-sm text-white/80">
                  {capitalize(m.raza?.nombre || "Mestizo")} •{" "}
                  {capitalize(m.raza?.especie || "Desconocido")}
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto custom-scroll max-h-[90vh] text-impa-text text-base bg-gradient-to-b from-white to-impa-surface-2/40">

              {/* SECCIÓN: Información general */}
              <h3 style={tituloSuave}>Información general</h3>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mb-6 mt-2">
                <div>
                  <dt className="font-semibold text-impa-muted">Tamaño</dt>
                  <dd className="capitalize">{m.tamano || "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-impa-muted">Edad</dt>
                  <dd>{m.edad ? `${m.edad} meses` : "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-impa-muted">Peso</dt>
                  <dd>{m.peso_kg ? `${m.peso_kg} kg` : "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-impa-muted">Altura</dt>
                  <dd>{m.altura_cm ? `${m.altura_cm} cm` : "—"}</dd>
                </div>
              </dl>

              {/* SECCIÓN: Detalles adicionales */}
              <h3 style={tituloSuave}>Detalles adicionales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6 mt-2">
                <div>
                  <h4 className="font-semibold text-impa-muted">
                    Esterilizado
                  </h4>
                  <p>{m.esterilizado ? "Sí" : "No"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">Colores</h4>
                  <p>{coloresFormatted || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">
                    Personalidad
                  </h4>
                  <p>{capitalize(m.personalidad) || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">
                    Descripción física
                  </h4>
                  <p>{capitalize(m.descripcion_fisica) || "—"}</p>
                </div>
              </div>

              {/* SECCIÓN: Datos médicos */}
              {(m.lugar_rescate ||
                m.condicion_ingreso ||
                m.observaciones_medicas) && (
                <div className="border-t border-impa-line-faint pt-4 mt-2">
                  <h3 style={tituloSuave}>Datos médicos y rescate</h3>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
                    {m.lugar_rescate && (
                      <div>
                        <dt className="font-semibold text-impa-muted">
                          Lugar de rescate
                        </dt>
                        <dd>{capitalize(m.lugar_rescate)}</dd>
                      </div>
                    )}

                    {m.condicion_ingreso && (
                      <div>
                        <dt className="font-semibold text-impa-muted">
                          Condición al ingresar
                        </dt>
                        <dd>{capitalize(m.condicion_ingreso)}</dd>
                      </div>
                    )}
                  </dl>

                  {m.observaciones_medicas && (
                    <p className="mt-2 text-impa-muted">
                      <strong>Observaciones:</strong>{" "}
                      {capitalize(m.observaciones_medicas)}
                    </p>
                  )}
                </div>
              )}

              {/* QR */}
              {m.qr_code && (
                <div className="mt-6 border-t border-impa-line-faint pt-4">
                  <h3 style={tituloSuave}>Código QR</h3>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mascotas-qr/${m.qr_code}`}
                      className="w-40 h-40 object-contain border rounded-xl bg-white p-2 shadow-md"
                    />
                    <a
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mascotas-qr/${m.qr_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-impa-700 hover:text-impa-800 text-sm font-semibold underline underline-offset-4"
                    >
                      Ver o descargar QR
                    </a>
                  </div>
                </div>
              )}

              {/* FECHA */}
              {m.fecha_ingreso && (
                <p className="text-xs text-impa-quiet mt-4">
                  Fecha de ingreso:{" "}
                  {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                </p>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
