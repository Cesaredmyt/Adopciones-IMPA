"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHead from "@/components/layout/PageHead";
import { ButtonLink, Button } from "@/components/ui/Button";

import { Loader2, FileCheck2, CalendarDays, Users, Sparkles, LayoutDashboard, AlertCircle } from "lucide-react";

import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import { useDashboardRealtime } from "@/features/admin/hooks/useDashboardRealtime";
import { useActividadReciente } from "@/features/admin/hooks/useActividadReciente";
import { useActividadRealtime } from "@/features/admin/hooks/useActividadRealtime";

import { mapPendientes } from "@/features/admin/mappers/dashboard-mappers";
import { useUsuarioNombre } from "@/features/admin/hooks/useUsuarioNombre";

import { StatsGrid } from "@/features/admin/components/client/StatsGrid";
import { PendientesList } from "@/features/admin/components/client/PendientesList";
import { ActividadFilters } from "@/features/admin/components/client/ActivityFilters";
import { ActividadList } from "@/features/admin/components/client/ActivityList";
import { DashboardSkeleton } from "@/features/admin/components/client/DashboardSkeleton";

export default function AdminDashboard() {
  const router = useRouter();

  const [filtro, setFiltro] = useState<
    "todo" | "documento" | "cita" | "mascota" | "esterilizacion"
  >("todo");

  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  useDashboardRealtime();

  const { data: nombreUsuario, isLoading: loadingUsuario } = useUsuarioNombre();

  const pendientes = stats ? mapPendientes(stats) : [];

  const { data: actividad, isLoading: loadingAct } =
    useActividadReciente(filtro);

  useActividadRealtime(filtro);

  const isLoadingPage =
    loadingUsuario || loadingStats || loadingAct;

  if (isLoadingPage) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHead
        icon={<LayoutDashboard size={22} />}
        eyebrow={
          <>
            <Sparkles size={12} />
            Panel administrativo
          </>
        }
        title="Panel de gestión"
        subtitle={
          loadingUsuario ? (
            <div className="h-5 w-40 bg-impa-surface-3 animate-pulse rounded" />
          ) : nombreUsuario ? (
            <>
              Bienvenido,{" "}
              <span className="font-semibold text-impa-text">{nombreUsuario}</span>.
              Revisa los pendientes del día y la actividad reciente.
            </>
          ) : (
            "Bienvenido a tu panel. Revisa los pendientes del día y la actividad reciente."
          )
        }
        right={
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink
              href="/dashboards/administrador/documentos"
              variant="cta"
              size="md"
            >
              <FileCheck2 size={15} />
              Validar documentos
            </ButtonLink>
          </div>
        }
      />

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
        >
          <CalendarDays size={14} />
          Ver citas
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboards/administrador/usuarios")}
        >
          <Users size={14} />
          Usuarios
        </Button>
      </div>

      {/* Stats */}
      {loadingStats || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl border border-impa-line shadow-impa-sm relative overflow-hidden"
            >
              <span className="absolute inset-0 impa-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}

      {/* Pendientes */}
      <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />
        <header className="flex items-center justify-between gap-3 px-6 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-impa-50 border border-impa-100 text-impa-600">
              <AlertCircle size={16} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-impa-text-strong tracking-tight">
                Tareas pendientes
              </h2>
              <p className="text-xs text-impa-muted">
                Acciones que requieren tu atención.
              </p>
            </div>
          </div>
        </header>
        <div className="p-6">
          <PendientesList
            pendientes={pendientes}
            loading={loadingStats}
            onNavigate={(link) => router.push(link)}
          />
        </div>
      </section>

      {/* Actividad reciente */}
      <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/60 to-transparent" />
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-impa-text-strong tracking-tight">
              Actividad reciente
            </h2>
            <p className="text-xs text-impa-muted">
              Eventos y cambios recientes en la plataforma.
            </p>
          </div>

          <div className="w-full sm:w-auto overflow-x-auto custom-scroll">
            <ActividadFilters filtro={filtro} setFiltro={setFiltro} />
          </div>
        </header>

        <div className="p-6">
          {loadingAct ? (
            <div className="flex items-center gap-2 text-impa-muted text-sm">
              <Loader2 className="animate-spin h-4 w-4" />
              Cargando actividad...
            </div>
          ) : actividad && actividad.length > 0 ? (
            <ActividadList actividad={actividad} />
          ) : (
            <p className="text-sm text-impa-muted py-6 text-center">
              Sin actividad reciente
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
