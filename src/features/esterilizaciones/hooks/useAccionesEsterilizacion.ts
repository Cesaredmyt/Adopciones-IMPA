"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  aprobarEsterilizacion,
  rechazarEsterilizacion,
  cancelarEsterilizacion,
  programarEsterilizacion,
  completarEsterilizacion,
  cambiarEstadoEsterilizacion,
} from "@/features/esterilizaciones/actions/esterilizaciones-actions";
import { EsterilizacionesKeys } from "@/features/esterilizaciones/queries/esterilizaciones-keys";
import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";

const formatFecha = (fecha: string) =>
  format(new Date(fecha), "EEEE d 'de' MMMM, h:mm a", { locale: es });

function notifyEmail(path: string, payload: Record<string, unknown>) {
  // Notificación por correo en background; nunca bloquea la UI.
  fetch(`/api/email/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silent */
  });
}

export function useAccionesEsterilizacion() {
  const qc = useQueryClient();

  const invalidar = () => {
    qc.invalidateQueries({ queryKey: EsterilizacionesKeys.admin.all() });
  };

  const aprobar = async (item: EsterilizacionAdminRow) => {
    try {
      await aprobarEsterilizacion(item.id);
      toast.success("Solicitud aprobada.");
      invalidar();
      notifyEmail("esterilizacion-aprobada", {
        email: item.usuario_correo,
        nombre: item.usuario_nombre,
        nombreMascota: item.mascota_nombre,
        folio: item.folio,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al aprobar la solicitud.");
    }
  };

  const rechazar = async (
    item: EsterilizacionAdminRow,
    motivo_cancelacion: string
  ) => {
    try {
      await rechazarEsterilizacion({ id: item.id, motivo_cancelacion });
      toast.success("Solicitud rechazada.");
      invalidar();
      notifyEmail("esterilizacion-rechazada", {
        email: item.usuario_correo,
        nombre: item.usuario_nombre,
        nombreMascota: item.mascota_nombre,
        folio: item.folio,
        motivo: motivo_cancelacion,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al rechazar.");
    }
  };

  const cancelar = async (
    item: EsterilizacionAdminRow,
    motivo_cancelacion: string
  ) => {
    try {
      await cancelarEsterilizacion({ id: item.id, motivo_cancelacion });
      toast.success("Cirugía cancelada.");
      invalidar();
      notifyEmail("esterilizacion-cancelada", {
        email: item.usuario_correo,
        nombre: item.usuario_nombre,
        nombreMascota: item.mascota_nombre,
        folio: item.folio,
        motivo: motivo_cancelacion,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cancelar.");
    }
  };

  const programar = async (
    item: EsterilizacionAdminRow,
    fecha_programada: string
  ) => {
    try {
      await programarEsterilizacion({ id: item.id, fecha_programada });
      toast.success("Cirugía programada.");
      invalidar();
      notifyEmail("esterilizacion-programada", {
        email: item.usuario_correo,
        nombre: item.usuario_nombre,
        nombreMascota: item.mascota_nombre,
        folio: item.folio,
        fechaTexto: formatFecha(fecha_programada),
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al programar.");
    }
  };

  const iniciarCirugia = async (item: EsterilizacionAdminRow) => {
    try {
      await cambiarEstadoEsterilizacion(item.id, "en_quirofano");
      toast.success("Cirugía iniciada.");
      invalidar();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al iniciar cirugía.");
    }
  };

  const completar = async (
    item: EsterilizacionAdminRow,
    payload: {
      estado: "completada" | "complicacion";
      resultado_notas: string;
      complicaciones?: string | null;
    }
  ) => {
    try {
      await completarEsterilizacion({ id: item.id, ...payload });
      toast.success(
        payload.estado === "completada"
          ? "Cirugía completada exitosamente."
          : "Cirugía registrada con complicaciones."
      );
      invalidar();
      notifyEmail("esterilizacion-completada", {
        email: item.usuario_correo,
        nombre: item.usuario_nombre,
        nombreMascota: item.mascota_nombre,
        folio: item.folio,
        estado: payload.estado,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al registrar resultado.");
    }
  };

  return { aprobar, rechazar, cancelar, programar, iniciarCirugia, completar };
}
