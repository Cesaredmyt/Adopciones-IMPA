"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearSolicitudPlatica } from "@/features/platicas/actions/platicas-actions";
import { PlaticasKeys } from "@/features/platicas/queries/platicas-keys";
import { createClient } from "@/lib/supabase/client";
import type { SolicitarPlaticaInput } from "@/features/platicas/schemas/platicas-schemas";

type Params = {
  authId: string;
  onSuccess?: () => void;
};

export function useCrearSolicitudPlatica({ authId, onSuccess }: Params) {
  const qc = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (input: SolicitarPlaticaInput) => {
      const created = await crearSolicitudPlatica(input as any);

      supabase.auth.getUser().then(({ data }) => {
        const email = data?.user?.email;
        const nombre = input.nombre_solicitante;
        if (!email) return;
        fetch("/api/email/platica-solicitada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            nombre,
            folio: created.folio,
          }),
        }).catch(() => undefined);
      });

      return created;
    },

    onSuccess: () => {
      toast.success("Solicitud enviada. El IMPA la revisará pronto.");
      qc.invalidateQueries({
        queryKey: PlaticasKeys.usuario.infinite(authId),
      });
      onSuccess?.();
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo enviar la solicitud.");
    },
  });
}
