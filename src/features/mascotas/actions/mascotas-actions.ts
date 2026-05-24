"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema } from "../schemas/mascotas-schemas";
import type { Mascota } from "../types/mascotas";
import { deleteMascotaImagen } from "./storage/deleteMascotaImagen";
import { deleteMascotaQR } from "./storage/deleteMascotaQR";
import { validarMascotaEliminable } from "./helpers/validarMascotaEliminable";
import { baseMascotasQuery, PAGE_SIZE } from "./helpers/baseMascotasQuery";
import type { ListarMascotasParams, ListarMascotasPublicasParams, MascotasPaginadasResult } from "../types/mascotas";
import { logger } from "@/lib/logger";

/* ======================== LISTAR ======================== */
export async function listarMascotas(
    { cursor, search, especie, sexo }: ListarMascotasParams
) {
    logger.info("listarMascotas:start", { cursor, search, especie, sexo });

    let query = baseMascotasQuery(supabaseAdmin);

    if (search?.trim()) query = query.ilike("nombre", `%${search}%`);
    if (especie && especie !== "Todas") query = query.eq("raza.especie", especie);
    if (sexo && sexo !== "Todos") query = query.eq("sexo", sexo.toLowerCase());
    if (cursor) query = query.lt("created_at", cursor);

    const { data, error, count } = await query;

    if (error) {
        logger.error("listarMascotas:supabase_error", { message: error.message });
        throw new Error(error.message);
    }

    const nextCursor = data && data.length === PAGE_SIZE ? data[data.length - 1].created_at : null;

    logger.info("listarMascotas:success", { returned: data?.length ?? 0, total: count ?? 0 });

    return { items: data ?? [], nextCursor, total: count ?? 0 };
}

export async function listarMascotasPublicas(
    { cursor, search, especie, sexo }: ListarMascotasPublicasParams
): Promise<MascotasPaginadasResult> {
    logger.info("listarMascotasPublicas:start", { cursor, search, especie, sexo });

    let query = baseMascotasQuery(supabaseAdmin)
        .eq("disponible_adopcion", true)
        .eq("estado", "disponible");

    if (search?.trim()) query = query.ilike("nombre", `%${search}%`);
    if (especie && especie !== "Todas") query = query.eq("raza.especie", especie);
    if (sexo && sexo !== "Todos") query = query.eq("sexo", sexo.toLowerCase());
    if (cursor) query = query.lt("created_at", cursor);

    const { data, error, count } = await query;

    if (error) {
        logger.error("listarMascotasPublicas:supabase_error", { message: error.message });
        throw new Error(error.message);
    }

    const nextCursor = data && data.length === PAGE_SIZE ? data[data.length - 1].created_at ?? null : null;

    logger.info("listarMascotasPublicas:success", { returned: data?.length ?? 0, total: count ?? 0 });

    return { items: data ?? [], nextCursor, total: count ?? 0 };
}


/* ======================== CREAR ======================== */
export async function crearMascota(input: unknown): Promise<Mascota> {
    const parsed = CreateMascotaSchema.parse(input);

    logger.info("crearMascota:start", { nombre: parsed.nombre });

    const { data, error } = await supabaseAdmin
        .from("mascotas")
        .insert(parsed)
        .select("*, raza:raza_id(id, nombre, especie)")
        .single();

    if (error) {
        logger.error("crearMascota:supabase_error", { message: error.message });
        throw new Error(error.message);
    }

    logger.info("crearMascota:success", { mascotaId: data.id });

    return data as Mascota;
}


/* ======================== ACTUALIZAR ======================== */
export async function actualizarMascota(payload: unknown) {
    const parsed = UpdateMascotaSchema.parse(payload);

    logger.info("actualizarMascota:start", { mascotaId: parsed.id });

    const { data, error } = await supabaseAdmin
        .from("mascotas")
        .update({ ...parsed, updated_at: new Date().toISOString() })
        .eq("id", parsed.id)
        .select("*, raza:raza_id(id, nombre, especie)")
        .single();

    if (error) {
        logger.error("actualizarMascota:supabase_error", { mascotaId: parsed.id, message: error.message });
        throw error;
    }

    logger.info("actualizarMascota:success", { mascotaId: parsed.id });

    return data;
}

/* ======================== ELIMINAR ======================== */
export async function eliminarMascota(id: string): Promise<{ success: boolean; reason?: string }> {
    const parsed = DeleteMascotaSchema.parse({ id });

    logger.info("eliminarMascota:start", { mascotaId: parsed.id });

    const validacion = await validarMascotaEliminable(parsed.id);

    if (!validacion.success) {
        logger.info("eliminarMascota:validacion_fallida", { mascotaId: parsed.id, reason: validacion.reason });
        return validacion;
    }

    const { imagen_url, qr_code } = validacion.mascota!;

    if (imagen_url) await deleteMascotaImagen(parsed.id);
    if (qr_code) await deleteMascotaQR(qr_code);

    const { error: deleteError } = await supabaseAdmin
        .from("mascotas")
        .delete()
        .eq("id", parsed.id);

    if (deleteError) {
        logger.error("eliminarMascota:supabase_error", { mascotaId: parsed.id, message: deleteError.message });
        return { success: false, reason: "error_eliminar" };
    }

    logger.info("eliminarMascota:success", { mascotaId: parsed.id });

    return { success: true };
}


/* ======================== OBTENER POR ID ======================== */
export async function obtenerMascotaPorId(id: string) {
    const { data, error } = await supabaseAdmin
        .from("mascotas")
        .select("*, raza:raza_id(id, nombre, especie)")
        .eq("id", id)
        .single();

    if (error) {
        logger.error("obtenerMascotaPorId:error", { id, message: error.message });
        throw new Error("No se encontró la mascota");
    }

    return data;
}

/* ======================== OBTENER VARIAS POR IDS ======================== */
export async function fetchMascotasByIds(ids: string[]) {
    if (ids.length === 0) return [];

    logger.info("fetchMascotasByIds:start", { idsCount: ids.length });

    const { data, error } = await supabaseAdmin
        .from("mascotas")
        .select("id, nombre")
        .in("id", ids);

    if (error) {
        logger.error("fetchMascotasByIds:supabase_error", { message: error.message });
        throw new Error(error.message);
    }

    logger.info("fetchMascotasByIds:success", { returned: data?.length ?? 0 });

    return data ?? [];
}

export async function marcarMascotaAdoptada(mascotaId: string) {
    logger.info("marcarMascotaAdoptada:start", { mascotaId });

    const { error } = await supabaseAdmin
        .from("mascotas")
        .update({ estado: "adoptada", disponible_adopcion: false })
        .eq("id", mascotaId);

    if (error) {
        logger.error("marcarMascotaAdoptada:error", { mascotaId, message: error.message });
    }
}

export async function marcarMascotaDisponible(mascotaId: string) {
    logger.info("marcarMascotaDisponible:start", { mascotaId });

    const { error } = await supabaseAdmin
        .from("mascotas")
        .update({
            estado: "disponible",
            disponible_adopcion: true,
            updated_at: new Date().toISOString(),
        })
        .eq("id", mascotaId);

    if (error) {
        logger.error("marcarMascotaDisponible:error", { mascotaId, message: error.message });
        throw new Error("No se pudo liberar la mascota");
    }

    logger.info("marcarMascotaDisponible:success", { mascotaId });

    return true;
}
