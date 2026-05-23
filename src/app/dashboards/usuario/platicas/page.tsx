"use client";

import React, { useEffect } from "react";
import { Megaphone, Sparkles } from "lucide-react";
import { toast } from "sonner";

import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";

import { useUsuarioAuth } from "@/features/usuarios/hooks/useUsuarioAuth";
import { usePlaticasUsuario } from "@/features/platicas/queries/platicas-queries";
import { usePlaticasUsuarioPageState } from "@/features/platicas/hooks/usePlaticasUsuarioPageState";
import { useCrearSolicitudPlatica } from "@/features/platicas/hooks/useCrearSolicitudPlatica";
import { useCancelarPlaticaUsuario } from "@/features/platicas/hooks/useCancelarPlaticaUsuario";

import { PlaticasUsuarioHeader } from "@/features/platicas/components/client/PlaticasUsuarioHeader";
import PlaticasUsuarioLista from "@/features/platicas/components/client/PlaticasUsuarioLista";
import { PlaticasUsuarioSolicitar } from "@/features/platicas/components/client/PlaticasUsuarioSolicitar";
import PlaticasUsuarioSkeleton from "@/features/platicas/components/client/PlaticasUsuarioSkeleton";
import { ModalMotivoPlatica } from "@/features/platicas/components/client/ModalMotivoPlatica";
import type { PlaticaUsuarioRow } from "@/features/platicas/types/platica";

const ITEMS_PER_PAGE = 8;

export default function PlaticasUsuarioPage() {
  const authId = useUsuarioAuth();
  const { modo, setModo, mensaje, setMensaje } = usePlaticasUsuarioPageState();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaticasUsuario(authId);

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

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

  const crear = useCrearSolicitudPlatica({
    authId: authId ?? "",
    onSuccess: () => setModo("lista"),
  });

  const cancelarMutation = useCancelarPlaticaUsuario(authId ?? "");
  const [cancelarItem, setCancelarItem] =
    React.useState<PlaticaUsuarioRow | null>(null);

  useEffect(() => {
    if (!mensaje) return;
    toast.warning(mensaje);
    setMensaje(null);
  }, [mensaje, setMensaje]);

  return (
    <div className="space-y-6">
      <PageHead
        icon={<Megaphone size={22} />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Plásticas educativas IMPA
          </>
        }
        title="Pláticas y talleres"
        subtitle="Solicita pláticas educativas sobre adopción responsable, cuidado animal y bienestar de mascotas."
      />

      <section className="relative overflow-hidden rounded-3xl border border-impa-line bg-white shadow-impa-sm p-5 sm:p-8">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

        <PlaticasUsuarioHeader modo={modo} setModo={setModo} />

        {isLoading ? (
          <PlaticasUsuarioSkeleton />
        ) : modo === "lista" ? (
          <>
            <PlaticasUsuarioLista
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
          <PlaticasUsuarioSolicitar
            enviando={crear.isPending}
            onConfirmar={(input) => crear.mutate(input)}
          />
        )}

        <ModalMotivoPlatica
          open={!!cancelarItem}
          title={`Cancelar solicitud · ${cancelarItem?.folio ?? ""}`}
          label="Motivo de cancelación *"
          placeholder="Indica por qué deseas cancelar la solicitud..."
          onClose={() => setCancelarItem(null)}
          onConfirm={(motivo) => {
            if (cancelarItem) {
              cancelarMutation.mutate(
                { id: cancelarItem.id, motivo_rechazo: motivo },
                { onSettled: () => setCancelarItem(null) }
              );
            }
          }}
        />
      </section>
    </div>
  );
}
