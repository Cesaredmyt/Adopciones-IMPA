import { z } from "zod";

// Single source of truth para login. Server y cliente importan de aquí.
// `email/password` consistente — sustituye al duplicado correo/contrasena.
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido").max(254),
  password: z.string().min(1, "Contraseña requerida").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
