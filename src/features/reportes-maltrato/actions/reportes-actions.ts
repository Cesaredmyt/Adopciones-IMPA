"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  CrearReporteSchema,
  ActualizarReporteAdminSchema,
  ComentarioBitacoraSchema,
  SeguimientoPublicoSchema,
} from "../schemas/reportes-schemas";
import type {
  Reporte,
  ReporteAdminRow,
  ReporteBitacoraEntry,
  ReportesPaginadosResult,
  EstadoReporte,
  GravedadReporte,
  PrioridadReporte,
} from "../types/reporte";

const PAGE_SIZE = 10;

const BASE_SELECT = `
  id,
  folio,
  reportante_id,
  nombre_reportante,
  telefono_contacto,
  email_contacto,
  es_anonimo,
  asunto,
  descripcion,
  direccion_incidente,
  colonia,
  fecha_incidente,
  gravedad,
  evidencias_urls,
  prioridad,
  asignado_a,
  notas_internas,
  resolucion,
  estado,
  created_at,
  updated_at,
  actualizado_por
`;

/* =====================================================================
 * CREAR REPORTE (público, anónimo o autenticado)
 * ===================================================================*/
export async function crearReporteMaltrato(input: {
  es_anonimo: boolean;
  nombre_reportante?: string | null;
  telefono_contacto?: string | null;
  email_contacto?: string | null;
  asunto: string;
  descripcion: string;
  direccion_incidente: string;
  colonia: string;
  fecha_incidente?: string | null;
  gravedad: GravedadReporte;
  evidencias_urls: string[];
}): Promise<Reporte> {
  const parsed = CrearReporteSchema.parse(input);
  const supabase = await createClient();

  // Si hay sesión, vinculamos reportante_id automáticamente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logger.info("crearReporteMaltrato:start", {
    anonimo: parsed.es_anonimo,
    auth_id: user?.id ?? null,
    evidencias: parsed.evidencias_urls.length,
  });

  const { data, error } = await supabase
    .from("reportes_maltrato")
    .insert({
      reportante_id: user?.id ?? null,
      nombre_reportante: parsed.es_anonimo
        ? null
        : parsed.nombre_reportante ?? null,
      telefono_contacto: parsed.es_anonimo
        ? null
        : parsed.telefono_contacto ?? null,
      email_contacto: parsed.es_anonimo
        ? null
        : parsed.email_contacto ?? null,
      es_anonimo: parsed.es_anonimo,
      asunto: parsed.asunto,
      descripcion: parsed.descripcion,
      direccion_incidente: parsed.direccion_incidente,
      colonia: parsed.colonia,
      fecha_incidente: parsed.fecha_incidente ?? null,
      gravedad: parsed.gravedad,
      evidencias_urls: parsed.evidencias_urls,
      estado: "recibido",
      prioridad: "normal",
    })
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("crearReporteMaltrato:error", { message: error.message });
    throw new Error(error.message);
  }

  logger.info("crearReporteMaltrato:success", {
    id: data.id,
    folio: data.folio,
  });

  return data as Reporte;
}

/* =====================================================================
 * LISTAR (ADMIN)
 * ===================================================================*/
