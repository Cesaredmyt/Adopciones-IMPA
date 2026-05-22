import { z } from "zod";
import { TIPOS_LUGAR_PLATICA } from "../types/platica";

const telefonoRegex = /^[0-9+()\s-]{7,20}$/;

export const SolicitarPlaticaSchema = z.object({
  nombre_solicitante: z
    .string()
    .min(3, "Tu nombre debe tener al menos 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
  telefono_contacto: z
    .string()
    .regex(telefonoRegex, "Ingresa un teléfono válido (7-20 caracteres)."),
  tipo_lugar: z.enum(TIPOS_LUGAR_PLATICA as [string, ...string[]]),
  nombre_lugar: z
    .string()
    .max(160, "Máximo 160 caracteres.")
    .optional()
    .nullable(),
  numero_personas: z
    .number({ error: "Indica un número aproximado de asistentes." })
    .int("Debe ser un número entero.")
    .gt(0, "Debe ser mayor a 0.")
    .lt(10000, "Número fuera de rango."),
  direccion: z
    .string()
    .min(5, "Dirección demasiado corta.")
    .max(300, "Máximo 300 caracteres."),
  fecha_tentativa: z
    .string()
    .min(1, "Selecciona una fecha tentativa.")
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      "Fecha tentativa inválida."
    ),
  comentarios: z
    .string()
    .max(1000, "Máximo 1000 caracteres.")
    .optional()
    .nullable(),
});

export type SolicitarPlaticaInput = z.infer<typeof SolicitarPlaticaSchema>;

export const AgendarPlaticaSchema = z.object({
  id: z.string().uuid(),
  fecha_definitiva: z
    .string()
    .min(1, "Fecha y hora requeridas.")
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      "Fecha y hora inválidas."
    ),
  observaciones_internas: z
    .string()
    .max(1000, "Máximo 1000 caracteres.")
    .optional()
    .nullable(),
});

export type AgendarPlaticaInput = z.infer<typeof AgendarPlaticaSchema>;

export const RechazarPlaticaSchema = z.object({
  id: z.string().uuid(),
  motivo_rechazo: z
    .string()
    .min(3, "Indica el motivo del rechazo al solicitante.")
    .max(500, "Máximo 500 caracteres."),
});

export type RechazarPlaticaInput = z.infer<typeof RechazarPlaticaSchema>;

export const CancelarPlaticaSchema = z.object({
  id: z.string().uuid(),
  motivo_rechazo: z
    .string()
    .min(3, "Describe el motivo de cancelación.")
    .max(500, "Máximo 500 caracteres."),
});

export type CancelarPlaticaInput = z.infer<typeof CancelarPlaticaSchema>;
