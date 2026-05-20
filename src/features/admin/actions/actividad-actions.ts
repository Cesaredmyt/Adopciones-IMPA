"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type { ActividadItemType } from "../types/dashboard";
import type {
    DocumentoActividadRow,
    CitaAdopcionActividadRow,
    CitaVeterinariaActividadRow,
    MascotaAdoptadaActividadRow,
    EsterilizacionActividadRow,
} from "../types/actividad";

export async function obtenerActividadReciente(
    filtro: "todo" | "documento" | "cita" | "mascota" | "esterilizacion"
): Promise<ActividadItemType[]> {
    const supabase = await createClient();
    const eventos: ActividadItemType[] = [];

    logger.info("obtenerActividadReciente:start", {
        filtro,
    });

    if (filtro === "todo" || filtro === "documento") {
        const { data: docs, error } = await supabase
            .from("documentos")
            .select("created_at, tipo, perfiles(nombres)")
            .returns<DocumentoActividadRow[]>();

        if (error) {
            logger.error("obtenerActividadReciente:documentos_error", {
                message: error.message,
            });
        }

        docs?.forEach((d) =>
            eventos.push({
                tipo: "documento",
                mensaje: `${d.perfiles?.nombres ?? "Un usuario"} subió ${d.tipo}`,
                fecha: d.created_at,
            })
        );
    }

    if (filtro === "todo" || filtro === "cita") {
        const { data: citasAdop, error } = await supabase
            .from("citas_adopcion")
            .select(`
        estado,
        creada_en,
        perfiles:usuario_id(nombres),
        mascotas:mascota_id(nombre)
      `)
            .returns<CitaAdopcionActividadRow[]>();

        if (error) {
            logger.error("obtenerActividadReciente:citas_adopcion_error", {
                message: error.message,
            });
        }

        citasAdop?.forEach((c) =>
            eventos.push({
                tipo: "cita",
                mensaje: `${c.perfiles?.nombres ?? "Un adoptante"} ${
                    c.estado === "programada" ? "agendó" : "actualizó"
                } una cita de adopción para "${c.mascotas?.nombre ?? "una mascota"}"`,
                fecha: c.creada_en,
            })
        );
    }

    if (filtro === "todo" || filtro === "cita") {
        const { data: citasVet, error } = await supabase
            .from("citas_veterinarias")
            .select(`
        estado,
        created_at,
        adopciones:adopcion_id(
          adoptante:adoptante_id(nombres),
          mascota:mascota_id(nombre)
        )
      `)
            .returns<CitaVeterinariaActividadRow[]>();

        if (error) {
            logger.error("obtenerActividadReciente:citas_veterinarias_error", {
                message: error.message,
            });
        }

        citasVet?.forEach((c) =>
            eventos.push({
                tipo: "cita",
                mensaje: `${c.adopciones?.adoptante?.nombres ?? "Un usuario"} ${
                    c.estado === "pendiente" ? "agendó" : "actualizó"
                } una cita veterinaria para "${
                    c.adopciones?.mascota?.nombre ?? "una mascota"
                }".`,
                fecha: c.created_at,
            })
        );
    }

    if (filtro === "todo" || filtro === "mascota") {
        const { data: masc, error } = await supabase
            .from("mascotas")
            .select("nombre, updated_at")
            .eq("estado", "adoptada")
            .returns<MascotaAdoptadaActividadRow[]>();

        if (error) {
            logger.error("obtenerActividadReciente:mascotas_error", {
                message: error.message,
            });
        }

        masc?.forEach((m) =>
            eventos.push({
                tipo: "mascota",
                mensaje: `La mascota "${m.nombre}" ha sido adoptada.`,
                fecha: m.updated_at,
            })
        );
    }

    if (filtro === "todo" || filtro === "esterilizacion") {
        const { data: est, error } = await supabase
            .from("esterilizaciones")
            .select(`
                estado,
                created_at,
                updated_at,
                folio,
                mascotas:mascota_id(nombre),
                perfiles:usuario_id(nombres)
            `)
            .returns<EsterilizacionActividadRow[]>();

        if (error) {
            logger.error("obtenerActividadReciente:esterilizaciones_error", {
                message: error.message,
            });
        }

        est?.forEach((e) => {
            const quien = e.perfiles?.nombres ?? "Un adoptante";
            const mascotaNombre = e.mascotas?.nombre ?? "una mascota";

            let mensaje = `${quien} solicitó la esterilización de "${mascotaNombre}" (${e.folio}).`;
            if (e.estado === "completada") {
                mensaje = `Esterilización de "${mascotaNombre}" completada (${e.folio}).`;
            } else if (e.estado === "complicacion") {
                mensaje = `Esterilización de "${mascotaNombre}" finalizada con complicaciones (${e.folio}).`;
            } else if (e.estado === "programada") {
                mensaje = `Esterilización de "${mascotaNombre}" programada (${e.folio}).`;
            } else if (e.estado === "cancelada" || e.estado === "rechazada") {
                mensaje = `Solicitud de esterilización de "${mascotaNombre}" ${e.estado} (${e.folio}).`;
            }

            eventos.push({
                tipo: "esterilizacion",
                mensaje,
                fecha: e.updated_at ?? e.created_at,
            });
        });
    }

    eventos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    const result = eventos.slice(0, 8);

    logger.info("obtenerActividadReciente:success", {
        filtro,
        returned: result.length,
    });

    return result;
}
