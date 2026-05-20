export type EstadoEsterilizacion =
  | "pendiente"
  | "aprobada"
  | "programada"
  | "en_quirofano"
  | "completada"
  | "complicacion"
  | "cancelada"
  | "rechazada";

export const ESTADOS_ESTERILIZACION: EstadoEsterilizacion[] = [
  "pendiente",
  "aprobada",
  "programada",
  "en_quirofano",
  "completada",
  "complicacion",
  "cancelada",
  "rechazada",
];

export interface Esterilizacion {
  id: string;
  folio: string;

  mascota_id: string;
  usuario_id: string | null;
  admin_responsable: string | null;

  peso_kg: number | null;
  observaciones_previas: string | null;

  fecha_solicitud: string;
  fecha_programada: string | null;
  fecha_realizada: string | null;

  resultado_notas: string | null;
  complicaciones: string | null;
  motivo_cancelacion: string | null;

  estado: EstadoEsterilizacion;

  created_at: string;
  updated_at: string;
  actualizado_por: string | null;
}

export interface EsterilizacionAdminRow extends Esterilizacion {
  mascota_nombre: string;
  mascota_imagen: string | null;
  usuario_nombre: string;
  usuario_correo: string;
}

export interface EsterilizacionUsuarioRow extends Esterilizacion {
  mascota_nombre: string;
  mascota_imagen: string | null;
}

export interface EsterilizacionesPaginadasResult<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

export interface MascotaEsterilizable {
  adopcion_id: string;
  mascota_id: string;
  mascota_nombre: string;
  mascota_imagen: string | null;
  mascota_esterilizada: boolean;
}
