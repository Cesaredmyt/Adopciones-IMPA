"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function obtenerStatsDashboard() {
    const db = supabaseAdmin;

    logger.info("obtenerStatsDashboard:start");

    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    // Estados que consideramos "activas" (no completadas/canceladas/rechazadas)
    const ESTADOS_CITA_ACTIVOS = ["programada", "confirmada", "pendiente"];

    const [
        docs,
        citasAdopHoy,
        citasVetHoy,
        citasAdopSemana,
        citasVetSemana,
        usuarios,
        mascotasTotal,
        citasAdopPend,
        citasVetPend,
        esterilizacionesPend,
        platicasPend,
        reportesPend,
    ] = await Promise.all([
        db.from("documentos")
            .select("*", { head: true, count: "exact" })
            .eq("status", "pendiente"),

        db.from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .eq("fecha_cita", hoyStr)
            .in("estado", ESTADOS_CITA_ACTIVOS),

        db.from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", hoyStr + "T00:00:00")
            .lte("fecha_cita", hoyStr + "T23:59:59")
            .in("estado", ESTADOS_CITA_ACTIVOS),

        db.from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", inicioSemana.toISOString().split("T")[0])
            .lte("fecha_cita", finSemana.toISOString().split("T")[0])
            .in("estado", ESTADOS_CITA_ACTIVOS),

        db.from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", inicioSemana.toISOString())
            .lte("fecha_cita", finSemana.toISOString())
            .in("estado", ESTADOS_CITA_ACTIVOS),

        db.from("perfiles")
            .select("*", { head: true, count: "exact" })
            .eq("estado_proceso", "en_revision"),

        // TOTAL mascotas (todas, sin importar estado)
        db.from("mascotas")
            .select("*", { head: true, count: "exact" }),

        db.from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "programada"),

        db.from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "pendiente"),

        db.from("esterilizaciones")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "pendiente"),

        db.from("platicas")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "pendiente"),

        db.from("reportes_maltrato")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "recibido"),
    ]);

    logger.info("obtenerStatsDashboard:success", {
        documentosPendientes: docs.count ?? 0,
        citasHoy: (citasAdopHoy.count ?? 0) + (citasVetHoy.count ?? 0),
        mascotasTotal: mascotasTotal.count ?? 0,
        platicasPend: platicasPend.count ?? 0,
        reportesPend: reportesPend.count ?? 0,
    });

    return {
        documentosPendientes: docs.count ?? 0,
        citasHoy: (citasAdopHoy.count ?? 0) + (citasVetHoy.count ?? 0),
        citasSemana: (citasAdopSemana.count ?? 0) + (citasVetSemana.count ?? 0),
        usuariosProceso: usuarios.count ?? 0,
        mascotasTotal: mascotasTotal.count ?? 0,
        citasAdopPend: citasAdopPend.count ?? 0,
        citasVetPend: citasVetPend.count ?? 0,
        esterilizacionesPend: esterilizacionesPend.count ?? 0,
        platicasPend: platicasPend.count ?? 0,
        reportesPend: reportesPend.count ?? 0,
    };
}
