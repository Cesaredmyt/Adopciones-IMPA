import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { consumeToken } from "@/lib/auth/tokens";
import { resetConfirmSchema } from "@/lib/auth/schemas/resetConfirm";

export const runtime = "nodejs";

// POST /api/auth/reset/confirm
// Body: { token: string, password: string }
//
// Consume el token (un solo uso), cambia la contraseña vía admin API.
// IMPORTANTE: `updateUserById` con password revoca automáticamente todas las
// sesiones activas del usuario (refresh tokens viejos quedan inservibles) —
// es el comportamiento por defecto de Supabase desde la SDK v2.
//
// Mensajes uniformes: token inválido, expirado o ya usado producen el
// mismo error sin distinguir motivos.

export async function POST(req: Request) {
  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = resetConfirmSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "La contraseña no cumple los requisitos.",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  const result = await consumeToken(token, "password_reset");
  if (!result.ok) {
    return NextResponse.json(
      { error: "El enlace de recuperación es inválido o expiró." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    result.userId,
    { password }
  );

  if (error) {
    console.error("Fallo cambiando contraseña tras consumir token de reset");
    return NextResponse.json(
      { error: "No se pudo cambiar la contraseña." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