export async function listarReportesAdmin({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}): Promise<ReportesPaginadosResult<ReporteAdminRow>> {
  const supabase = await createClient();

  logger.info("listarReportesAdmin:start", { cursor, search, pageSize: PAGE_SIZE });

  let query = supabase
    .from("reportes_maltrato")
    .select(BASE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (search && search.trim() !== "") {
    query = query.or(
      `folio.ilike.%${search}%,asunto.ilike.%${search}%,direccion_incidente.ilike.%${search}%,colonia.ilike.%${search}%`
    );
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("listarReportesAdmin:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data?.length) {
    return { items: [], nextCursor: null, total: count ?? 0 };
  }

  const asignadoIds = [
    ...new Set(data.map((d) => d.asignado_a).filter(Boolean)),
  ] as string[];

  const { data: perfiles } = asignadoIds.length
    ? await supabase
        .from("perfiles")
        .select("id, nombres, apellido_paterno, apellido_materno")
        .in("id", asignadoIds)
    : { data: [] as any[] };

  const perfilById = new Map((perfiles ?? []).map((p: any) => [p.id, p]));

  const items: ReporteAdminRow[] = data.map((r) => {
    const p: any = r.asignado_a ? perfilById.get(r.asignado_a) : null;
    const asignado = p
      ? `${p.nombres ?? ""} ${p.apellido_paterno ?? ""}`.trim()
      : null;
    return {
      ...(r as Reporte),
      asignado_nombre: asignado,
    };
  });

  const nextCursor =
    items.length === PAGE_SIZE ? items[items.length - 1].created_at : null;

  logger.info("listarReportesAdmin:success", {
    returned: items.length,
    total: count,
  });

  return { items, nextCursor, total: count ?? 0 };
}

/* =====================================================================
 * OBTENER POR ID (ADMIN)
 * ===================================================================*/
export async function obtenerReporteAdminPorId(
  id: string
): Promise<ReporteAdminRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reportes_maltrato")
    .select(BASE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error("obtenerReporteAdminPorId:error", { id, message: error.message });
    throw new Error(error.message);
  }
  if (!data) return null;

  let asignado_nombre: string | null = null;
  if (data.asignado_a) {
    const { data: p } = await supabase
      .from("perfiles")
      .select("nombres, apellido_paterno")
      .eq("id", data.asignado_a)
      .maybeSingle();
    if (p) {
      asignado_nombre = `${p.nombres ?? ""} ${p.apellido_paterno ?? ""}`.trim();
    }
  }

  return { ...(data as Reporte), asignado_nombre };
}

/* =====================================================================
 * ACTUALIZAR (ADMIN): estado / prioridad / asignación / notas / resolución
 * ===================================================================*/
export async function actualizarReporteAdmin(input: {
  id: string;
  estado?: EstadoReporte;
  prioridad?: PrioridadReporte;
  asignado_a?: string | null;
  notas_internas?: string | null;
  resolucion?: string | null;
}): Promise<Reporte> {
  const parsed = ActualizarReporteAdminSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const update: Record<string, unknown> = {
    actualizado_por: user?.id ?? null,
  };
  if (parsed.estado !== undefined) update.estado = parsed.estado;
  if (parsed.prioridad !== undefined) update.prioridad = parsed.prioridad;
  if (parsed.asignado_a !== undefined) update.asignado_a = parsed.asignado_a;
  if (parsed.notas_internas !== undefined)
    update.notas_internas = parsed.notas_internas;
  if (parsed.resolucion !== undefined) update.resolucion = parsed.resolucion;

  logger.info("actualizarReporteAdmin:start", { id: parsed.id, fields: Object.keys(update) });

  const { data, error } = await supabase
    .from("reportes_maltrato")
    .update(update)
    .eq("id", parsed.id)
    .select(BASE_SELECT)
    .single();

  if (error) {
    logger.error("actualizarReporteAdmin:error", {
      id: parsed.id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  return data as Reporte;
}

/* =====================================================================
 * BITÁCORA: listar entradas de un reporte
 * ===================================================================*/
export async function listarBitacoraReporte(
  reporte_id: string
): Promise<ReporteBitacoraEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reportes_maltrato_bitacora")
    .select("*")
    .eq("reporte_id", reporte_id)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("listarBitacoraReporte:error", {
      reporte_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  return (data ?? []) as ReporteBitacoraEntry[];
}

/* =====================================================================
 * BITÁCORA: agregar comentario manual (admin)
 * ===================================================================*/
export async function agregarComentarioBitacora(input: {
  reporte_id: string;
  descripcion: string;
}): Promise<ReporteBitacoraEntry> {
  const parsed = ComentarioBitacoraSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let autor_nombre: string | null = null;
  if (user) {
    const { data: p } = await supabase
      .from("perfiles")
      .select("nombres, apellido_paterno")
      .eq("id", user.id)
      .maybeSingle();
    if (p) {
      autor_nombre = `${p.nombres ?? ""} ${p.apellido_paterno ?? ""}`.trim();
    }
  }

  const { data, error } = await supabase
    .from("reportes_maltrato_bitacora")
    .insert({
      reporte_id: parsed.reporte_id,
      autor_id: user?.id ?? null,
      autor_nombre,
      accion: "comentario",
      descripcion: parsed.descripcion,
    })
    .select("*")
    .single();

  if (error) {
    logger.error("agregarComentarioBitacora:error", {
      reporte_id: parsed.reporte_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  return data as ReporteBitacoraEntry;
}

/* =====================================================================
 * SEGUIMIENTO PÚBLICO POR FOLIO (sin sesión)
 *  - Devuelve datos visibles al ciudadano:
 *    folio, estado, gravedad, fecha y resolución (si aplica).
 *  - Requiere coincidencia con teléfono o correo usado al reportar.
 * ===================================================================*/
export async function consultarReportePublico(input: {
  folio: string;
  contacto: string;
}): Promise<{
  folio: string;
  estado: EstadoReporte;
  gravedad: GravedadReporte;
  created_at: string;
  resolucion: string | null;
  asunto: string;
} | null> {
  const parsed = SeguimientoPublicoSchema.parse(input);
  const supabase = await createClient();

  const folioUpper = parsed.folio.trim().toUpperCase();
  const contacto = parsed.contacto.trim().toLowerCase();

  // RLS bloquea el SELECT anónimo en reportes_maltrato (las políticas
  // limitan a admin y al reportante autenticado). Para el seguimiento
  // público por folio usamos el cliente service-role y validamos
  // teléfono/correo lado server.
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const { data, error } = await supabaseAdmin
    .from("reportes_maltrato")
    .select(
      "folio, estado, gravedad, created_at, resolucion, asunto, telefono_contacto, email_contacto"
    )
    .eq("folio", folioUpper)
    .maybeSingle();

  if (error) {
    logger.error("consultarReportePublico:error", {
      folio: folioUpper,
      message: error.message,
    });
    throw new Error("No pudimos consultar el reporte. Intenta más tarde.");
  }

  if (!data) return null;

  const matchTel =
    data.telefono_contacto &&
    data.telefono_contacto.toLowerCase().replace(/[^0-9]/g, "") ===
      contacto.replace(/[^0-9]/g, "");
  const matchMail =
    data.email_contacto && data.email_contacto.toLowerCase() === contacto;

  if (!matchTel && !matchMail) {
    logger.warn("consultarReportePublico:contacto_no_coincide", {
      folio: folioUpper,
    });
    return null;
  }

  return {
    folio: data.folio,
    estado: data.estado as EstadoReporte,
    gravedad: data.gravedad as GravedadReporte,
    created_at: data.created_at,
    resolucion: data.resolucion,
    asunto: data.asunto,
  };
}
