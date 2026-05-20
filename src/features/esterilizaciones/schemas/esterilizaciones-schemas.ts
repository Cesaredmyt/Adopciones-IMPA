import { z } from "zod";

export const SolicitarEsterilizacionSchema = z.object({
  mascota_id: z.string().uuid("Selecciona una mascota válida."),
  peso_kg: z
    .number({ error: "El peso es obligatorio." })
    .gt(0, "El peso debe ser mayor a 0.")
    .lt(200, "Peso fuera de rango."),
  observaciones_previas: z
    .string()
    .max(1000, "Máximo 1000 caracteres.")
    .optional()
    .nullable(),
});

export type SolicitarEsterilizacionInput = z.infer<
  typeof SolicitarEsterilizacionSchema
>;

export const ProgramarEsterilizacionSchema = z.object({
  id: z.string().uuid(),
  fecha_programada: z
    .string()
    .min(1, "Fecha y hora requeridas.")
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      "Fecha y hora inválidas."
    ),
});

export type ProgramarEsterilizacionInput = z.infer<
  typeof ProgramarEsterilizacionSchema
>;

export const CompletarEsterilizacionSchema = z
  .object({
    id: z.string().uuid(),
    estado: z.enum(["completada", "complicacion"]),
    resultado_notas: z.string().min(3, "Describe el resultado de la cirugía."),
    complicaciones: z.string().nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.estado === "complicacion" && !val.complicaciones?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["complicaciones"],
        message: "Describe las complicaciones presentadas.",
      });
    }
  });

export type CompletarEsterilizacionInput = z.infer<
  typeof CompletarEsterilizacionSchema
>;

export const CancelarEsterilizacionSchema = z.object({
  id: z.string().uuid(),
  motivo_cancelacion: z
    .string()
    .min(3, "Describe brevemente el motivo de cancelación."),
});

export type CancelarEsterilizacionInput = z.infer<
  typeof CancelarEsterilizacionSchema
>;

export const RechazarEsterilizacionSchema = z.object({
  id: z.string().uuid(),
  motivo_cancelacion: z
    .string()
    .min(3, "Indica el motivo del rechazo al solicitante."),
});

export type RechazarEsterilizacionInput = z.infer<
  typeof RechazarEsterilizacionSchema
>;
