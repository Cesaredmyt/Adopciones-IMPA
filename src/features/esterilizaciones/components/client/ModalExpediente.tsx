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
      <div className="space-y-5 text-[#3b2710]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a06b3c] font-bold">
              Folio
            </p>
            <p className="text-2xl font-black">{registro.folio}</p>
          </div>
          <EsterilizacionEstadoBadge estado={registro.estado} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 p-4 rounded-xl border border-[#f0e0cc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f830f] mb-2">
              Paciente
            </h4>
            <p className="font-semibold">{registro.mascota_nombre}</p>
            <p className="text-sm text-slate-600">
              Peso: {registro.peso_kg ?? "—"} kg
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-xl border border-[#f0e0cc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f830f] mb-2">
              Solicitante
            </h4>
            <p className="font-semibold">{registro.usuario_nombre}</p>
            <p className="text-sm text-slate-600">{registro.usuario_correo}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Item label="Solicitada" value={formato(registro.fecha_solicitud)} />
          <Item label="Programada" value={formato(registro.fecha_programada)} />
          <Item label="Realizada" value={formato(registro.fecha_realizada)} />
        </section>

        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f830f] mb-2">
            Observaciones previas
          </h4>
          <div className="bg-impa-50 border border-impa-100 p-3 rounded-lg text-sm whitespace-pre-wrap min-h-[60px]">
            {registro.observaciones_previas || (
              <span className="text-impa-600/60 italic">
                Sin observaciones previas.
              </span>
            )}
          </div>
        </section>

        {(registro.resultado_notas || registro.complicaciones) && (
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f830f] mb-2">
              Resultado clínico
            </h4>
            {registro.resultado_notas && (
              <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-sm whitespace-pre-wrap mb-2">
                {registro.resultado_notas}
              </div>
            )}
            {registro.complicaciones && (
              <div className="bg-impa-50 border border-impa-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
                <strong className="text-impa-700">Complicaciones:</strong>{" "}
                {registro.complicaciones}
              </div>
            )}
          </section>
        )}

        {registro.motivo_cancelacion && (
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f830f] mb-2">
              Motivo de cancelación / rechazo
            </h4>
            <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
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
    <div className="bg-white/70 p-3 rounded-lg border border-[#f0e0cc]">
      <p className="text-[11px] uppercase tracking-wider text-[#a06b3c] font-bold">
        {label}
      </p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
