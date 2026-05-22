"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  SolicitarPlaticaSchema,
  AgendarPlaticaSchema,
  RechazarPlaticaSchema,
  CancelarPlaticaSchema,
} from "../schemas/platicas-schemas";
import type {
  Platica,
  PlaticaAdminRow,
  PlaticaUsuarioRow,
  PlaticasPaginadasResult,
  EstadoPlatica,
  TipoLugarPlatica,
} from "../types/platica";

const PAGE_SIZE = 10;

const BASE_SELECT = `
  id,
  folio,
  usuario_id,
  admin_responsable,
  nombre_solicitante,
  telefono_contacto,
  tipo_lugar,
  nombre_lugar,
  numero_personas,
  direccion,
  fecha_tentativa,
  fecha_definitiva,
  comentarios,
  observaciones_internas,
  motivo_rechazo,
  estado,
  created_at,
  updated_at,
  actualizado_por
`;

/* =====================================================================
 * LISTAR (ADMIN)
 * ===================================================================*/
export async function listarPlaticasAdmin({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}): Promise<PlaticasPaginadasResult<PlaticaAdminRow>> {
  const supabase = await createClient();

  logger.info("listarPlaticasAdmin:start", {
    cursor,
    search,
    pageSize: PAGE_SIZE,
  });

  let query = supabase
    .from("platicas_concientizacion")
    .select(BASE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (search && search.trim() !== "") {
    query = query.or(
      `folio.ilike.%${search}%,nombre_solicitante.ilike.%${search}%,direccion.ilike.%${search}%,nombre_lugar.ilike.%${search}%`
    );
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("listarPlaticasAdmin:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data?.length) {
    return { items: [], nextCursor: null, total: count ?? 0 };
  }

  const usuarioIds = [...new Set(data.map((d) => d.usuario_id).filter(Boolean))] as string[];

  const { data: perfiles } = usuarioIds.length
    ? await supabase
        .from("perfiles")
        .select("id, nombres, apellido_paterno, apellido_materno, email")
        .in("id", usuarioIds)
    : { data: [] as any[] };

  const perfilById = new Map(
    (perfiles ?? []).map((p: any) => [p.id, p])
  );

  const items: PlaticaAdminRow[] = data.map((r) => {
    const p: any = r.usuario_id ? perfilById.get(r.usuario_id) : null;
    const nombre = p
      ? `${p.nombres ?? ""} ${p.apellido_paterno ?? ""} ${
          p.apellido_materno ?? ""
        }`.trim()
      : r.nombre_solicitante;
    return {
      ...(r as Platica),
      usuario_nombre: nombre || r.nombre_solicitante,
      usuario_correo: p?.email ?? "—",
    };
  });

  const nextCursor =
    items.length === PAGE_SIZE ? items[items.length - 1].created_at : null;

  logger.info("listarPlaticasAdmin:success", {
    returned: items.length,
    total: count,
  });

  return { items, nextCursor, total: count ?? 0 };
}

/* =====================================================================
 * LISTAR (USUARIO)
 * ===================================================================*/
export async function listarPlaticasUsuario({
  auth_id,
  cursor,
}: {
  auth_id: string;
  cursor?: string | null;
}): Promise<PlaticasPaginadasResult<PlaticaUsuarioRow>> {
  const supabase = await createClient();

  logger.info("listarPlaticasUsuario:start", { auth_id, cursor });

  let query = supabase
    .from("platicas_concientizacion")
    .select(BASE_SELECT, { count: "exact" })
    .eq("usuario_id", auth_id)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("listarPlaticasUsuario:supabase_error", {
      auth_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  const items = (data ?? []) as PlaticaUsuarioRow[];
  const nextCursor =
    items.length === PAGE_SIZE ? items[items.length - 1].created_at : null;

  logger.info("listarPlaticasUsuario:success", {
    auth_id,
    returned: items.length,
  });

  return { items, nextCursor, total: count ?? 0 };
}

/* =====================================================================
 * CREAR SOLICITUD (usuario)
 * ===================================================================*/
export async function crearSolicitudPlatica(input: {
  nombre_solicitante: string;
  telefono_contacto: string;
  tipo_lugar: TipoLugarPlatica;
  nombre_lugar?: string | null;
  numero_personas: number;
  direccion: string;
  fecha_tentativa: string;
  comentarios?: string | null;
}): Promise<Platica> {
  const parsed = SolicitarPlaticaSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sesión no válida. Inicia sesión nuevamente.");
  }

  logger.info("crearSolicitudPlatica:start", { auth_id: user.id });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .insert({
      usuario_id: user.id,
      nombre_solicitante: parsed.nombre_solicitante,
      telefono_contacto: parsed.telefono_contacto,
      tipo_lugar: parsed.tipo_lugar,
      nombre_lugar: parsed.nombre_lugar ?? null,
      numero_personas: parsed.numero_personas,
      direccion: parsed.direccion,
      fecha_tentativa: parsed.fecha_tentativa,
      comentarios: parsed.comentarios ?? null,
      estado: "pendiente",
    })
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("crearSolicitudPlatica:error", {
      auth_id: user.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("crearSolicitudPlatica:success", {
    id: data.id,
    folio: data.folio,
  });

  return data as Platica;
}

/* =====================================================================
 * MARCAR EN REVISIÓN (admin)
 * ===================================================================*/
export async function marcarPlaticaEnRevision(id: string): Promise<Platica> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("marcarPlaticaEnRevision:start", { id, admin: user?.id });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: "en_revision",
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("marcarPlaticaEnRevision:error", { id, message: error.message });
    throw new Error(error.message);
  }
  return data as Platica;
}

/* =====================================================================
 * APROBAR + AGENDAR (admin)
 * ===================================================================*/
export async function agendarPlatica(input: {
  id: string;
  fecha_definitiva: string;
  observaciones_internas?: string | null;
}): Promise<Platica> {
  const parsed = AgendarPlaticaSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("agendarPlatica:start", {
    id: parsed.id,
    fecha: parsed.fecha_definitiva,
  });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: "aprobada",
      fecha_definitiva: parsed.fecha_definitiva,
      observaciones_internas: parsed.observaciones_internas ?? null,
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("agendarPlatica:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }
  return data as Platica;
}

/* =====================================================================
 * RECHAZAR (admin)
 * ===================================================================*/
export async function rechazarPlatica(input: {
  id: string;
  motivo_rechazo: string;
}): Promise<Platica> {
  const parsed = RechazarPlaticaSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("rechazarPlatica:start", { id: parsed.id });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: "rechazada",
      motivo_rechazo: parsed.motivo_rechazo,
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("rechazarPlatica:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }
  return data as Platica;
}

/* =====================================================================
 * FINALIZAR (admin)
 * ===================================================================*/
export async function finalizarPlatica(id: string): Promise<Platica> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("finalizarPlatica:start", { id });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: "finalizada",
      actualizado_por: user?.id ?? null,
    })
    .eq("id", id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("finalizarPlatica:error", { id, message: error.message });
    throw new Error(error.message);
  }
  return data as Platica;
}

/* =====================================================================
 * CANCELAR (usuario o admin)
 * ===================================================================*/
export async function cancelarPlatica(input: {
  id: string;
  motivo_rechazo: string;
}): Promise<Platica> {
  const parsed = CancelarPlaticaSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("cancelarPlatica:start", { id: parsed.id });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: "cancelada",
      motivo_rechazo: parsed.motivo_rechazo,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("cancelarPlatica:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }
  return data as Platica;
}

/* =====================================================================
 * CAMBIAR ESTADO genérico (admin) — para transiciones rápidas
 * ===================================================================*/
export async function cambiarEstadoPlatica(
  id: string,
  nuevoEstado: EstadoPlatica
): Promise<Platica> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("cambiarEstadoPlatica:start", { id, nuevoEstado });

  const { data, error } = await supabase
    .from("platicas_concientizacion")
    .update({
      estado: nuevoEstado,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("cambiarEstadoPlatica:error", { id, message: error.message });
    throw new Error(error.message);
  }
  return data as Platica;
}
