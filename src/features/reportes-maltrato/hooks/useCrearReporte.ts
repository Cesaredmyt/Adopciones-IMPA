"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearReporteMaltrato } from "@/features/reportes-maltrato/actions/reportes-actions";
import type { CrearReporteInput } from "@/features/reportes-maltrato/schemas/reportes-schemas";

type Params = {
  onSuccess?: (folio: string) => void;
};

export function useCrearReporte({ onSuccess }: Params = {}) {
  return useMutation({
    mutationFn: async (input: CrearReporteInput) => {
      const created = await crearReporteMaltrato(input as any);

      // Email de confirmación si el reporte no es anónimo y tiene correo
      if (!input.es_anonimo && input.email_contacto) {
        fetch("/api/email/reporte-recibido", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: input.email_contacto,
            nombre: input.nombre_reportante ?? "Reportante",
            folio: created.folio,
            asunto: input.asunto,
          }),
        }).catch(() => undefined);
      }

      return created;
    },
    onSuccess: (data) => {
      toast.success("Reporte enviado. El IMPA lo revisará pronto.");
      onSuccess?.(data.folio);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo enviar el reporte.");
    },
  });
}
