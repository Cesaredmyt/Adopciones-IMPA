export type EstadoPlatica =
  | "pendiente"
  | "en_revision"
  | "aprobada"
  | "rechazada"
  | "finalizada"
  | "cancelada";

export const ESTADOS_PLATICA: EstadoPlatica[] = [
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "finalizada",
  "cancelada",
];

export type TipoLugarPlatica =
  | "escuela"
  | "empresa"
  | "colonia"
  | "dependencia"
  | "asociacion"
  | "otro";

export const TIPOS_LUGAR_PLATICA: TipoLugarPlatica[] = [
  "escuela",
  "empresa",
  "colonia",
  "dependencia",
  "asociacion",
  "otro",
];

export interface Platica {
  id: string;
  folio: string;

  usuario_id: string;
  admin_responsable: string | null;

  nombre_solicitante: string;
  telefono_contacto: string;

  tipo_lugar: TipoLugarPlatica;
  nombre_lugar: string | null;
  numero_personas: number;
  direccion: string;
  fecha_tentativa: string;        // ISO date (YYYY-MM-DD)
  fecha_definitiva: string | null; // ISO timestamptz
  comentarios: string | null;

  observaciones_internas: string | null;
  motivo_rechazo: string | null;

  estado: EstadoPlatica;

  created_at: string;
  updated_at: string;
  actualizado_por: string | null;
}

export interface PlaticaAdminRow extends Platica {
  usuario_nombre: string;
  usuario_correo: string;
}

export type PlaticaUsuarioRow = Platica;

export interface PlaticasPaginadasResult<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}
