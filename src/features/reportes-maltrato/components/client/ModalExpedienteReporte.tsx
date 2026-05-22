"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Save,
  MessageSquarePlus,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";

import type {
  ReporteAdminRow,
  EstadoReporte,
  PrioridadReporte,
} from "@/features/reportes-maltrato/types/reporte";
import {
  ESTADOS_REPORTE,
  PRIORIDADES_REPORTE,
} from "@/features/reportes-maltrato/types/reporte";
import {
  labelEstadoReporte,
  labelPrioridadReporte,
} from "@/features/reportes-maltrato/utils/formatearEstadoReporte";
import {
  ReporteEstadoBadge,
  ReporteGravedadBadge,
  ReportePrioridadBadge,
} from "./ReporteEstadoBadge";
import { ReporteEvidenciaGaleria } from "./ReporteEvidenciaGaleria";
import { useAccionesReporte } from "@/features/reportes-maltrato/hooks/useAccionesReporte";
import { useBitacoraReporte } from "@/features/reportes-maltrato/queries/reportes-queries";

type Props = {
  registro: ReporteAdminRow | null;
  open: boolean;
  onClose: () => void;
};

function fechaCompleta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "EEEE d 'de' MMMM yyyy, h:mm a", { locale: es });
}
function fechaCorta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}

