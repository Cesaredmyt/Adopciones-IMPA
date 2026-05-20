"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { crearSolicitudEsterilizacion } from "@/features/esterilizaciones/actions/esterilizaciones-actions";
import { EsterilizacionesKeys } from "@/features/esterilizaciones/queries/esterilizaciones-keys";
import { createClient } from "@/lib/supabase/client";

type Params = {
  authId: string;
  onSuccess?: () => void;
};

export function useCrearSolicitudEsterilizacion({ authId, onSuccess }: Params) {
  const qc = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (input: {
      mascota_id: string;
      mascota_nombre: string;
      peso_kg: number;
      observaciones_previas?: string | null;
    }) => {
      const { mascota_nombre, ...rest } = input;
      const created = await crearSolicitudEsterilizacion(rest);

      // Email en background al usuario (confirmación de recepción)
      supabase.auth.getUser().then(({ data }) => {
        const email = data?.user?.email;
        const nombre = data?.user?.user_metadata?.nombre ?? "Adoptante";
        if (!email) return;
        fetch("/api/email/esterilizacion-solicitada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            nombre,
            nombreMascota: mascota_nombre,
            folio: created.folio,
          }),
        }).catch(() => undefined);
      });

      return created;
    },

    onSuccess: () => {
      toast.success("Solicitud enviada. El IMPA la revisará pronto.");
      qc.invalidateQueries({
        queryKey: EsterilizacionesKeys.usuario.infinite(authId),
      });
      onSuccess?.();
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo enviar la solicitud.");
    },
  });
}
