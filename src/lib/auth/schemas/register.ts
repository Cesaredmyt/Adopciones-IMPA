// Esquema de validación server-side para /api/auth/register.
// Es deliberadamente más laxo que el wizard cliente: el server confía menos
// en valores opcionales y los normaliza. La regla dura es: lo que la DB
// exige (nombres, apellido_paterno, email, password). El resto puede venir
// null sin romper.

import { z } from "zod";

export const registerSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(2, "Nombres demasiado corto")
    .max(100),
  apellido_paterno: z
    .string()
    .trim()
    .min(2, "Apellido paterno demasiado corto")
    .max(50),
  apellido_materno: z.string().trim().max(50).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido")
    .max(254),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(100, "Máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  curp: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/,
      "CURP inválido"
    )
    .optional()
    .or(z.literal("")),
  telefono: z.string().trim().max(20).optional().or(z.literal("")),
  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
    .optional()
    .or(z.literal("")),
  ocupacion: z.string().trim().max(100).optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
