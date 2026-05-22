"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  actualizarReporteAdmin,
  agregarComentarioBitacora,
} from "@/features/reportes-maltrato/actions/reportes-actions";
import { ReportesKeys } from "@/features/reportes-maltrato/queries/reportes-keys";
import type {
  ReporteAdminRow,
  EstadoReporte,
  PrioridadReporte,
} from "@/features/reportes-maltrato/types/reporte";

function notifyEmail(path: string, payload: Record<string, unknown>) {
  fetch(`/api/email/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silent */
  });
}

export function useAccionesReporte() {
  const qc = useQueryClient();

  const invalidar = (id?: string) => {
    qc.invalidateQueries({ queryKey: ReportesKeys.admin.all() });
    if (id) {
      qc.invalidateQueries({ queryKey: ReportesKeys.admin.bitacora(id) });
    }
  };

  const cambiarEstado = async (
    item: ReporteAdminRow,
    nuevoEstado: EstadoReporte,
    resolucion?: string
  ) => {
    try {
      await actualizarReporteAdmin({
        id: item.id,
        estado: nuevoEstado,
        resolucion: resolucion ?? item.resolucion ?? null,
      });
      toast.success("Estado actualizado.");
      invalidar(item.id);

      if (nuevoEstado === "resuelto" && item.email_contacto) {
        notifyEmail("reporte-resuelto", {
          email: item.email_contacto,
          nombre: item.nombre_reportante ?? "Reportante",
          folio: item.folio,
          resolucion: resolucion ?? "",
        });
      }
      if (nuevoEstado === "en_investigacion" && item.email_contacto) {
        notifyEmail("reporte-en-investigacion", {
          email: item.email_contacto,
          nombre: item.nombre_reportante ?? "Reportante",
          folio: item.folio,
        });
      }
      if (nuevoEstado === "falso_positivo" && item.email_contacto) {
        notifyEmail("reporte-falso-positivo", {
          email: item.email_contacto,
          nombre: item.nombre_reportante ?? "Reportante",
          folio: item.folio,
        });
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cambiar el estado.");
    }
  };

  const cambiarPrioridad = async (
    item: ReporteAdminRow,
    prioridad: PrioridadReporte
  ) => {
    try {
      await actualizarReporteAdmin({ id: item.id, prioridad });
      toast.success("Prioridad actualizada.");
      invalidar(item.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cambiar prioridad.");
    }
  };

  const asignar = async (item: ReporteAdminRow, adminId: string | null) => {
    try {
      await actualizarReporteAdmin({ id: item.id, asignado_a: adminId });
      toast.success(
        adminId ? "Reporte asignado." : "Asignación removida."
      );
      invalidar(item.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al asignar.");
    }
  };

  const guardarNotas = async (
    item: ReporteAdminRow,
    notas_internas: string | null
  ) => {
    try {
      await actualizarReporteAdmin({ id: item.id, notas_internas });
      toast.success("Notas internas guardadas.");
      invalidar(item.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al guardar notas.");
    }
  };

  const comentar = async (reporte_id: string, descripcion: string) => {
    try {
      await agregarComentarioBitacora({ reporte_id, descripcion });
      toast.success("Comentario agregado a la bitácora.");
      invalidar(reporte_id);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al agregar comentario.");
    }
  };

  return { cambiarEstado, cambiarPrioridad, asignar, guardarNotas, comentar };
}
