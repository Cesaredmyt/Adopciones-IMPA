"use client";

import React from "react";
import { StatCard } from "./StatCard";
import {
    ClipboardList,
    CalendarDays,
    Calendar,
    Users,
    PawPrint,
    Stethoscope,
} from "lucide-react";
import type { DashboardStats } from "../../types/dashboard";
import { useRouter } from "next/navigation";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
    const router = useRouter();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
                label="Documentos pendientes"
                value={stats.documentosPendientes}
                icon={<ClipboardList className="h-5 w-5" />}
                color="bg-amber-50 border-amber-200 text-amber-700"
                onClick={() => router.push("/dashboards/administrador/documentos")}
            />

            <StatCard
                label="Citas hoy"
                value={stats.citasHoy}
                icon={<CalendarDays className="h-5 w-5" />}
                color="bg-sky-50 border-sky-200 text-sky-700"
                onClick={() => router.push("/dashboards/administrador/gestion_citas")}
            />

            <StatCard
                label="Citas esta semana"
                value={stats.citasSemana}
                icon={<Calendar className="h-5 w-5" />}
                color="bg-indigo-50 border-indigo-200 text-indigo-700"
                onClick={() => router.push("/dashboards/administrador/gestion_citas")}
            />

            <StatCard
                label="Usuarios en revisión"
                value={stats.usuariosProceso}
                icon={<Users className="h-5 w-5" />}
                color="bg-violet-50 border-violet-200 text-violet-700"
                onClick={() => router.push("/dashboards/administrador/usuarios")}
            />

            <StatCard
                label="Mascotas adoptables"
                value={stats.mascotasAdoptables}
                icon={<PawPrint className="h-5 w-5" />}
                color="bg-impa-50 border-impa-200 text-impa-700"
                onClick={() => router.push("/dashboards/administrador/mascotas")}
            />

            <StatCard
                label="Esterilizaciones pendientes"
                value={stats.esterilizacionesPend}
                icon={<Stethoscope className="h-5 w-5" />}
                color="bg-rose-50 border-rose-200 text-rose-700"
                onClick={() => router.push("/dashboards/administrador/esterilizaciones")}
            />
        </div>
    );
}
