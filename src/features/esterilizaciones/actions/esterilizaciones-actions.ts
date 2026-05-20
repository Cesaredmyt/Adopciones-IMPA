"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  SolicitarEsterilizacionSchema,
  ProgramarEsterilizacionSchema,
  CompletarEsterilizacionSchema,
  CancelarEsterilizacionSchema,
  RechazarEsterilizacionSchema,
} from "../schemas/esterilizaciones-schemas";
import type {
  Esterilizacion,
  EsterilizacionAdminRow,
  EsterilizacionUsuarioRow,
  EsterilizacionesPaginadasResult,
  EstadoEsterilizacion,
  MascotaEsterilizable,
} from "../types/esterilizacion";

const PAGE_SIZE = 10;

const BASE_SELECT = `
  id,
  folio,
  mascota_id,
  usuario_id,
  admin_responsable,
  peso_kg,
  observaciones_previas,
  fecha_solicitud,
  fecha_programada,
  fecha_realizada,
  resultado_notas,
  complicaciones,
  motivo_cancelacion,
  estado,
  created_at,
  updated_at,
  actualizado_por
`;

/* =====================================================================
 * LISTAR (ADMIN) — paginación por cursor sobre created_at
 * ===================================================================*/
export async function listarEsterilizacionesAdmin({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}): Promise<EsterilizacionesPaginadasResult<EsterilizacionAdminRow>> {
  const supabase = await createClient();

  logger.info("listarEsterilizacionesAdmin:start", {
    cursor,
    search,
    pageSize: PAGE_SIZE,
  });

  let query = supabase
    .from("esterilizaciones")
    .select(BASE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (search && search.trim() !== "") {
    query = query.or(
      `folio.ilike.%${search}%,resultado_notas.ilike.%${search}%`
    );
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("listarEsterilizacionesAdmin:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data?.length) {
    return { items: [], nextCursor: null, total: count ?? 0 };
  }

  const mascotaIds = [...new Set(data.map((d) => d.mascota_id))];
  const usuarioIds = [
    ...new Set(data.map((d) => d.usuario_id).filter(Boolean)),
  ] as string[];

  const [mascotasRes, perfilesRes] = await Promise.all([
    supabase
      .from("mascotas")
      .select("id, nombre, imagen_url")
      .in("id", mascotaIds),
    usuarioIds.length
      ? supabase
          .from("perfiles")
          .select("id, nombres, apellido_paterno, apellido_materno, email")
          .in("id", usuarioIds)
      : Promise.resolve({ data: [] as any[], error: null }),
  ]);

  if (mascotasRes.error) {
    logger.error("listarEsterilizacionesAdmin:mascotas_error", {
      message: mascotasRes.error.message,
    });
  }

  if (perfilesRes.error) {
    logger.error("listarEsterilizacionesAdmin:perfiles_error", {
      message: perfilesRes.error.message,
    });
  }

  const mascotaById = new Map(
    (mascotasRes.data ?? []).map((m: any) => [m.id, m])
  );
  const perfilById = new Map(
    (perfilesRes.data ?? []).map((p: any) => [p.id, p])
  );

  const items: EsterilizacionAdminRow[] = data.map((r) => {
    const m = mascotaById.get(r.mascota_id);
    const p = r.usuario_id ? perfilById.get(r.usuario_id) : null;
    const nombre = p
      ? `${p.nombres ?? ""} ${p.apellido_paterno ?? ""} ${
          p.apellido_materno ?? ""
        }`.trim()
      : "Campaña interna";
    return {
      ...(r as Esterilizacion),
      mascota_nombre: m?.nombre ?? "Mascota",
      mascota_imagen: m?.imagen_url ?? null,
      usuario_nombre: nombre || "Sin asignar",
      usuario_correo: p?.email ?? "—",
    };
  });

  const nextCursor =
    items.length === PAGE_SIZE ? items[items.length - 1].created_at : null;

  logger.info("listarEsterilizacionesAdmin:success", {
    returned: items.length,
    total: count,
  });

  return { items, nextCursor, total: count ?? 0 };
}

/* =====================================================================
 * LISTAR (USUARIO)
 * ===================================================================*/
export async function listarEsterilizacionesUsuario({
  auth_id,
  cursor,
}: {
  auth_id: string;
  cursor?: string | null;
}): Promise<EsterilizacionesPaginadasResult<EsterilizacionUsuarioRow>> {
  const supabase = await createClient();

  logger.info("listarEsterilizacionesUsuario:start", { auth_id, cursor });

  let query = supabase
    .from("esterilizaciones")
    .select(BASE_SELECT, { count: "exact" })
    .eq("usuario_id", auth_id)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("listarEsterilizacionesUsuario:supabase_error", {
      auth_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data?.length) {
    return { items: [], nextCursor: null, total: count ?? 0 };
  }

  const mascotaIds = [...new Set(data.map((d) => d.mascota_id))];
  const { data: mascotas } = await supabase
    .from("mascotas")
    .select("id, nombre, imagen_url")
    .in("id", mascotaIds);

  const byId = new Map((mascotas ?? []).map((m: any) => [m.id, m]));

  const items: EsterilizacionUsuarioRow[] = data.map((r) => {
    const m = byId.get(r.mascota_id);
    return {
      ...(r as Esterilizacion),
      mascota_nombre: m?.nombre ?? "Mascota",
      mascota_imagen: m?.imagen_url ?? null,
    };
  });

  const nextCursor =
    items.length === PAGE_SIZE ? items[items.length - 1].created_at : null;

  logger.info("listarEsterilizacionesUsuario:success", {
    auth_id,
    returned: items.length,
  });

  return { items, nextCursor, total: count ?? 0 };
}

/* =====================================================================
 * MASCOTAS ELEGIBLES para solicitar esterilización (usuario)
 * Solo mascotas con adopción aprobada del usuario autenticado.
 * ===================================================================*/
export async function obtenerMascotasEsterilizables(
  auth_id: string
): Promise<MascotaEsterilizable[]> {
  const supabase = await createClient();

  logger.info("obtenerMascotasEsterilizables:start", { auth_id });

  const { data, error } = await supabase
    .from("adopciones")
    .select(
      `
      id,
      estado,
      mascota:mascotas (
        id,
        nombre,
        imagen_url,
        esterilizado
      )
    `
    )
    .eq("adoptante_id", auth_id)
    .eq("estado", "aprobada");

  if (error) {
    logger.error("obtenerMascotasEsterilizables:error", {
      auth_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  const items: MascotaEsterilizable[] = (data ?? [])
    .filter((a: any) => a.mascota)
    .map((a: any) => ({
      adopcion_id: a.id,
      mascota_id: a.mascota.id,
      mascota_nombre: a.mascota.nombre,
      mascota_imagen: a.mascota.imagen_url ?? null,
      mascota_esterilizada: Boolean(a.mascota.esterilizado),
    }));

  logger.info("obtenerMascotasEsterilizables:success", {
    auth_id,
    total: items.length,
  });

  return items;
}

/* =====================================================================
 * CREAR SOLICITUD (usuario)
 * ===================================================================*/
export async function crearSolicitudEsterilizacion(input: {
  mascota_id: string;
  peso_kg: number;
  observaciones_previas?: string | null;
}): Promise<Esterilizacion> {
  const parsed = SolicitarEsterilizacionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sesión no válida. Inicia sesión nuevamente.");
  }

  logger.info("crearSolicitudEsterilizacion:start", {
    auth_id: user.id,
    mascota_id: parsed.mascota_id,
  });

  // Verifica que no exista ya una esterilización en curso para la mascota
  const { data: existente } = await supabase
    .from("esterilizaciones")
    .select("id, estado")
    .eq("mascota_id", parsed.mascota_id)
    .in("estado", ["pendiente", "aprobada", "programada", "en_quirofano"])
    .maybeSingle();

  if (existente) {
    throw new Error(
      "Ya existe una solicitud de esterilización activa para esta mascota."
    );
  }

  const { data, error } = await supabase
    .from("esterilizaciones")
    .insert({
      mascota_id: parsed.mascota_id,
      usuario_id: user.id,
      peso_kg: parsed.peso_kg,
      observaciones_previas: parsed.observaciones_previas ?? null,
      estado: "pendiente",
    })
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("crearSolicitudEsterilizacion:error", {
      auth_id: user.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("crearSolicitudEsterilizacion:success", {
    id: data.id,
    folio: data.folio,
  });

  return data as Esterilizacion;
}

/* =====================================================================
 * APROBAR (admin)
 * ===================================================================*/
export async function aprobarEsterilizacion(id: string): Promise<Esterilizacion> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("aprobarEsterilizacion:start", { id, admin: user?.id });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: "aprobada",
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("aprobarEsterilizacion:error", { id, message: error.message });
    throw new Error(error.message);
  }

  logger.info("aprobarEsterilizacion:success", { id });
  return data as Esterilizacion;
}

/* =====================================================================
 * RECHAZAR (admin)
 * ===================================================================*/
export async function rechazarEsterilizacion(input: {
  id: string;
  motivo_cancelacion: string;
}): Promise<Esterilizacion> {
  const parsed = RechazarEsterilizacionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("rechazarEsterilizacion:start", { id: parsed.id });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: "rechazada",
      motivo_cancelacion: parsed.motivo_cancelacion,
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("rechazarEsterilizacion:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("rechazarEsterilizacion:success", { id: parsed.id });
  return data as Esterilizacion;
}

/* =====================================================================
 * PROGRAMAR (admin) — asigna fecha/hora
 * ===================================================================*/
export async function programarEsterilizacion(input: {
  id: string;
  fecha_programada: string;
}): Promise<Esterilizacion> {
  const parsed = ProgramarEsterilizacionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("programarEsterilizacion:start", {
    id: parsed.id,
    fecha: parsed.fecha_programada,
  });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: "programada",
      fecha_programada: parsed.fecha_programada,
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("programarEsterilizacion:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("programarEsterilizacion:success", { id: parsed.id });
  return data as Esterilizacion;
}

/* =====================================================================
 * CAMBIAR ESTADO simple (admin) — utilidad genérica
 * Útil para transiciones rápidas: aprobada -> en_quirofano, etc.
 * ===================================================================*/
export async function cambiarEstadoEsterilizacion(
  id: string,
  nuevoEstado: EstadoEsterilizacion
): Promise<Esterilizacion> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("cambiarEstadoEsterilizacion:start", { id, nuevoEstado });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: nuevoEstado,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("cambiarEstadoEsterilizacion:error", {
      id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("cambiarEstadoEsterilizacion:success", { id, nuevoEstado });
  return data as Esterilizacion;
}

/* =====================================================================
 * COMPLETAR (admin) — registra resultado
 * ===================================================================*/
export async function completarEsterilizacion(input: {
  id: string;
  estado: "completada" | "complicacion";
  resultado_notas: string;
  complicaciones?: string | null;
}): Promise<Esterilizacion> {
  const parsed = CompletarEsterilizacionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("completarEsterilizacion:start", {
    id: parsed.id,
    estado: parsed.estado,
  });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: parsed.estado,
      resultado_notas: parsed.resultado_notas,
      complicaciones: parsed.complicaciones ?? null,
      fecha_realizada: new Date().toISOString(),
      admin_responsable: user?.id ?? null,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("completarEsterilizacion:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("completarEsterilizacion:success", {
    id: parsed.id,
    estado: parsed.estado,
  });
  return data as Esterilizacion;
}

/* =====================================================================
 * CANCELAR (usuario o admin)
 * ===================================================================*/
export async function cancelarEsterilizacion(input: {
  id: string;
  motivo_cancelacion: string;
}): Promise<Esterilizacion> {
  const parsed = CancelarEsterilizacionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("cancelarEsterilizacion:start", { id: parsed.id });

  const { data, error } = await supabase
    .from("esterilizaciones")
    .update({
      estado: "cancelada",
      motivo_cancelacion: parsed.motivo_cancelacion,
      actualizado_por: user?.id ?? null,
    })
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("cancelarEsterilizacion:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("cancelarEsterilizacion:success", { id: parsed.id });
  return data as Esterilizacion;
}

/* =====================================================================
 * OBTENER POR ID (admin) — para modales de expediente
 * ===================================================================*/
export async function obtenerEsterilizacionAdminPorId(
  id: string
): Promise<EsterilizacionAdminRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("esterilizaciones")
    .select(BASE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error("obtenerEsterilizacionAdminPorId:error", {
      id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data) return null;

  const [mascotaRes, perfilRes] = await Promise.all([
    supabase
      .from("mascotas")
      .select("id, nombre, imagen_url")
      .eq("id", data.mascota_id)
      .maybeSingle(),
    data.usuario_id
      ? supabase
          .from("perfiles")
          .select("id, nombres, apellido_paterno, apellido_materno, email")
          .eq("id", data.usuario_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const p: any = perfilRes.data;
  return {
    ...(data as Esterilizacion),
    mascota_nombre: mascotaRes.data?.nombre ?? "Mascota",
    mascota_imagen: mascotaRes.data?.imagen_url ?? null,
    usuario_nombre: p
      ? `${p.nombres ?? ""} ${p.apellido_paterno ?? ""} ${
          p.apellido_materno ?? ""
        }`.trim()
      : "Campaña interna",
    usuario_correo: p?.email ?? "—",
  };
}
