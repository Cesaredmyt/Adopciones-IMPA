"use client";

import React from "react";
import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useEsterilizacionesAdmin } from "@/features/esterilizaciones/queries/esterilizaciones-queries";
import { useAccionesEsterilizacion } from "@/features/esterilizaciones/hooks/useAccionesEsterilizacion";
import { useEsterilizacionesFilterState } from "@/features/esterilizaciones/hooks/useEsterilizacionesFilterState";
import { useEsterilizacionesOrdenadas } from "@/features/esterilizaciones/hooks/useEsterilizacionesOrdenadas";

import EsterilizacionesSkeleton from "@/features/esterilizaciones/components/client/EsterilizacionesSkeleton";
import { EsterilizacionesKPIs } from "@/features/esterilizaciones/components/client/EsterilizacionesKPIs";
import { EsterilizacionesTablaAdmin } from "@/features/esterilizaciones/components/client/EsterilizacionesTablaAdmin";
import { EsterilizacionesCardsAdmin } from "@/features/esterilizaciones/components/client/EsterilizacionesCardsAdmin";
import { EsterilizacionesPanelLateral } from "@/features/esterilizaciones/components/client/EsterilizacionesPanelLateral";
import { ModalExpediente } from "@/features/esterilizaciones/components/client/ModalExpediente";
import { ModalProgramar } from "@/features/esterilizaciones/components/client/ModalProgramar";
import { ModalCompletarCirugia } from "@/features/esterilizaciones/components/client/ModalCompletarCirugia";
import { ModalMotivo } from "@/features/esterilizaciones/components/client/ModalMotivo";

import type { EsterilizacionAdminRow } from "@/features/esterilizaciones/types/esterilizacion";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

export default function EsterilizacionesAdminPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;

  const { filtro, query, setQuery } = useEsterilizacionesFilterState();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEsterilizacionesAdmin({ search: query });

  const acciones = useAccionesEsterilizacion();

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const ordenadas = useEsterilizacionesOrdenadas(items, filtro, query);

  /* ===== Paginación UI ===== */
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

  /* ===== KPIs ===== */
  const totales = {
    pendientes: items.filter((i) => i.estado === "pendiente").length,
    programadas: items.filter((i) => i.estado === "programada").length,
    completadas: items.filter((i) => i.estado === "completada").length,
    canceladas: items.filter((i) =>
      ["cancelada", "rechazada"].includes(i.estado)
    ).length,
  };

  const proximas = items
    .filter(
      (i) =>
        i.estado === "programada" &&
        i.fecha_programada &&
        new Date(i.fecha_programada) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.fecha_programada!).getTime() -
        new Date(b.fecha_programada!).getTime()
    )
    .slice(0, 4);

  /* ===== Modales ===== */
  const [verItem, setVerItem] = React.useState<EsterilizacionAdminRow | null>(
    null
  );
  const [programar, setProgramar] = React.useState<EsterilizacionAdminRow | null>(
    null
  );
  const [completar, setCompletar] = React.useState<EsterilizacionAdminRow | null>(
    null
  );
  const [rechazar, setRechazar] = React.useState<EsterilizacionAdminRow | null>(
    null
  );
  const [cancelar, setCancelar] = React.useState<EsterilizacionAdminRow | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHead
          title="Esterilizaciones"
          subtitle="Gestión clínica y control de cirugías del IMPA."
        />
        <EsterilizacionesSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHead
        title="Esterilizaciones"
        subtitle="Gestión clínica y control de cirugías del IMPA."
        right={
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por folio, mascota o solicitante"
              className="h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs transition placeholder:text-impa-subtle hover:border-impa-300 hover:bg-impa-50/35 focus:border-impa-500 focus:outline-none focus:ring-4 focus:ring-impa-500/15"
            />
          </div>
        }
      />

      <EsterilizacionesKPIs totales={totales} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <div className="space-y-4">
          <EsterilizacionesTablaAdmin
            items={paginated}
            onVer={setVerItem}
            onAprobar={acciones.aprobar}
            onRechazar={setRechazar}
            onProgramar={setProgramar}
            onIniciar={acciones.iniciarCirugia}
            onCompletar={setCompletar}
            onCancelar={setCancelar}
          />

          <EsterilizacionesCardsAdmin
            items={paginated}
            onVer={setVerItem}
            onAprobar={acciones.aprobar}
            onRechazar={setRechazar}
            onProgramar={setProgramar}
            onIniciar={acciones.iniciarCirugia}
            onCompletar={setCompletar}
            onCancelar={setCancelar}
          />
        </div>

        <EsterilizacionesPanelLateral items={items} proximas={proximas} />
      </div>

      <Pagination
        page={uiPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={ordenadas.length}
        itemsLabel="esterilizaciones"
      />

      {/* Modales */}
      <ModalExpediente
        registro={verItem}
        open={!!verItem}
        onClose={() => setVerItem(null)}
      />

      <ModalProgramar
        registro={programar}
        open={!!programar}
        onClose={() => setProgramar(null)}
        onConfirm={async (fecha) => {
          if (programar) {
            await acciones.programar(programar, fecha);
            setProgramar(null);
          }
        }}
      />

      <ModalCompletarCirugia
        registro={completar}
        open={!!completar}
        onClose={() => setCompletar(null)}
        onConfirm={async (payload) => {
          if (completar) {
            await acciones.completar(completar, payload);
            setCompletar(null);
          }
        }}
      />

      <ModalMotivo
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

      <ModalMotivo
        open={!!cancelar}
        title={`Cancelar cirugía · ${cancelar?.folio ?? ""}`}
        label="Motivo de cancelación *"
        placeholder="Explica por qué se cancela la cirugía..."
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
