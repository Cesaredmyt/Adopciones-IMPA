export interface DashboardStats {
    documentosPendientes: number;
    citasHoy: number;
    citasSemana: number;
    usuariosProceso: number;
    mascotasTotal: number;
    citasAdopPend: number;
    citasVetPend: number;
    esterilizacionesPend: number;
    platicasPend: number;
    reportesPend: number;
}

export interface DashboardPendiente {
    id: number;
    descripcion: string;
    link: string;
}

export type ActividadTipo = "documento" | "cita" | "mascota" | "esterilizacion";

export interface ActividadItemType {
    tipo: ActividadTipo;
    mensaje: string;
    fecha: string; 
}

export interface DashboardStatsQuery {
    data: DashboardStats | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
}
