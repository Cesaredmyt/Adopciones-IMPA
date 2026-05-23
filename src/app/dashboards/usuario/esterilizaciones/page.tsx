"use client";

import React, { useEffect } from "react";
import { Scissors, Sparkles } from "lucide-react";
import { toast } from "sonner";

import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";

import { useUsuarioAuth } from "@/features/usuarios/hooks/useUsuarioAuth";
import {
  useEsterilizacionesUsuario,
  useMascotasEsterilizables,
} from "@/features/esterilizaciones/queries/esterilizaciones-queries";
import { useEsterilizacionesUsuarioPageState } from "@/features/esterilizaciones/hooks/useEsterilizacionesUsuarioPageState";
import { useCrearSolicitudEsterilizacion } from "@/features/esterilizaciones/hooks/useCrearSolicitudEsterilizacion";
import { useCancelarEsterilizacionUsuario } from "@/features/esterilizaciones/hooks/useCancelarEsterilizacionUsuario";

import { EsterilizacionesUsuarioHeader } from "@/features/esterilizaciones/components/client/EsterilizacionesUsuarioHeader";
import EsterilizacionesUsuarioLista from "@/features/esterilizaciones/components/client/EsterilizacionesUsuarioLista";
import { EsterilizacionesUsuarioSolicitar } from "@/features/esterilizaciones/components/client/EsterilizacionesUsuarioSolicitar";
import EsterilizacionesUsuarioSkeleton from "@/features/esterilizaciones/components/client/EsterilizacionesUsuarioSkeleton";
import { ModalMotivo } from "@/features/esterilizaciones/components/client/ModalMotivo";
import type { EsterilizacionUsuarioRow } from "@/features/esterilizaciones/types/esterilizacion";

const ITEMS_PER_PAGE = 8;

export default function EsterilizacionesUsuarioPage() {
  const authId = useUsuarioAuth();

  const { modo, setModo, mensaje, setMensaje } =
    useEsterilizacionesUsuarioPageState();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEsterilizacionesUsuario(authId);

  const { data: mascotas = [], isLoading: cargandoMascotas } =
    useMascotasEsterilizables(authId);

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const bloqueado = items.some((i) =>
    ["pendiente", "aprobada", "programada", "en_quirofano"].includes(i.estado)
  );

  /* ===== Paginación ===== */
  const [uiPage, setUiPage] = React.useState(1);
  const pagesLoaded = data?.pages.length ?? 1;
  const totalPages = hasNextPage ? pagesLoaded + 1 : pagesLoaded;
  const totalItems = data?.pages?.[0]?.total ?? items.length;

  const paginated = items.slice(
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

  /* ===== Crear / cancelar ===== */
  const crear = useCrearSolicitudEsterilizacion({
    authId: authId ?? "",
    onSuccess: () => setModo("lista"),
  });

  const cancelarMutation = useCancelarEsterilizacionUsuario(authId ?? "");
  const [cancelarItem, setCancelarItem] =
    React.useState<EsterilizacionUsuarioRow | null>(null);

  useEffect(() => {
    if (!mensaje) return;
    toast.warning(mensaje);
    setMensaje(null);
  }, [mensaje, setMensaje]);

  return (
    <div className="space-y-6">
      <PageHead
        icon={<Scissors size={22} />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Servicio gratuito IMPA
          </>
        }
        title="Esterilizaciones"
        subtitle="Solicita la esterilización gratuita de tus mascotas adoptadas y consulta el estado de tus trámites."
      />

      <section className="relative overflow-hidden rounded-3xl border border-impa-line bg-white shadow-impa-sm p-5 sm:p-8">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

        <EsterilizacionesUsuarioHeader
          modo={modo}
          setModo={setModo}
          bloqueado={bloqueado}
          setMensaje={setMensaje}
        />

        {isLoading ? (
          <EsterilizacionesUsuarioSkeleton />
        ) : modo === "lista" ? (
          <>
            <EsterilizacionesUsuarioLista
              items={paginated}
              onCancelar={setCancelarItem}
            />

            {totalItems > ITEMS_PER_PAGE && (
              <Pagination
                page={uiPage}
                totalPages={totalPages}
                onChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalItems}
                itemsLabel="solicitudes"
              />
            )}
          </>
        ) : (
          <EsterilizacionesUsuarioSolicitar
            mascotas={mascotas}
            cargandoMascotas={cargandoMascotas}
            enviando={crear.isPending}
            onConfirmar={(input) => crear.mutate(input)}
          />
        )}

        <ModalMotivo
          open={!!cancelarItem}
          title={`Cancelar solicitud · ${cancelarItem?.folio ?? ""}`}
          label="Motivo de cancelación *"
          placeholder="Indica por qué deseas cancelar la solicitud..."
          onClose={() => setCancelarItem(null)}
          onConfirm={(motivo) => {
            if (cancelarItem) {
              cancelarMutation.mutate(
                { id: cancelarItem.id, motivo_cancelacion: motivo },
                { onSettled: () => setCancelarItem(null) }
              );
            }
          }}
        />
      </section>
    </div>
  );
}
