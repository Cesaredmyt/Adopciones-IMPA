"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  marcarPlaticaEnRevision,
  agendarPlatica,
  rechazarPlatica,
  cancelarPlatica,
  finalizarPlatica,
} from "@/features/platicas/actions/platicas-actions";
import { PlaticasKeys } from "@/features/platicas/queries/platicas-keys";
import type { PlaticaAdminRow } from "@/features/platicas/types/platica";

const formatFecha = (fecha: string) =>
  format(new Date(fecha), "EEEE d 'de' MMMM, h:mm a", { locale: es });

function notifyEmail(path: string, payload: Record<string, unknown>) {
  fetch(`/api/email/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silent */
  });
}

export function useAccionesPlatica() {
  const qc = useQueryClient();

  const invalidar = () => {
    qc.invalidateQueries({ queryKey: PlaticasKeys.admin.all() });
  };

  const marcarRevision = async (item: PlaticaAdminRow) => {
    try {
      await marcarPlaticaEnRevision(item.id);
      toast.success("Solicitud marcada en revisión.");
      invalidar();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al marcar en revisión.");
    }
  };

  const agendar = async (
    item: PlaticaAdminRow,
    payload: { fecha_definitiva: string; observaciones_internas?: string | null }
  ) => {
    try {
      await agendarPlatica({ id: item.id, ...payload });
      toast.success("Plática aprobada y agendada.");
      invalidar();
      notifyEmail("platica-aprobada", {
        email: item.usuario_correo,
        nombre: item.nombre_solicitante,
        folio: item.folio,
        fechaTexto: formatFecha(payload.fecha_definitiva),
        direccion: item.direccion,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al agendar la plática.");
    }
  };

  const rechazar = async (item: PlaticaAdminRow, motivo_rechazo: string) => {
    try {
      await rechazarPlatica({ id: item.id, motivo_rechazo });
      toast.success("Solicitud rechazada.");
      invalidar();
      notifyEmail("platica-rechazada", {
        email: item.usuario_correo,
        nombre: item.nombre_solicitante,
        folio: item.folio,
        motivo: motivo_rechazo,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al rechazar.");
    }
  };

  const cancelar = async (item: PlaticaAdminRow, motivo_rechazo: string) => {
    try {
      await cancelarPlatica({ id: item.id, motivo_rechazo });
      toast.success("Solicitud cancelada.");
      invalidar();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cancelar.");
    }
  };

  const finalizar = async (item: PlaticaAdminRow) => {
    try {
      await finalizarPlatica(item.id);
      toast.success("Plática marcada como finalizada.");
      invalidar();
      notifyEmail("platica-finalizada", {
        email: item.usuario_correo,
        nombre: item.nombre_solicitante,
        folio: item.folio,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al finalizar.");
    }
  };

  return { marcarRevision, agendar, rechazar, cancelar, finalizar };
}
