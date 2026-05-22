"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  listarPlaticasAdmin,
  listarPlaticasUsuario,
} from "@/features/platicas/actions/platicas-actions";
import { PlaticasKeys } from "./platicas-keys";

export function usePlaticasAdmin({ search }: { search?: string } = {}) {
  return useInfiniteQuery({
    queryKey: PlaticasKeys.admin.infinite(search),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarPlaticasAdmin({ cursor: pageParam, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePlaticasUsuario(authId: string | null) {
  return useInfiniteQuery({
    enabled: !!authId,
    queryKey: PlaticasKeys.usuario.infinite(authId ?? ""),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarPlaticasUsuario({ auth_id: authId!, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60,
  });
}
