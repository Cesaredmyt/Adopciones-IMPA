"use client";

import React from "react";
import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useReportesAdmin } from "@/features/reportes-maltrato/queries/reportes-queries";
import { useReportesFilterState } from "@/features/reportes-maltrato/hooks/useReportesFilterState";
import { useReportesOrdenados } from "@/features/reportes-maltrato/hooks/useReportesOrdenados";

import ReportesSkeleton from "@/features/reportes-maltrato/components/client/ReportesSkeleton";
import { ReportesKPIs } from "@/features/reportes-maltrato/components/client/ReportesKPIs";
import { ReportesTablaAdmin } from "@/features/reportes-maltrato/components/client/ReportesTablaAdmin";
import { ReportesCardsAdmin } from "@/features/reportes-maltrato/components/client/ReportesCardsAdmin";
import { ReportesPanelLateral } from "@/features/reportes-maltrato/components/client/ReportesPanelLateral";
import { ModalExpedienteReporte } from "@/features/reportes-maltrato/components/client/ModalExpedienteReporte";

import type { ReporteAdminRow } from "@/features/reportes-maltrato/types/reporte";
import { ESTADOS_REPORTE } from "@/features/reportes-maltrato/types/reporte";
import { labelEstadoReporte } from "@/features/reportes-maltrato/utils/formatearEstadoReporte";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

export default function ReportesAdminPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;

  const { filtro, setFiltro, query, setQuery } = useReportesFilterState();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReportesAdmin({ search: query });

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const ordenados = useReportesOrdenados(items, filtro, query);

  const [uiPage, setUiPage] = React.useState(1);
  const pagesLoaded = data?.pages.length ?? 1;
  const totalPages = hasNextPage ? pagesLoaded + 1 : pagesLoaded;

  const paginated = ordenados.slice(
    (uiPage - 1) * ITEMS_PER_PAGE,
    uiPage * ITEMS_PER_PAGE
  );

  const handlePageChange = async (next: number) => {
    if (next < uiPage) {
      setUiPage(next);
      return;
    }
    if (next > pagesLoaded && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
    setUiPage(next);
  };

  const totales = {
    recibidos: items.filter((i) => i.estado === "recibido").length,
    en_revision: items.filter((i) => i.estado === "en_revision").length,
    en_investigacion: items.filter((i) => i.estado === "en_investigacion")
      .length,
    resueltos: items.filter((i) => i.estado === "resuelto").length,
  };

  const [verItem, setVerItem] = React.useState<ReporteAdminRow | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHead
          title="Reportes de maltrato animal"
          subtitle="Gestión de denuncias ciudadanas recibidas por el IMPA."
        />
        <ReportesSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHead
        title="Reportes de maltrato animal"
        subtitle="Gestión de denuncias ciudadanas recibidas por el IMPA."
        right={
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por folio, asunto o colonia"
              className="w-full pl-3 pr-3 py-2 text-sm border border-impa-line rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
            />
          </div>
        }
      />

      <ReportesKPIs totales={totales} />

      <div className="flex flex-wrap gap-1.5">
        <FiltroChip
          activo={filtro === "todos"}
          onClick={() => setFiltro("todos")}
        >
          Todos
        </FiltroChip>
        {ESTADOS_REPORTE.map((e) => (
          <FiltroChip
            key={e}
            activo={filtro === e}
            onClick={() => setFiltro(e)}
          >
            {labelEstadoReporte(e)}
          </FiltroChip>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <div className="space-y-4">
          <ReportesTablaAdmin items={paginated} onVer={setVerItem} />
          <ReportesCardsAdmin items={paginated} onVer={setVerItem} />
        </div>

        <ReportesPanelLateral items={items} />
      </div>

      <Pagination
        page={uiPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={ordenados.length}
        itemsLabel="reportes"
      />

      <ModalExpedienteReporte
        registro={verItem}
        open={!!verItem}
        onClose={() => setVerItem(null)}
      />
    </div>
  );
}

function FiltroChip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
        activo
          ? "bg-impa-cta text-white border-impa-600 shadow-impa-sm"
          : "bg-white text-impa-text border-impa-line hover:bg-impa-50 hover:border-impa-300"
      }`}
    >
      {children}
    </button>
  );
}
