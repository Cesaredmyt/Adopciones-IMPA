"use client";

import Modal from "@/components/ui/Modal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";
import { EsterilizacionEstadoBadge } from "./EsterilizacionEstadoBadge";

function formato(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy, h:mm a", { locale: es });
}

export function ModalExpediente({
  registro,
  open,
  onClose,
}: {
  registro: EsterilizacionAdminRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!registro) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Expediente · ${registro.folio}`}
    >
      <div className="space-y-5 text-impa-text">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase text-impa-muted">
              Folio
            </p>
            <p className="text-2xl font-black">{registro.folio}</p>
          </div>
          <EsterilizacionEstadoBadge estado={registro.estado} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-impa-line bg-white/80 p-4 shadow-impa-xs">
            <h4 className="mb-2 text-xs font-bold uppercase text-impa-700">
              Paciente
            </h4>
            <p className="font-semibold">{registro.mascota_nombre}</p>
            <p className="text-sm text-impa-muted">
              Peso: {registro.peso_kg ?? "—"} kg
            </p>
          </div>

          <div className="rounded-2xl border border-impa-line bg-white/80 p-4 shadow-impa-xs">
            <h4 className="mb-2 text-xs font-bold uppercase text-impa-700">
              Solicitante
            </h4>
            <p className="font-semibold">{registro.usuario_nombre}</p>
            <p className="text-sm text-impa-muted">{registro.usuario_correo}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Item label="Solicitada" value={formato(registro.fecha_solicitud)} />
          <Item label="Programada" value={formato(registro.fecha_programada)} />
          <Item label="Realizada" value={formato(registro.fecha_realizada)} />
        </section>

        <section>
          <h4 className="mb-2 text-xs font-bold uppercase text-impa-700">
            Observaciones previas
          </h4>
          <div className="min-h-[60px] whitespace-pre-wrap rounded-xl border border-impa-100 bg-impa-50 p-3 text-sm">
            {registro.observaciones_previas || (
              <span className="text-impa-600/60 italic">
                Sin observaciones previas.
              </span>
            )}
          </div>
        </section>

        {(registro.resultado_notas || registro.complicaciones) && (
          <section>
            <h4 className="mb-2 text-xs font-bold uppercase text-impa-700">
              Resultado clínico
            </h4>
            {registro.resultado_notas && (
              <div className="mb-2 whitespace-pre-wrap rounded-xl border border-impa-100 bg-impa-50 p-3 text-sm">
                {registro.resultado_notas}
              </div>
            )}
            {registro.complicaciones && (
              <div className="whitespace-pre-wrap rounded-xl border border-impa-100 bg-impa-50 p-3 text-sm">
                <strong className="text-impa-700">Complicaciones:</strong>{" "}
                {registro.complicaciones}
              </div>
            )}
          </section>
        )}

        {registro.motivo_cancelacion && (
          <section>
            <h4 className="mb-2 text-xs font-bold uppercase text-impa-700">
              Motivo de cancelación / rechazo
            </h4>
            <div className="whitespace-pre-wrap rounded-xl border border-red-100 bg-red-50 p-3 text-sm">
              {registro.motivo_cancelacion}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-impa-line bg-white/80 p-3 shadow-impa-xs">
      <p className="text-[11px] font-bold uppercase text-impa-muted">
        {label}
      </p>
      <p className="text-impa-text">{value}</p>
    </div>
  );
}
