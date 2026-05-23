"use client";

import React, { useState } from "react";
import { CalendarHeart, Sparkles, AlertCircle } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { EmptyState } from "@/components/ui/EmptyState";
import PanelEstado from "@/features/adopciones/components/client/PanelEstado";
import ConfirmCancelModal from "@/features/adopciones/components/client/ConfirmCancelModal";
import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";

import { useMisCitasQuery } from "@/features/citas/hooks/useMisCitasQuery";
import { useCancelarCitaMutation } from "@/features/citas/hooks/useCancelarCitaMutation";
import { useCancelarSolicitudAdopcionMutation } from "@/features/citas/hooks/useCancelarSolicitudAdopcionMutation";
import { useConfirmarCitaMutation } from "@/features/citas/hooks/useConfirmarCitaMutation";
import { useHorasOcupadasQuery } from "@/features/citas/hooks/useHorasOcupadasQuery";
import { useDiasRestantesSolicitud } from "@/features/citas/hooks/useDiasRestantesSolicitud";

import FormularioAgendarCita from "@/features/citas/components/client/FormularioAgendarCita";
import CitaProgramadaCard from "@/features/citas/components/client/CitaProgramadaCard";
import ConfirmacionCita from "@/features/citas/components/client/ConfirmacionCita";

import EstadoRevisionSolicitud from "@/features/citas/components/client/EstadoRevisionSolicitud";
import EstadoAdopcionAprobada from "@/features/citas/components/client/EstadoAdopcionAprobada";
import EstadoAdopcionRechazada from "@/features/citas/components/client/EstadoAdopcionRechazada";
import EstadoSolicitudEnProceso from "@/features/citas/components/client/EstadoSolicitudEnProceso";
import EstadoSolicitudPendiente from "@/features/citas/components/client/EstadoSolicitudPendiente";

import { useSoftToast } from "@/hooks/useSoftToast";
import { horaEsPasada } from "@/features/citas/utils/horaEsPasada";

