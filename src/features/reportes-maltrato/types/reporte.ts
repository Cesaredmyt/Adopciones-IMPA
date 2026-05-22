export type EstadoReporte =
  | "recibido"
  | "en_revision"
  | "en_investigacion"
  | "resuelto"
  | "cerrado"
  | "falso_positivo";

export const ESTADOS_REPORTE: EstadoReporte[] = [
  "recibido",
  "en_revision",
  "en_investigacion",
  "resuelto",
  "cerrado",
  "falso_positivo",
];

export type GravedadReporte = "baja" | "media" | "alta" | "critica";
export const GRAVEDADES_REPORTE: GravedadReporte[] = [
  "baja",
  "media",
  "alta",
  "critica",
];

export type PrioridadReporte = "baja" | "normal" | "alta" | "urgente";
export const PRIORIDADES_REPORTE: PrioridadReporte[] = [
  "baja",
  "normal",
  "alta",
  "urgente",
];

export interface Reporte {
  id: string;
  folio: string;

  reportante_id: string | null;
  nombre_reportante: string | null;
  telefono_contacto: string | null;
  email_contacto: string | null;
  es_anonimo: boolean;

  asunto: string;
  descripcion: string;
  direccion_incidente: string;
  colonia: string;
  fecha_incidente: string | null;
  gravedad: GravedadReporte;

  evidencias_urls: string[];

  prioridad: PrioridadReporte;
  asignado_a: string | null;
  notas_internas: string | null;
  resolucion: string | null;

  estado: EstadoReporte;

  created_at: string;
  updated_at: string;
  actualizado_por: string | null;
}

export interface ReporteAdminRow extends Reporte {
  asignado_nombre: string | null;
}

export interface ReporteBitacoraEntry {
  id: string;
  reporte_id: string;
  autor_id: string | null;
  autor_nombre: string | null;
  accion: string;
  descripcion: string | null;
  estado_anterior: EstadoReporte | null;
  estado_nuevo: EstadoReporte | null;
  created_at: string;
}

export interface ReportesPaginadosResult<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}
