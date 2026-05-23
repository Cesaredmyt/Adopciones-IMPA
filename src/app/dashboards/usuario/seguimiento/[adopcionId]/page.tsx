"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Sparkles, PawPrint } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import ModalInfoSeguimiento from "@/features/seguimiento/components/client/ModalInfoSeguimiento";
import ModalSeguimiento from "@/features/seguimiento/components/client/ModalSeguimiento";
import SeguimientoForm from "@/features/seguimiento/components/client/SeguimientoForm";

import { useSeguimientoMascotasQuery } from "@/features/seguimiento/hooks/useSeguimientoMacostasQuery";
import SeguimientoMascotaCard from "@/features/seguimiento/components/client/SeguimientoMascotaCard";
import dayjs from "dayjs";

export default function SeguimientoMascotasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: mascotas = [], isLoading } = useSeguimientoMascotasQuery();

  const [infoOpen, setInfoOpen] = useState(false);
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [seguimientoActual, setSeguimientoActual] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-9 w-44 bg-impa-surface-3 rounded-xl impa-shimmer" />
        <div className="h-12 w-72 bg-impa-surface-3 rounded-xl impa-shimmer" />
        <div className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm space-y-4">
          <div className="flex gap-4">
            <div className="h-28 w-28 rounded-2xl bg-impa-surface-3 impa-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-44 bg-impa-surface-3 rounded impa-shimmer" />
              <div className="h-3 w-32 bg-impa-surface-2 rounded impa-shimmer" />
              <div className="h-3 w-52 bg-impa-surface-2 rounded impa-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboards/usuario/mis-mascotas")}
        className="cursor-pointer -ml-2"
      >
        <ArrowLeft size={16} />
        Volver a Mis Mascotas
      </Button>

      <PageHead
        icon={<Heart size={22} className="fill-impa-500" />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Acompañamiento post-adopción
          </>
        }
        title="Seguimiento de mis mascotas"
        subtitle="Registra los seguimientos solicitados por el IMPA. Cada evidencia que subes ayuda a confirmar el bienestar de tu compañero adoptado."
      />

      {mascotas.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={28} />}
          title="Aún no tienes mascotas adoptadas"
          description="Cuando completes tu primer proceso de adopción, aparecerá aquí el seguimiento de tu mascota."
          action={
            <Button variant="cta" onClick={() => router.push("/dashboards/usuario/mascotas")}>
              <PawPrint size={14} />
              Ver mascotas disponibles
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6">
          {mascotas.map((m: any) => (
            <SeguimientoMascotaCard
              key={m.id}
              mascota={m}
              onInfo={() => setInfoOpen(true)}
              onSubirSeguimiento={(s) => {
                setSeguimientoActual({
                  adopcionId: m.id,
                  fecha: s.fecha,
                  fechaFormateada: dayjs(s.fecha).format("DD/MM/YYYY"),
                });
                setSeguimientoOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ModalInfoSeguimiento open={infoOpen} onClose={() => setInfoOpen(false)} />

      {seguimientoActual && (
        <ModalSeguimiento
          open={seguimientoOpen}
          onClose={() => setSeguimientoOpen(false)}
          titulo="Registra el seguimiento de tu mascota"
        >
          <SeguimientoForm
            adopcionId={seguimientoActual.adopcionId}
            fechaProgramada={seguimientoActual.fecha}
            onSuccess={() => {
              setSeguimientoOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["seguimiento-mascotas"],
              });
            }}
          />
        </ModalSeguimiento>
      )}
    </div>
  );
}