export default function MisCitasPage() {
  /* -------------------- Queries -------------------- */
  const { data, isLoading, isError } = useMisCitasQuery();

  const solicitudActiva = data?.solicitudActiva ?? null;
  const adopcionEstado = data?.adopcionEstado ?? null;
  const perfil = data?.perfil ?? null;
  const citaProgramada = data?.citaProgramada ?? null;

  /* -------------------- Mutations -------------------- */
  const confirmarCitaMutation = useConfirmarCitaMutation();
  const cancelarCitaMutation = useCancelarCitaMutation();
  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();

  /* -------------------- UI State -------------------- */
  const { show } = useSoftToast();

  const [paso, setPaso] = useState<"inicio" | "formulario" | "confirmacion">(
    "inicio"
  );

  const [fecha, setFecha] = useState("");
  const [fechaDate, setFechaDate] = useState<Date | undefined>();
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [citaAEliminar, setCitaAEliminar] = useState<string | null>(null);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<string | null>(
    null
  );

  const { data: horasOcupadas = [] } = useHorasOcupadasQuery(fecha);

  const diasRestantes = useDiasRestantesSolicitud(solicitudActiva?.created_at);

  /* -------------------- Handlers -------------------- */
  async function confirmarCita() {
    if (!fecha || !horaSeleccionada || !solicitudActiva || !perfil) {
      show("Selecciona fecha y hora");
      return;
    }

    await confirmarCitaMutation.mutateAsync({
      usuarioId: perfil.id,
      solicitudId: solicitudActiva.id,
      mascotaId: solicitudActiva.mascota?.id ?? null,
      fecha,
      hora: horaSeleccionada,
    });

    setPaso("confirmacion");
  }

  async function cancelarCita(citaId: string) {
    if (!solicitudActiva) return;

    await cancelarCitaMutation.mutateAsync({
      citaId,
      solicitudId: solicitudActiva.id,
    });
  }

  async function cancelarSolicitud(id: string) {
    await cancelarSolicitudMutation.mutateAsync(id);
    show("Solicitud cancelada correctamente 🐾");
  }

  function handleFinalizar() {
    setPaso("inicio");
  }

  /* -------------------- States -------------------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-44 bg-impa-surface-3 rounded-xl impa-shimmer" />
        <div className="h-12 w-80 bg-impa-surface-3 rounded-xl impa-shimmer" />
        <div className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm space-y-3">
          <div className="h-4 w-44 bg-impa-surface-3 rounded impa-shimmer" />
          <div className="h-3 w-full bg-impa-surface-2 rounded impa-shimmer" />
          <div className="h-3 w-5/6 bg-impa-surface-2 rounded impa-shimmer" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <PanelEstado
        tone="danger"
        icon={<AlertCircle className="h-6 w-6" />}
        title="No pudimos cargar tus citas"
        desc="Intenta recargar la página. Si el problema persiste, contacta al equipo IMPA."
      />
    );
  }

  const subtitle =
    citaProgramada
      ? "Tienes una cita programada. Revisa los detalles abajo o reprograma si lo necesitas."
      : solicitudActiva
      ? "Tu solicitud está activa. Continúa con tu proceso de adopción."
      : "Consulta o agenda tu cita para conocer a tu futura mascota.";

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-7">
      <PageHead
        icon={<CalendarHeart size={22} />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Citas de adopción
          </>
        }
        title="Mis citas"
        subtitle={subtitle}
      />

      {/* PASO 1 */}
      {paso === "inicio" && (
        <>
          {citaProgramada ? (
            <CitaProgramadaCard
              cita={citaProgramada}
              onCancelar={(id) => setCitaAEliminar(id)}
              onAbrirModal={() => setShowCancelModal(true)}
            />
          ) : solicitudActiva && adopcionEstado === "pendiente" ? (
            <EstadoRevisionSolicitud />
          ) : solicitudActiva && adopcionEstado === "aprobada" ? (
            <EstadoAdopcionAprobada />
          ) : solicitudActiva && adopcionEstado === "rechazada" ? (
            <EstadoAdopcionRechazada />
          ) : solicitudActiva ? (
            solicitudActiva.estado === "en_proceso" ? (
              <EstadoSolicitudEnProceso
                solicitudId={solicitudActiva.id}
                loading={loadingForm}
                onIrFormulario={() => {
                  setLoadingForm(true);
                  window.location.href = `/dashboards/usuario/form-adopcion/${solicitudActiva.id}`;
                }}
              />
            ) : (
              <EstadoSolicitudPendiente
                mascota={solicitudActiva.mascota}
                diasRestantes={diasRestantes}
                onAgendar={() => setPaso("formulario")}
                onCancelar={() => {
                  setSolicitudAEliminar(solicitudActiva.id);
                  setShowCancelSolicitudModal(true);
                }}
              />
            )
          ) : (
            <EmptyState
              icon={<CalendarHeart size={28} />}
              title="No tienes citas ni solicitudes activas"
              description="Cuando elijas una mascota e inicies tu proceso de adopción, podrás agendar tu cita desde aquí."
            />
          )}
        </>
      )}

      {/* PASO 2 */}
      {paso === "formulario" && solicitudActiva && (
        <FormularioAgendarCita
          solicitudActiva={solicitudActiva}
          fecha={fecha}
          fechaDate={fechaDate}
          horaSeleccionada={horaSeleccionada}
          horasOcupadas={horasOcupadas}
          setFecha={setFecha}
          setFechaDate={setFechaDate}
          setHoraSeleccionada={setHoraSeleccionada}
          confirmarCita={confirmarCita}
          setPaso={setPaso}
          horaEsPasada={horaEsPasada}
          confirmarCitaMutation={confirmarCitaMutation}
          showSoftToast={show}
        />
      )}

      {/* PASO 3 */}
      {paso === "confirmacion" && citaProgramada && (
        <ConfirmacionCita cita={citaProgramada} onFinalizar={handleFinalizar} />
      )}

      {/* Modales */}
      <ConfirmCancelModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => citaAEliminar && cancelarCita(citaAEliminar)}
      />

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={() =>
          solicitudAEliminar && cancelarSolicitud(solicitudAEliminar)
        }
      />
    </div>
  );
}
