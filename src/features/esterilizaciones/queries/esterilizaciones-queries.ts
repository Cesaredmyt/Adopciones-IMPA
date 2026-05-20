"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listarEsterilizacionesAdmin,
  listarEsterilizacionesUsuario,
  obtenerMascotasEsterilizables,
} from "@/features/esterilizaciones/actions/esterilizaciones-actions";
import { EsterilizacionesKeys } from "./esterilizaciones-keys";

export function useEsterilizacionesAdmin({
  search,
}: { search?: string } = {}) {
  return useInfiniteQuery({
    queryKey: EsterilizacionesKeys.admin.infinite(search),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarEsterilizacionesAdmin({ cursor: pageParam, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
}

export function useEsterilizacionesUsuario(authId: string | null) {
  return useInfiniteQuery({
    enabled: !!authId,
    queryKey: EsterilizacionesKeys.usuario.infinite(authId ?? ""),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarEsterilizacionesUsuario({
        auth_id: authId!,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60,
  });
}

export function useMascotasEsterilizables(authId: string | null) {
  return useQuery({
    enabled: !!authId,
    queryKey: EsterilizacionesKeys.usuario.mascotas(authId ?? ""),
    queryFn: () => obtenerMascotasEsterilizables(authId!),
    staleTime: 1000 * 60 * 5,
  });
}
