import type {
  EstadoReporte,
  GravedadReporte,
  PrioridadReporte,
} from "../types/reporte";

const LABELS_ESTADO: Record<EstadoReporte, string> = {
  recibido: "Recibido",
  en_revision: "En revisión",
  en_investigacion: "En investigación",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
  falso_positivo: "Falso positivo",
};

const STYLES_ESTADO: Record<EstadoReporte, string> = {
  recibido: "bg-yellow-100 text-yellow-700 border-yellow-200",
  en_revision: "bg-blue-100 text-blue-700 border-blue-200",
  en_investigacion: "bg-indigo-100 text-indigo-700 border-indigo-200",
  resuelto: "bg-green-100 text-green-700 border-green-200",
  cerrado: "bg-slate-100 text-slate-600 border-slate-200",
  falso_positivo: "bg-red-100 text-red-700 border-red-200",
};

const LABELS_GRAVEDAD: Record<GravedadReporte, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

const STYLES_GRAVEDAD: Record<GravedadReporte, string> = {
  baja: "bg-impa-50 text-impa-700 border-impa-200",
  media: "bg-yellow-50 text-yellow-700 border-yellow-200",
  alta: "bg-orange-50 text-orange-700 border-orange-200",
  critica: "bg-red-50 text-red-700 border-red-200",
};

const LABELS_PRIORIDAD: Record<PrioridadReporte, string> = {
  baja: "Baja",
  normal: "Normal",
  alta: "Alta",
  urgente: "Urgente",
};

const STYLES_PRIORIDAD: Record<PrioridadReporte, string> = {
  baja: "bg-slate-50 text-slate-600 border-slate-200",
  normal: "bg-impa-50 text-impa-700 border-impa-200",
  alta: "bg-orange-50 text-orange-700 border-orange-200",
  urgente: "bg-red-50 text-red-700 border-red-200",
};

export const labelEstadoReporte = (e: EstadoReporte) => LABELS_ESTADO[e] ?? e;
export const styleEstadoReporte = (e: EstadoReporte) =>
  STYLES_ESTADO[e] ?? "bg-slate-100 text-slate-700 border-slate-200";

export const labelGravedadReporte = (g: GravedadReporte) =>
  LABELS_GRAVEDAD[g] ?? g;
export const styleGravedadReporte = (g: GravedadReporte) =>
  STYLES_GRAVEDAD[g] ?? "bg-slate-50 text-slate-700 border-slate-200";

export const labelPrioridadReporte = (p: PrioridadReporte) =>
  LABELS_PRIORIDAD[p] ?? p;
export const stylePrioridadReporte = (p: PrioridadReporte) =>
  STYLES_PRIORIDAD[p] ?? "bg-slate-50 text-slate-700 border-slate-200";

export const PRIORIDAD_ESTADO_REPORTE: Record<EstadoReporte, number> = {
  recibido: 1,
  en_revision: 2,
  en_investigacion: 3,
  resuelto: 4,
  cerrado: 5,
  falso_positivo: 6,
};
