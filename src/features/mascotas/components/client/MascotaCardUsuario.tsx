"use client";
import type { Mascota } from "@/types/mascotas.types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import React, { useState } from "react";

function getFotoSrc(m: Partial<Mascota>) {
  return (
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    m.imagen_url ||
    "/no-image.png"
  );
}

export default function MascotaCardUsuario({
  m,
  open,
  onClose,
  onAdopt,
  adoptDisabled = false,
}: {
  m: Mascota | null;
  open: boolean;
  onClose: () => void;
  onAdopt: () => void;
  adoptDisabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!m) return null;

  const fotoSrc = getFotoSrc(m);

  const { data: qrData } = supabase.storage
    .from("mascotas-qr")
    .getPublicUrl(m.qr_code || "");

  const qrUrl = qrData?.publicUrl || null;

  const razaNombre =
    typeof m.raza === "string" ? m.raza : (m.raza as any)?.nombre || "Mestizo";

  const especieNombre =
    (m.raza as any)?.especie ||
    (typeof (m as any).especie === "string"
      ? (m as any).especie
      : "Desconocido");

  const esHembra =
    m.sexo?.toLowerCase().startsWith("he") ||
    m.sexo?.toLowerCase().startsWith("fe") ||
    ["h", "f"].includes(m.sexo?.toLowerCase());

  const sexoLabel = m.sexo
    ? m.sexo.charAt(0).toUpperCase() + m.sexo.slice(1).toLowerCase()
    : "Sin dato";

  const coloresFormatted =
    m.colores?.length > 0
      ? m.colores.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
      : null;

  const handleVerQR = () => {
    if (!qrUrl) return;
    setShowQrModal(true);
  };

  // Descargar QR (PC y la mayoría de Android)
  const handleDescargarQR = async () => {
    if (!qrUrl) return;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${m.nombre}-qr.png`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar QR", err);
    }
  };

  const handleCompartirQR = async () => {
    const linkQR = `https://impa.vercel.app/mascota/${m.id}`;

    // 🌟 Mensaje emocional + profesional
    const mensaje = `🐾 *IMPA Morelia – Adopta, cambia vidas*  

Hoy queremos presentarte a *${m.nombre}*.  
Es una vida rescatada que ha pasado por mucho… pero aún conserva una enorme capacidad de amar. 💛🐶  

Cada día espera la oportunidad de conocer a alguien que le brinde un hogar, una familia y una segunda oportunidad.  
Quizá ese alguien puedas ser tú. 💚  

✨ Aquí puedes ver su información, fotos y el proceso de adopción:
${linkQR}

Desde este link puedes ver toda su información y adoptarla.  

Gracias por abrir tu corazón.  
— *IMPA Morelia* 🧡`;

    // 📱 ANDROID / iOS — Compartir usando Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Conoce a ${m.nombre}`,
          text: mensaje,
        });
        return;
      } catch (err) {
        console.warn("El usuario canceló compartir:", err);
        // Si falla, seguimos al fallback
      }
    }

    try {
      await navigator.clipboard.writeText(mensaje);

      // Toast visual
      const t = document.createElement("div");
      t.innerHTML = `Información copiada al portapapeles`;
      t.className = `
      fixed bottom-6 left-1/2 -translate-x-1/2 
      bg-black text-white px-4 py-2 
      rounded-xl shadow-lg text-sm opacity-0
      transition-all duration-300 z-[99999]
    `;
      document.body.appendChild(t);

      requestAnimationFrame(() => (t.style.opacity = "1"));
      setTimeout(() => {
        t.style.opacity = "0";
        setTimeout(() => t.remove(), 300);
      }, 2000);
    } catch (err) {
      console.error("No se pudo copiar:", err);
    }
  };

  // Títulos de sección — IMPA brand
  const tituloSuave: React.CSSProperties = {
    color: "#0f830f",
    fontWeight: 800,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "10px",
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
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-white rounded-3xl shadow-impa-xl grid md:grid-cols-2 overflow-hidden border border-impa-line font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <div className="relative h-full bg-impa-50">
              <img
                src={fotoSrc}
                alt={m.nombre}
                className="w-full h-full object-cover"
              />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 grid place-items-center w-9 h-9 bg-white/95 hover:bg-white rounded-full shadow-impa-md transition-all duration-200 cursor-pointer hover:shadow-impa-lg"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4 text-impa-text" />
              </button>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold text-xs sm:text-sm shadow-impa-md backdrop-blur-sm
                    ${esHembra ? "bg-pink-500/95" : "bg-blue-500/95"}
                  `}
                >
                  {sexoLabel}
                </span>

                {m.estado?.toLowerCase() === "disponible" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/95 text-white font-semibold text-xs sm:text-sm shadow-impa-md backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white impa-pulse-ring" />
                    Disponible
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white px-6 py-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {m.nombre}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200">
                  {razaNombre} • {especieNombre}
                </p>
              </div>
            </div>

            {/* Info con SCROLL */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] text-impa-text text-sm custom-scroll">
              {/* ⭐ SECCIÓN 1 */}
              <h3 style={tituloSuave}>Información general</h3>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mb-6 mt-2">
                <div>
                  <dt className="font-semibold text-impa-muted">Tamaño</dt>
                  <dd className="capitalize mt-1">{m.tamano || "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-impa-muted">Edad</dt>
                  <dd className="mt-1">{m.edad ? `${m.edad} meses` : "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-impa-muted">Peso</dt>
                  <dd className="mt-1">
                    {m.peso_kg ? `${m.peso_kg} kg` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-impa-muted">Altura</dt>
                  <dd className="mt-1">
                    {m.altura_cm ? `${m.altura_cm} cm` : "—"}
                  </dd>
                </div>
              </dl>

              {/* ⭐ SECCIÓN 2 */}
              <h3 style={tituloSuave}>Detalles adicionales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6 mt-2">
                <div>
                  <h4 className="font-semibold text-impa-muted">Esterilizado</h4>
                  <p className="mt-1">{m.esterilizado ? "Sí" : "No"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">Colores</h4>
                  <p className="mt-1">{coloresFormatted || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">Personalidad</h4>
                  <p className="capitalize mt-1">{m.personalidad || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-impa-muted">
                    Descripción física
                  </h4>
                  <p className="mt-1">{m.descripcion_fisica || "—"}</p>
                </div>
              </div>

              {/* ⭐ SECCIÓN 3 */}
              {(m.lugar_rescate ||
                m.condicion_ingreso ||
                m.observaciones_medicas) && (
                <div className="border-t border-impa-line pt-4 mt-2">
                  <h3 style={tituloSuave}>Datos médicos y rescate</h3>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
                    {m.lugar_rescate && (
                      <div>
                        <dt className="font-semibold text-impa-muted">
                          Lugar de rescate
                        </dt>
                        <dd className="mt-1">{m.lugar_rescate}</dd>
                      </div>
                    )}

                    {m.condicion_ingreso && (
                      <div>
                        <dt className="font-semibold text-impa-muted">
                          Condición al ingreso
                        </dt>
                        <dd className="mt-1">{m.condicion_ingreso}</dd>
                      </div>
                    )}
                  </dl>

                  {m.observaciones_medicas && (
                    <p className="mt-2">
                      <strong className="font-semibold text-impa-muted">
                        Observaciones:
                      </strong>{" "}
                      {m.observaciones_medicas}
                    </p>
                  )}
                </div>
              )}

              {m.fecha_ingreso && (
                <p className="text-xs text-impa-quiet mt-4">
                  Fecha de ingreso:{" "}
                  {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                </p>
              )}

              {qrUrl && (
                <div className="flex flex-col items-center mt-6">
                  <h3 style={tituloSuave}>Código QR</h3>
                  <img
                    src={qrUrl}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain border rounded-xl p-2 bg-white shadow-md mt-2"
                  />
                  <Button
                    variant="ghost"
                    className="mt-2 text-impa-700 hover:text-impa-800"
                    onClick={handleVerQR}
                  >
                    Ver QR
                  </Button>

                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="ghost"
                      className="text-impa-700 hover:text-impa-800"
                      onClick={handleDescargarQR}
                    >
                      Descargar
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-impa-700 hover:text-impa-800"
                      onClick={handleCompartirQR}
                    >
                      Compartir
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end border-t border-impa-line pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={loading || adoptDisabled}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => onAdopt(), 150);
                  }}
                >
                  {loading ? "Procesando…" : "Adoptar"}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {showQrModal && qrUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] flex items-center justify-center bg-impa-text-strong/55 backdrop-blur-md px-4"
                  onClick={() => setShowQrModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 shadow-impa-xl border border-impa-line max-w-sm w-full flex flex-col items-center"
                  >
                    <div className="w-full flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-impa-text">
                        Código QR de {m.nombre}
                      </h4>
                      <button
                        onClick={() => setShowQrModal(false)}
                        aria-label="Cerrar"
                        className="grid place-items-center w-8 h-8 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <img
                      src={qrUrl}
                      alt={`QR de ${m.nombre}`}
                      className="w-48 h-48 object-contain border border-impa-line rounded-xl p-3 bg-white shadow-impa-sm"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
