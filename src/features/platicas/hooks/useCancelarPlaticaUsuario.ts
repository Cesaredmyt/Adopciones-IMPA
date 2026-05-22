"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelarPlatica } from "@/features/platicas/actions/platicas-actions";
import { PlaticasKeys } from "@/features/platicas/queries/platicas-keys";

export function useCancelarPlaticaUsuario(authId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; motivo_rechazo: string }) =>
      cancelarPlatica(input),
    onSuccess: () => {
      toast.success("Solicitud cancelada.");
      qc.invalidateQueries({
        queryKey: PlaticasKeys.usuario.infinite(authId),
      });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo cancelar la solicitud.");
    },
  });
}
