"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHead from "@/components/layout/PageHead";

import { Loader2 } from "lucide-react";

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
        title="Panel de gestión"
        subtitle={
          loadingUsuario ? (
            <div className="h-5 w-40 bg-impa-100 animate-pulse rounded" />
          ) : nombreUsuario ? (
            <>
              Bienvenido,{" "}
              <span className="font-semibold text-impa-700">{nombreUsuario}</span>.
              Revisa los pendientes del día.
            </>
          ) : (
            "Bienvenido a tu panel. Revisa los pendientes del día."
          )
        }

      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => router.push("/dashboards/administrador/documentos")}
          className="inline-flex items-center h-9 px-4 rounded-xl bg-impa-500 text-white text-sm font-semibold shadow-impa-sm hover:bg-impa-600 transition"
        >
          Validar documentos
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
          className="inline-flex items-center h-9 px-4 rounded-xl bg-white text-impa-text border border-impa-line text-sm font-semibold hover:bg-impa-50 hover:border-impa-300 transition"
        >
          Ver citas
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/usuarios")}
          className="inline-flex items-center h-9 px-4 rounded-xl bg-white text-impa-text border border-impa-line text-sm font-semibold hover:bg-impa-50 hover:border-impa-300 transition"
        >
          Usuarios
        </button>
      </div>

      {loadingStats || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-impa-50 rounded-2xl animate-pulse border border-impa-line"
            />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}

      <section className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm">
        <h2 className="text-lg font-bold text-impa-text mb-4 tracking-tight">
          Tareas pendientes
        </h2>

        <PendientesList
          pendientes={pendientes}
          loading={loadingStats}
          onNavigate={(link) => router.push(link)}
        />
      </section>

      <section className="rounded-2xl border border-impa-line bg-white p-6 shadow-impa-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-impa-text tracking-tight">
            Actividad reciente
          </h2>

          <div className="w-full sm:w-auto overflow-x-auto">
            <ActividadFilters filtro={filtro} setFiltro={setFiltro} />
          </div>
        </div>

        {loadingAct ? (
          <div className="flex items-center gap-2 text-impa-muted">
            <Loader2 className="animate-spin h-4 w-4" />
            Cargando actividad...
          </div>
        ) : actividad && actividad.length > 0 ? (
          <ActividadList actividad={actividad} />
        ) : (
          <p className="text-sm text-impa-muted">Sin actividad reciente</p>
        )}
      </section>
    </div>
  );
}