export function ModalExpedienteReporte({ registro, open, onClose }: Props) {
  const acciones = useAccionesReporte();
  const { data: bitacora = [], isLoading: cargandoBit } = useBitacoraReporte(
    registro?.id ?? null
  );

  const [estado, setEstado] = useState<EstadoReporte>("recibido");
  const [prioridad, setPrioridad] = useState<PrioridadReporte>("normal");
  const [notas, setNotas] = useState("");
  const [resolucion, setResolucion] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (registro) {
      setEstado(registro.estado);
      setPrioridad(registro.prioridad);
      setNotas(registro.notas_internas ?? "");
      setResolucion(registro.resolucion ?? "");
      setComentario("");
    }
  }, [registro]);

  if (!registro) return null;

  const handleGuardar = async () => {
    if (estado !== registro.estado || resolucion !== (registro.resolucion ?? "")) {
      await acciones.cambiarEstado(registro, estado, resolucion || undefined);
    }
    if (prioridad !== registro.prioridad) {
      await acciones.cambiarPrioridad(registro, prioridad);
    }
    if (notas !== (registro.notas_internas ?? "")) {
      await acciones.guardarNotas(registro, notas || null);
    }
  };

  const handleComentar = async () => {
    if (comentario.trim().length < 3) return;
    await acciones.comentar(registro.id, comentario.trim());
    setComentario("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={`Reporte · ${registro.folio}`}
      description={registro.asunto}
    >
      <div className="space-y-6">
        {/* HEADER METADATA */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <ReporteEstadoBadge estado={registro.estado} />
            <ReporteGravedadBadge gravedad={registro.gravedad} />
            <ReportePrioridadBadge prioridad={registro.prioridad} />
          </div>
          <p className="text-xs text-impa-quiet">
            Recibido: {fechaCompleta(registro.created_at)}
          </p>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* COL IZQUIERDA: contenido del reporte */}
          <div className="space-y-4">
            <Box label="Descripción del incidente">
              <p className="text-sm whitespace-pre-wrap text-impa-text">
                {registro.descripcion}
              </p>
            </Box>

            <Box label="Ubicación">
              <p className="text-sm flex items-start gap-2 text-impa-text">
                <MapPin size={14} className="text-impa-600 mt-0.5 shrink-0" />
                <span>
                  <strong>{registro.colonia}</strong>
                  <br />
                  {registro.direccion_incidente}
                </span>
              </p>
              {registro.fecha_incidente && (
                <p className="text-xs text-impa-muted mt-2 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Fecha del incidente: {fechaCorta(registro.fecha_incidente)}
                </p>
              )}
            </Box>

            <Box label={`Evidencias (${registro.evidencias_urls.length})`}>
              <ReporteEvidenciaGaleria urls={registro.evidencias_urls} />
            </Box>

            <Box label="Reportante">
              {registro.es_anonimo ? (
                <p className="text-sm text-impa-quiet italic">
                  Reporte enviado de forma anónima.
                </p>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <User size={14} className="text-impa-600" />
                    <strong>{registro.nombre_reportante ?? "—"}</strong>
                  </p>
                  {registro.telefono_contacto && (
                    <p className="flex items-center gap-2 text-impa-muted">
                      <Phone size={14} className="text-impa-600" />
                      {registro.telefono_contacto}
                    </p>
                  )}
                  {registro.email_contacto && (
                    <p className="flex items-center gap-2 text-impa-muted">
                      <Mail size={14} className="text-impa-600" />
                      {registro.email_contacto}
                    </p>
                  )}
                </div>
              )}
            </Box>
          </div>

          {/* COL DERECHA: gestión admin */}
          <div className="space-y-4">
            <Box label="Estado del caso">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoReporte)}
                className={selectClass}
              >
                {ESTADOS_REPORTE.map((e) => (
                  <option key={e} value={e}>
                    {labelEstadoReporte(e)}
                  </option>
                ))}
              </select>
            </Box>

            <Box label="Prioridad interna">
              <select
                value={prioridad}
                onChange={(e) =>
                  setPrioridad(e.target.value as PrioridadReporte)
                }
                className={selectClass}
              >
                {PRIORIDADES_REPORTE.map((p) => (
                  <option key={p} value={p}>
                    {labelPrioridadReporte(p)}
                  </option>
                ))}
              </select>
            </Box>

            <Box label="Notas internas">
              <textarea
                rows={3}
                maxLength={2000}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Solo visibles para el equipo del IMPA..."
                className={inputClass}
              />
            </Box>

            <Box label="Resolución (visible al reportante)">
              <textarea
                rows={3}
                maxLength={2000}
                value={resolucion}
                onChange={(e) => setResolucion(e.target.value)}
                placeholder="Resumen de las acciones realizadas..."
                className={inputClass}
              />
            </Box>

            <Button
              variant="primary"
              onClick={handleGuardar}
              full
            >
              <Save size={14} className="mr-1" />
              Guardar cambios
            </Button>
          </div>
        </div>

        {/* BITÁCORA */}
        <section className="border-t border-impa-line pt-5">
          <h3 className="text-sm font-bold text-impa-text-strong mb-3">
            Bitácora de seguimiento
          </h3>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Agregar comentario interno..."
              maxLength={1000}
              className={`flex-1 ${inputClass}`}
            />
            <Button
              variant="secondary"
              onClick={handleComentar}
              disabled={comentario.trim().length < 3}
            >
              <MessageSquarePlus size={14} className="mr-1" />
              Agregar
            </Button>
          </div>

          {cargandoBit ? (
            <p className="text-sm text-impa-quiet italic">Cargando bitácora...</p>
          ) : bitacora.length === 0 ? (
            <p className="text-sm text-impa-quiet italic">
              Aún no hay entradas en la bitácora.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scroll pr-2">
              {bitacora.map((b) => (
                <li
                  key={b.id}
                  className="border-l-4 border-impa-500 bg-impa-surface-2 rounded-r-lg p-3 text-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-impa-700 uppercase tracking-wider">
                      {b.accion === "cambio_estado"
                        ? `Estado: ${b.estado_anterior ?? "—"} → ${b.estado_nuevo ?? "—"}`
                        : b.accion === "comentario"
                          ? "Comentario"
                          : b.accion}
                    </span>
                    <span className="text-[11px] text-impa-quiet">
                      {format(new Date(b.created_at), "d MMM, h:mm a", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  {b.descripcion && (
                    <p className="text-impa-text mt-1 whitespace-pre-wrap">
                      {b.descripcion}
                    </p>
                  )}
                  {b.autor_nombre && (
                    <p className="text-[11px] text-impa-muted mt-1">
                      — {b.autor_nombre}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Modal>
  );
}

const inputClass =
  "w-full border border-impa-line rounded-md px-3 py-2 bg-white text-sm text-impa-text focus:outline-none focus:ring-2 focus:ring-impa-500/30 focus:border-impa-500";
const selectClass = inputClass;

function Box({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-impa-line rounded-xl p-4">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-impa-700 mb-2">
        {label}
      </h4>
      {children}
    </div>
  );
}
