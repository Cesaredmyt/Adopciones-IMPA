"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, AlertCircle } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { showSoftToast } from "@/lib/showSoftToast";
import PanelEstado from "@/features/adopciones/components/client/PanelEstado";

import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";
import DocumentosSection from "@/features/adopciones/components/client/DocumentosSection";
import AdopcionAprobadaSection from "@/features/adopciones/components/client/AdopcionAprobadaSection";

import { useProcesoAdopcionQuery } from "@/features/adopciones/hooks/useProcesoAdopcionQuery";
import { useDocumentosParaAdopcionQuery } from "@/features/adopciones/hooks/useDocumentosParaAdopcionQuery";
import { useSubirDocumentoAdopcionMutation } from "@/features/adopciones/hooks/useSubirDocumentoAdopcionMutation";
import { useCancelarSolicitudAdopcionMutation } from "@/features/adopciones/hooks/useCancelarSolicitudAdopcionMutation";

import { mapCitaToCitaProgramadaUI } from "@/features/adopciones/mappers/mapCitaAdopcionToProgramadaUI";

import { useQueryClient } from "@tanstack/react-query";

export default function ProcesoAdopcionPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  /* -------------------- Estado local -------------------- */
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);

  const [archivos, setArchivos] = useState<Record<string, File | undefined>>({
    identificacion: undefined,
    comprobante: undefined,
    curp: undefined,
  });

  /* -------------------- Queries -------------------- */
  const { data, isLoading, isError, error } = useProcesoAdopcionQuery();

  const {
    data: documentosData,
    isLoading: isLoadingDocs,
    isError: isDocsError,
  } = useDocumentosParaAdopcionQuery();

  /* -------------------- Mutations -------------------- */
  const subirDocumentoMutation = useSubirDocumentoAdopcionMutation();
  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();

  /* -------------------- Datos derivados -------------------- */
  const docs = documentosData?.documentos ?? [];
  const estado = documentosData?.estado ?? "sin_documentos";

  const solicitudActiva = data?.solicitudActiva ?? null;
  const citaActiva = data?.citaActiva ?? null;
  const adopcionEstado = data?.adopcionEstado ?? null;

  const citaProgramadaUI = citaActiva
    ? mapCitaToCitaProgramadaUI(citaActiva)
    : null;

  /* -------------------- Handlers -------------------- */
  const handlePickDocumento = (id: string, file?: File) => {
    setArchivos((prev) => ({ ...prev, [id]: file }));
  };

  const enviar = async () => {
    const tipos = Object.keys(archivos) as Array<keyof typeof archivos>;

    await Promise.all(
      tipos
        .filter((tipo) => archivos[tipo])
        .map((tipo) =>
          subirDocumentoMutation.mutateAsync({
            tipo,
            file: archivos[tipo]!,
          })
        )
    );

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["documentos-adopcion"] }),
      queryClient.invalidateQueries({ queryKey: ["proceso-adopcion"] }),
    ]);

    showSoftToast("Documentos enviados correctamente");
  };

  const handleConfirmCancelar = async () => {
    if (!solicitudActiva?.id) return;

    await cancelarSolicitudMutation.mutateAsync(solicitudActiva.id);

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["proceso-adopcion"] }),
      queryClient.invalidateQueries({ queryKey: ["documentos-adopcion"] }),
    ]);

    showSoftToast("Solicitud cancelada correctamente");
    setShowCancelSolicitudModal(false);
  };

  const deshabilitarEnviar =
    subirDocumentoMutation.isPending ||
    (estado === "sin_documentos"
      ? !Object.values(archivos).every(Boolean)
      : docs
          .filter((d) => d.estado === "rechazado")
          .some((d) => !archivos[d.tipo]));

  /* -------------------- Estados de carga / error -------------------- */
  if (isLoading || isLoadingDocs) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-72 bg-impa-surface-3 rounded-xl impa-shimmer" />
        <div className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm space-y-3">
          <div className="h-4 w-44 bg-impa-surface-3 rounded impa-shimmer" />
          <div className="h-3 w-full bg-impa-surface-2 rounded impa-shimmer" />
          <div className="h-3 w-5/6 bg-impa-surface-2 rounded impa-shimmer" />
          <div className="h-24 w-full bg-impa-surface-2 rounded-xl impa-shimmer mt-2" />
        </div>
      </div>
    );
  }

  if (isDocsError) {
    return (
      <PanelEstado
        tone="danger"
        icon={<AlertCircle className="h-6 w-6" />}
        title="Error al cargar documentos"
        desc="Intenta recargar la página. Si el problema persiste, contacta a un coordinador IMPA."
      />
    );
  }

  if (isError) {
    return (
      <PanelEstado
        tone="danger"
        icon={<AlertCircle className="h-6 w-6" />}
        title="Error al cargar tu proceso de adopción"
        desc={error.message}
      />
    );
  }

  /* -------------------- Subtitle dinámico -------------------- */
  const subtitle =
    estado === "aprobado"
      ? "¡Listo! Tus documentos están validados. Continúa con tu proceso seleccionando una mascota."
      : estado === "en_revision"
      ? "Tus documentos están siendo revisados por el equipo IMPA."
      : estado === "rechazado"
      ? "Algunos documentos requieren corrección. Revísalos y vuelve a enviarlos."
      : "Sube tus documentos para que un administrador IMPA los valide antes de continuar.";

  /* -------------------- Render -------------------- */
  return (
    <>
      <div className="space-y-7">
        <PageHead
          icon={<Heart size={22} className="fill-impa-500" />}
          eyebrow={
            <>
              <Sparkles size={12} />
              Tu camino hacia la adopción
            </>
          }
          title="Proceso de adopción"
          subtitle={subtitle}
        />

        <DocumentosSection
          estado={estado}
          documentos={docs}
          archivos={archivos}
          onPick={handlePickDocumento}
          onEnviar={enviar}
          deshabilitarEnviar={deshabilitarEnviar}
        />

        <AdopcionAprobadaSection
          estado={estado}
          solicitudActiva={solicitudActiva}
          citaActiva={citaActiva}
          citaProgramadaUI={citaProgramadaUI}
          adopcionEstado={adopcionEstado}
          onVerCita={() => router.push("/dashboards/usuario/citas")}
          onVerMascotas={() => router.push("/dashboards/usuario/mascotas")}
          onIrFormulario={(id) =>
            router.push(`/dashboards/usuario/form-adopcion/${id}`)
          }
          onCancelarSolicitud={() => setShowCancelSolicitudModal(true)}
        />
      </div>

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={handleConfirmCancelar}
      />
    </>
  );
}
