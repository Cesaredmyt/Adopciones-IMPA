import type { EstadoEsterilizacion } from "../types/esterilizacion";

const LABELS: Record<EstadoEsterilizacion, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  programada: "Programada",
  en_quirofano: "En quirófano",
  completada: "Completada",
  complicacion: "Complicación",
  cancelada: "Cancelada",
  rechazada: "Rechazada",
};

const STYLES: Record<EstadoEsterilizacion, string> = {
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  aprobada: "bg-amber-100 text-amber-800 border-amber-200",
  programada: "bg-blue-100 text-blue-700 border-blue-200",
  en_quirofano: "bg-indigo-100 text-indigo-700 border-indigo-200",
  completada: "bg-green-100 text-green-700 border-green-200",
  complicacion: "bg-orange-100 text-orange-700 border-orange-200",
  cancelada: "bg-slate-100 text-slate-600 border-slate-200",
  rechazada: "bg-red-100 text-red-700 border-red-200",
};

export function labelEstadoEsterilizacion(estado: EstadoEsterilizacion) {
  return LABELS[estado] ?? estado;
}

export function styleEstadoEsterilizacion(estado: EstadoEsterilizacion) {
  return STYLES[estado] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

export const PRIORIDAD_ESTADO_ESTERILIZACION: Record<
  EstadoEsterilizacion,
  number
> = {
  pendiente: 1,
  aprobada: 2,
  programada: 3,
  en_quirofano: 4,
  completada: 5,
  complicacion: 6,
  cancelada: 7,
  rechazada: 8,
};
