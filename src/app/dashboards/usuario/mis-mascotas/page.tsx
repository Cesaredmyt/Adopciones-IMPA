"use client";

import { useState } from "react";
import { PawPrint, Heart, Sparkles } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import CertificadoModal from "@/components/certificados/CertificadoModal";

import { useMisMascotasQuery } from "@/features/mascotas/hooks/useMisMascotasQuery";
import MisMascotasCard from "@/features/mascotas/components/client/MisMascotasCard";
import PanelEstado from "@/features/adopciones/components/client/PanelEstado";

export default function MisMascotasPage() {
  const { data: mascotas, isLoading, error } = useMisMascotasQuery();

  const [certificadoAbierto, setCertificadoAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 w-44 bg-impa-surface-3 rounded-xl impa-shimmer" />
          <div className="h-12 w-72 bg-impa-surface-3 rounded-xl impa-shimmer" />
        </div>
        <div className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm">
          <div className="flex gap-4">
            <div className="h-48 w-48 rounded-xl bg-impa-surface-3 impa-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-44 bg-impa-surface-3 rounded impa-shimmer" />
              <div className="h-3 w-32 bg-impa-surface-2 rounded impa-shimmer" />
              <div className="h-3 w-52 bg-impa-surface-2 rounded impa-shimmer" />
              <div className="h-20 w-full bg-impa-surface-2 rounded-xl impa-shimmer mt-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PanelEstado
        tone="danger"
        icon={<Heart className="h-6 w-6 fill-white" />}
        title="No pudimos cargar tus mascotas"
        desc="Intenta recargar la página. Si el problema persiste, contacta al equipo IMPA."
      />
    );
  }

  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="space-y-6">
        <PageHead
          icon={<Heart size={22} className="fill-impa-500" />}
          eyebrow={
            <>
              <Sparkles size={12} />
              Tu familia IMPA
            </>
          }
          title="Mis mascotas adoptadas"
          subtitle="Aquí encontrarás todas las mascotas que has adoptado a través del IMPA."
        />

        <EmptyState
          icon={<PawPrint size={28} />}
          title="Aún no has adoptado ninguna mascota"
          description="Cuando completes un proceso de adopción, tu nuevo compañero aparecerá aquí con toda su información y certificado oficial."
          action={
            <ButtonLink href="/dashboards/usuario/adopcion" variant="cta">
              <Heart size={14} className="fill-white" />
              Iniciar mi adopción
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHead
        icon={<Heart size={22} className="fill-impa-500" />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Tu familia IMPA
          </>
        }
        title="Mis mascotas adoptadas"
        subtitle={`${mascotas.length} ${
          mascotas.length === 1 ? "compañero te acompaña" : "compañeros te acompañan"
        } gracias al programa IMPA.`}
      />

      <div className="grid gap-6">
        {mascotas.map((mascota: any) => (
          <MisMascotasCard
            key={mascota.id ?? mascota.adopcion_id}
            mascota={mascota}
            onVerCertificado={(m) => {
              setMascotaSeleccionada(m);
              setCertificadoAbierto(true);
            }}
          />
        ))}
      </div>

      <CertificadoModal
        open={certificadoAbierto}
        onClose={() => setCertificadoAbierto(false)}
        mascota={mascotaSeleccionada}
      />
    </div>
  );
}
