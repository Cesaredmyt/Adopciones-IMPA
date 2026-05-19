import { z } from "zod";

// Schema para POST /api/auth/reset/confirm.
// El password sigue la misma política que register (Fase 2). Si endurecemos
// la política en el futuro, se actualizan ambos en un mismo PR.
export const resetConfirmSchema = z.object({
  token: z.string().min(20).max(200),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(100, "Máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
});

export type ResetConfirmInput = z.infer<typeof resetConfirmSchema>;
