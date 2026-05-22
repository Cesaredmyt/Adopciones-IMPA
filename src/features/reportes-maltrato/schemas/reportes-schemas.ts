import { z } from "zod";
import {
  ESTADOS_REPORTE,
  GRAVEDADES_REPORTE,
  PRIORIDADES_REPORTE,
} from "../types/reporte";

const telefonoRegex = /^[0-9+()\s-]{7,20}$/;

export const CrearReporteSchema = z
  .object({
    es_anonimo: z.boolean(),
    nombre_reportante: z
      .string()
      .max(120, "Máximo 120 caracteres.")
      .optional()
      .nullable(),
    telefono_contacto: z
      .string()
      .max(40, "Máximo 40 caracteres.")
      .optional()
      .nullable(),
    email_contacto: z
      .string()
      .email("Correo inválido.")
      .max(160, "Máximo 160 caracteres.")
      .optional()
      .nullable(),

    asunto: z
      .string()
      .min(5, "El asunto debe tener al menos 5 caracteres.")
      .max(160, "Máximo 160 caracteres."),
    descripcion: z
      .string()
      .min(20, "Describe el incidente con al menos 20 caracteres.")
      .max(2000, "Máximo 2000 caracteres."),
    direccion_incidente: z
      .string()
      .min(5, "Dirección demasiado corta.")
      .max(300, "Máximo 300 caracteres."),
    colonia: z
      .string()
      .min(2, "Indica la colonia o zona.")
      .max(160, "Máximo 160 caracteres."),
    fecha_incidente: z
      .string()
      .optional()
      .nullable()
      .refine(
        (v) => !v || !Number.isNaN(new Date(v).getTime()),
        "Fecha inválida."
      ),
    gravedad: z.enum(GRAVEDADES_REPORTE as [string, ...string[]]),
    evidencias_urls: z
      .array(z.string().url())
      .max(5, "Máximo 5 evidencias.")
      .default([]),
  })
  .superRefine((val, ctx) => {
    if (!val.es_anonimo) {
      if (!val.nombre_reportante || val.nombre_reportante.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nombre_reportante"],
          message: "Indica tu nombre o marca como anónimo.",
        });
      }
      const tieneTel =
        val.telefono_contacto && telefonoRegex.test(val.telefono_contacto);
      const tieneMail = val.email_contacto && val.email_contacto.includes("@");
      if (!tieneTel && !tieneMail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["telefono_contacto"],
          message: "Proporciona teléfono o correo para contacto.",
        });
      }
    }
  });

export type CrearReporteInput = z.infer<typeof CrearReporteSchema>;

export const ActualizarReporteAdminSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum(ESTADOS_REPORTE as [string, ...string[]]).optional(),
  prioridad: z.enum(PRIORIDADES_REPORTE as [string, ...string[]]).optional(),
  asignado_a: z.string().uuid().nullable().optional(),
  notas_internas: z.string().max(2000).nullable().optional(),
  resolucion: z.string().max(2000).nullable().optional(),
});

export type ActualizarReporteAdminInput = z.infer<
  typeof ActualizarReporteAdminSchema
>;

export const ComentarioBitacoraSchema = z.object({
  reporte_id: z.string().uuid(),
  descripcion: z
    .string()
    .min(3, "El comentario es muy corto.")
    .max(1000, "Máximo 1000 caracteres."),
});

export type ComentarioBitacoraInput = z.infer<typeof ComentarioBitacoraSchema>;

export const SeguimientoPublicoSchema = z.object({
  folio: z
    .string()
    .min(5, "Folio inválido.")
    .max(40, "Folio inválido.")
    .regex(/^REP-/i, "El folio debe empezar con REP-"),
  contacto: z
    .string()
    .min(3, "Indica tu correo o teléfono usado al reportar.")
    .max(160, "Máximo 160 caracteres."),
});

export type SeguimientoPublicoInput = z.infer<typeof SeguimientoPublicoSchema>;
