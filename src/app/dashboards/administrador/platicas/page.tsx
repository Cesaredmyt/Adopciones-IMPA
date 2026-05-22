"use client";

import React from "react";
import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import { usePlaticasAdmin } from "@/features/platicas/queries/platicas-queries";
import { useAccionesPlatica } from "@/features/platicas/hooks/useAccionesPlatica";
import { usePlaticasFilterState } from "@/features/platicas/hooks/usePlaticasFilterState";
import { usePlaticasOrdenadas } from "@/features/platicas/hooks/usePlaticasOrdenadas";

import PlaticasSkeleton from "@/features/platicas/components/client/PlaticasSkeleton";
import { PlaticasKPIs } from "@/features/platicas/components/client/PlaticasKPIs";
import { PlaticasTablaAdmin } from "@/features/platicas/components/client/PlaticasTablaAdmin";
import { PlaticasCardsAdmin } from "@/features/platicas/components/client/PlaticasCardsAdmin";
import { PlaticasPanelLateral } from "@/features/platicas/components/client/PlaticasPanelLateral";
import { ModalExpedientePlatica } from "@/features/platicas/components/client/ModalExpedientePlatica";
import { ModalAgendarPlatica } from "@/features/platicas/components/client/ModalAgendarPlatica";
import { ModalMotivoPlatica } from "@/features/platicas/components/client/ModalMotivoPlatica";

import type { PlaticaAdminRow } from "@/features/platicas/types/platica";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

export default function PlaticasAdminPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;

  const { filtro, query, setQuery } = usePlaticasFilterState();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaticasAdmin({ search: query });

  const acciones = useAccionesPlatica();

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const ordenadas = usePlaticasOrdenadas(items, filtro, query);

  const [uiPage, setUiPage] = React.useState(1);
  const pagesLoaded = data?.pages.length ?? 1;
  const totalPages = hasNextPage ? pagesLoaded + 1 : pagesLoaded;

  const paginated = ordenadas.slice(
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
    pendientes: items.filter((i) => i.estado === "pendiente").length,
    aprobadas: items.filter((i) => i.estado === "aprobada").length,
    finalizadas: items.filter((i) => i.estado === "finalizada").length,
    rechazadas: items.filter((i) =>
      ["rechazada", "cancelada"].includes(i.estado)
    ).length,
  };

  const proximas = items
    .filter(
      (i) =>
        i.estado === "aprobada" &&
        i.fecha_definitiva &&
        new Date(i.fecha_definitiva) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.fecha_definitiva!).getTime() -
        new Date(b.fecha_definitiva!).getTime()
    )
    .slice(0, 4);

  const [verItem, setVerItem] = React.useState<PlaticaAdminRow | null>(null);
  const [agendar, setAgendar] = React.useState<PlaticaAdminRow | null>(null);
  const [rechazar, setRechazar] = React.useState<PlaticaAdminRow | null>(null);
  const [cancelar, setCancelar] = React.useState<PlaticaAdminRow | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHead
          title="Pláticas de concientización"
          subtitle="Gestión de solicitudes de pláticas ciudadanas del IMPA."
        />
        <PlaticasSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHead
        title="Pláticas de concientización"
        subtitle="Gestión de solicitudes de pláticas ciudadanas del IMPA."
        right={
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por folio, solicitante o lugar"
              className="w-full pl-3 pr-3 py-2 text-sm border border-impa-line rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-impa-500/30"
            />
          </div>
        }
      />

      <PlaticasKPIs totales={totales} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <div className="space-y-4">
          <PlaticasTablaAdmin
            items={paginated}
            onVer={setVerItem}
            onMarcarRevision={acciones.marcarRevision}
            onAgendar={setAgendar}
            onRechazar={setRechazar}
            onFinalizar={acciones.finalizar}
            onCancelar={setCancelar}
          />

          <PlaticasCardsAdmin
            items={paginated}
            onVer={setVerItem}
            onMarcarRevision={acciones.marcarRevision}
            onAgendar={setAgendar}
            onRechazar={setRechazar}
            onFinalizar={acciones.finalizar}
            onCancelar={setCancelar}
          />
        </div>

        <PlaticasPanelLateral items={items} proximas={proximas} />
      </div>

      <Pagination
        page={uiPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={ordenadas.length}
        itemsLabel="pláticas"
      />

      <ModalExpedientePlatica
        registro={verItem}
        open={!!verItem}
        onClose={() => setVerItem(null)}
      />

      <ModalAgendarPlatica
        registro={agendar}
        open={!!agendar}
        onClose={() => setAgendar(null)}
        onConfirm={async (payload) => {
          if (agendar) {
            await acciones.agendar(agendar, payload);
            setAgendar(null);
          }
        }}
      />

      <ModalMotivoPlatica
        open={!!rechazar}
        title={`Rechazar solicitud · ${rechazar?.folio ?? ""}`}
        label="Motivo del rechazo *"
        placeholder="Explica por qué no se aprueba la solicitud..."
        onClose={() => setRechazar(null)}
        onConfirm={async (motivo) => {
          if (rechazar) {
            await acciones.rechazar(rechazar, motivo);
            setRechazar(null);
          }
        }}
      />

      <ModalMotivoPlatica
        open={!!cancelar}
        title={`Cancelar plática · ${cancelar?.folio ?? ""}`}
        label="Motivo de cancelación *"
        placeholder="Explica por qué se cancela..."
        onClose={() => setCancelar(null)}
        onConfirm={async (motivo) => {
          if (cancelar) {
            await acciones.cancelar(cancelar, motivo);
            setCancelar(null);
          }
        }}
      />
    </div>
  );
}
