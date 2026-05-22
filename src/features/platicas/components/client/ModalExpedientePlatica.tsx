"use client";

import Modal from "@/components/ui/Modal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { PlaticaAdminRow } from "@/features/platicas/types/platica";
import { PlaticaEstadoBadge } from "./PlaticaEstadoBadge";
import { labelTipoLugarPlatica } from "@/features/platicas/utils/formatearEstadoPlatica";

function fechaSolo(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy", { locale: es });
}
function fechaCompleta(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "EEEE d 'de' MMMM yyyy, h:mm a", { locale: es });
}

export function ModalExpedientePlatica({
  registro,
  open,
  onClose,
}: {
  registro: PlaticaAdminRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!registro) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Expediente · ${registro.folio}`}
      size="lg"
    >
      <div className="space-y-5 text-impa-text">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-impa-quiet font-bold">
              Folio
            </p>
            <p className="text-2xl font-black text-impa-700">{registro.folio}</p>
          </div>
          <PlaticaEstadoBadge estado={registro.estado} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Box label="Solicitante">
            <p className="font-semibold">{registro.nombre_solicitante}</p>
            <p className="text-sm text-impa-muted">{registro.telefono_contacto}</p>
            <p className="text-xs text-impa-quiet mt-1">
              {registro.usuario_correo}
            </p>
          </Box>
          <Box label="Lugar">
            <p className="font-semibold">
              {labelTipoLugarPlatica(registro.tipo_lugar)}
            </p>
            {registro.nombre_lugar && (
              <p className="text-sm text-impa-muted">{registro.nombre_lugar}</p>
            )}
            <p className="text-xs text-impa-quiet mt-1">
              ≈ {registro.numero_personas} personas
            </p>
          </Box>
        </section>

        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
            Dirección
          </h4>
          <div className="bg-impa-50 border border-impa-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
            {registro.direccion}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Item label="Solicitada el" value={fechaSolo(registro.created_at)} />
          <Item
            label="Fecha tentativa"
            value={fechaSolo(registro.fecha_tentativa)}
          />
          <Item
            label="Agendada"
            value={fechaCompleta(registro.fecha_definitiva)}
          />
        </section>

        {registro.comentarios && (
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
              Comentarios del solicitante
            </h4>
            <div className="bg-impa-surface-2 border border-impa-line p-3 rounded-lg text-sm whitespace-pre-wrap">
              {registro.comentarios}
            </div>
          </section>
        )}

        {registro.observaciones_internas && (
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
              Observaciones internas
            </h4>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
              {registro.observaciones_internas}
            </div>
          </section>
        )}

        {registro.motivo_rechazo && (
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
              Motivo de rechazo / cancelación
            </h4>
            <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
              {registro.motivo_rechazo}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}

function Box({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-impa-line">
      <h4 className="text-xs font-bold uppercase tracking-wider text-impa-700 mb-2">
        {label}
      </h4>
      {children}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-impa-line">
      <p className="text-[11px] uppercase tracking-wider text-impa-quiet font-bold">
        {label}
      </p>
      <p className="text-impa-text">{value}</p>
    </div>
  );
}
