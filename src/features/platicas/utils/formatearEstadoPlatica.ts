import type { EstadoPlatica, TipoLugarPlatica } from "../types/platica";

const LABELS: Record<EstadoPlatica, string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const STYLES: Record<EstadoPlatica, string> = {
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  en_revision: "bg-blue-100 text-blue-700 border-blue-200",
  aprobada: "bg-impa-100 text-impa-800 border-impa-200",
  rechazada: "bg-red-100 text-red-700 border-red-200",
  finalizada: "bg-green-100 text-green-700 border-green-200",
  cancelada: "bg-slate-100 text-slate-600 border-slate-200",
};

const LABELS_TIPO: Record<TipoLugarPlatica, string> = {
  escuela: "Escuela",
  empresa: "Empresa",
  colonia: "Colonia / Comunidad",
  dependencia: "Dependencia pública",
  asociacion: "Asociación / ONG",
  otro: "Otro",
};

export function labelEstadoPlatica(estado: EstadoPlatica) {
  return LABELS[estado] ?? estado;
}

export function styleEstadoPlatica(estado: EstadoPlatica) {
  return STYLES[estado] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

export function labelTipoLugarPlatica(tipo: TipoLugarPlatica) {
  return LABELS_TIPO[tipo] ?? tipo;
}

export const PRIORIDAD_ESTADO_PLATICA: Record<EstadoPlatica, number> = {
  pendiente: 1,
  en_revision: 2,
  aprobada: 3,
  finalizada: 4,
  rechazada: 5,
  cancelada: 6,
};
