"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listarReportesAdmin,
  listarBitacoraReporte,
} from "@/features/reportes-maltrato/actions/reportes-actions";
import { ReportesKeys } from "./reportes-keys";

export function useReportesAdmin({ search }: { search?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ReportesKeys.admin.infinite(search),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarReportesAdmin({ cursor: pageParam, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBitacoraReporte(reporteId: string | null) {
  return useQuery({
    enabled: !!reporteId,
    queryKey: ReportesKeys.admin.bitacora(reporteId ?? ""),
    queryFn: () => listarBitacoraReporte(reporteId!),
    staleTime: 1000 * 30,
  });
}
