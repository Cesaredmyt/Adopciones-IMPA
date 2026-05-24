"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  FileCheck2,
  CalendarDays,
  Users,
  Sparkles,
  AlertCircle,
  Activity,
  ArrowRight,
  PawPrint,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

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

  // Hora del día
  const hour = new Date().getHours();
  const saludo =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="space-y-7">
      {/* ============ WELCOME HERO ============ */}
      <section className="relative overflow-hidden rounded-3xl border border-impa-line bg-gradient-to-br from-impa-700 via-impa-600 to-impa-500 text-white shadow-impa-lg p-6 sm:p-8">
        {/* Decorative mesh */}
        <div aria-hidden className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_42%,rgba(7,18,10,0.18)_100%)]" />
        </div>

        {/* Grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-[10px] font-bold uppercase tracking-[0.1em]">
              <Sparkles size={11} />
              {saludo}
            </span>

            <h1 className="mt-4 text-3xl sm:text-[36px] font-bold tracking-tight leading-[1.1]">
              Hola
              {nombreUsuario ? (
                <>
                  ,{" "}
                  <span className="bg-gradient-to-r from-white to-impa-100 bg-clip-text text-transparent">
                    {nombreUsuario}
                  </span>
                </>
              ) : null}
              .
            </h1>
            <p className="mt-2 text-white/85 text-sm sm:text-base max-w-xl leading-relaxed">
              Este es tu panel administrativo. Revisa pendientes, gestiona
              adopciones y mantén el ritmo del programa IMPA.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/dashboards/administrador/documentos"
                className="group/cta inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white !text-impa-text-strong font-semibold text-sm shadow-impa-md hover:shadow-impa-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-impa-out cursor-pointer [&>svg]:text-impa-600"
              >
                <FileCheck2 size={15} />
                <span className="text-impa-text-strong">Validar documentos</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboards/administrador/gestion_citas"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-sm border border-white/25 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                <CalendarDays size={15} />
                Ver citas
              </Link>
              <Link
                href="/dashboards/administrador/usuarios"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-sm border border-white/25 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                <Users size={15} />
                Usuarios
              </Link>
            </div>
          </div>

          {/* Quick stats inline */}
          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              icon={<PawPrint size={16} />}
              label="Mascotas"
              value={stats?.mascotasTotal ?? 0}
            />
            <MiniStat
              icon={<CalendarDays size={16} />}
              label="Citas hoy"
              value={stats?.citasHoy ?? 0}
            />
            <MiniStat
              icon={<FileCheck2 size={16} />}
              label="Documentos"
              value={stats?.documentosPendientes ?? 0}
            />
            <MiniStat
              icon={<Stethoscope size={16} />}
              label="Esteriliz."
              value={stats?.esterilizacionesPend ?? 0}
            />
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-impa-text-strong tracking-tight">
              Métricas clave
            </h2>
            <p className="text-xs text-impa-muted mt-0.5">
              Resumen en tiempo real del estado de la plataforma.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-impa-700 bg-impa-50 border border-impa-200 px-2.5 py-1 rounded-full">
            <TrendingUp size={11} />
            En vivo
          </span>
        </div>

        {loadingStats || !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl border border-impa-line shadow-impa-sm relative overflow-hidden"
              >
                <span className="absolute inset-0 impa-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <StatsGrid stats={stats} />
        )}
      </section>

      {/* ============ GRID 2 columns ============ */}
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
        {/* Pendientes */}
        <SectionCard
          title="Tareas pendientes"
          description="Acciones que requieren tu atención."
          icon={<AlertCircle size={16} />}
          accent="amber"
        >
          <PendientesList
            pendientes={pendientes}
            loading={loadingStats}
            onNavigate={(link) => router.push(link)}
          />
        </SectionCard>

        {/* Quick actions */}
        <SectionCard
          title="Accesos rápidos"
          description="Atajos a los procesos más comunes."
          icon={<Sparkles size={16} />}
          accent="impa"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <QuickAction
              href="/dashboards/administrador/mascotas"
              icon={<PawPrint size={16} />}
              label="Registrar mascota"
              hint="Alta de nuevos ejemplares"
            />
            <QuickAction
              href="/dashboards/administrador/gestion_adopciones"
              icon={<FileCheck2 size={16} />}
              label="Aprobar adopciones"
              hint="Revisar solicitudes"
            />
            <QuickAction
              href="/dashboards/administrador/citas-veterinarias"
              icon={<Stethoscope size={16} />}
              label="Citas veterinarias"
              hint="Agenda médica"
            />
            <QuickAction
              href="/dashboards/administrador/usuarios"
              icon={<Users size={16} />}
              label="Usuarios"
              hint="Gestión de cuentas"
            />
          </div>
        </SectionCard>
      </div>

      {/* ============ Actividad reciente ============ */}
      <SectionCard
        title="Actividad reciente"
        description="Eventos y cambios recientes en la plataforma."
        icon={<Activity size={16} />}
        accent="sky"
        right={<ActividadFilters filtro={filtro} setFiltro={setFiltro} />}
      >
        {loadingAct ? (
          <div className="flex items-center gap-2 text-impa-muted text-sm py-3">
            <Loader2 className="animate-spin h-4 w-4" />
            Cargando actividad…
          </div>
        ) : actividad && actividad.length > 0 ? (
          <ActividadList actividad={actividad} />
        ) : (
          <div className="text-center py-10">
            <span className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-impa-50 border border-impa-100 text-impa-600 mb-3">
              <Activity size={20} />
            </span>
            <p className="text-sm font-semibold text-impa-text">Sin actividad reciente</p>
            <p className="text-xs text-impa-muted mt-1">
              Las nuevas acciones aparecerán aquí.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ===================== Sub-componentes ===================== */

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-3 hover:bg-white/15 transition-colors duration-200 cursor-default">
      <div className="flex items-center gap-2">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-white/15 text-white">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
            {label}
          </p>
          <p className="text-lg font-bold text-white leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

const accentClasses: Record<
  string,
  { bg: string; ring: string; text: string }
> = {
  amber:  { bg: "bg-impa-warning-soft", ring: "border-amber-200", text: "text-impa-warning-ink" },
  sky:    { bg: "bg-impa-info-soft",    ring: "border-sky-200",   text: "text-impa-info-ink" },
  impa:   { bg: "bg-impa-50",           ring: "border-impa-200",  text: "text-impa-700" },
  accent: { bg: "bg-impa-accent-soft",  ring: "border-impa-accent", text: "text-impa-accent-ink" },
};

function SectionCard({
  title,
  description,
  icon,
  accent = "impa",
  right,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: keyof typeof accentClasses;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const c = accentClasses[accent];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-impa-line bg-white shadow-impa-sm">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-b border-impa-line bg-gradient-to-b from-impa-surface-2/80 to-impa-surface-2/30">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span
              className={`grid place-items-center w-9 h-9 rounded-xl border ${c.bg} ${c.ring} ${c.text}`}
            >
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-[15px] sm:text-base font-bold text-impa-text-strong tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-[11px] sm:text-xs text-impa-muted leading-tight">
                {description}
              </p>
            )}
          </div>
        </div>
        {right && <div className="w-full sm:w-auto overflow-x-auto custom-scroll">{right}</div>}
      </header>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function QuickAction({
  href,
  icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden flex items-center gap-3 rounded-xl border border-impa-line bg-white p-3 shadow-impa-xs cursor-pointer transition-[box-shadow,transform,border-color] duration-200 ease-impa-out hover:shadow-impa-md hover:-translate-y-0.5 hover:border-impa-300"
    >
      <span className="grid place-items-center w-10 h-10 rounded-lg bg-impa-50 border border-impa-100 text-impa-600 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-impa-text leading-tight">{label}</p>
        <p className="text-[11px] text-impa-muted leading-tight">{hint}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-impa-muted opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
      />
    </Link>
  );
}
