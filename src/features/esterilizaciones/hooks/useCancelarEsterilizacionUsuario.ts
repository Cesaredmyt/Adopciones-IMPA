"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelarEsterilizacion } from "@/features/esterilizaciones/actions/esterilizaciones-actions";
import { EsterilizacionesKeys } from "@/features/esterilizaciones/queries/esterilizaciones-keys";

export function useCancelarEsterilizacionUsuario(authId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; motivo_cancelacion: string }) =>
      cancelarEsterilizacion(params),
    onSuccess: () => {
      toast.success("Solicitud cancelada.");
      qc.invalidateQueries({
        queryKey: EsterilizacionesKeys.usuario.infinite(authId),
      });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo cancelar.");
    },
  });
}
