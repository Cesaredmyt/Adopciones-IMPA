import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendPasswordReset } from "@/lib/email/sendPasswordReset";
import { issueToken } from "@/lib/auth/tokens";
import { getSiteUrl } from "@/lib/auth/siteUrl";
import {
  enforceRateLimit,
  identityWithEmail,
  LIMITS,
} from "@/lib/auth/ratelimit";

// POST /api/auth/reset-password
// Body: { email: string }
//
// Emite un token propio (purpose: password_reset, 15 min, un solo uso) y manda
// el correo con un link a /recuperacion/reestablecer_contrasena?token=...
//
// Respuesta SIEMPRE 200 OK uniforme — no filtramos si el email existe.

const RESET_TOKEN_TTL_SECONDS = 15 * 60; // 15 min

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const rateLimit = await enforceRateLimit(
      identityWithEmail(req, email),
      LIMITS.resetRequest
    );
    if (rateLimit) return rateLimit;

    const { data: perfil } = await supabaseAdmin
      .from("perfiles")
      .select("id, nombres")
      .eq("email", email)
      .maybeSingle();

    if (!perfil) {
      // Email no registrado — respuesta uniforme silenciosa.
      return NextResponse.json({
        ok: true,
        message: "Correo enviado si el usuario existe.",
      });
    }

    let token: string;
    try {
      const issued = await issueToken({
        userId: perfil.id as string,
        purpose: "password_reset",
        ttlSeconds: RESET_TOKEN_TTL_SECONDS,
        request: req,
      });
      token = issued.token;
    } catch {
      console.error("Fallo emitiendo token de reset");
      return NextResponse.json({
        ok: true,
        message: "Correo enviado si el usuario existe.",
      });
    }

    const resetUrl = `${getSiteUrl()}/recuperacion/reestablecer_contrasena?token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordReset({
        to: email,
        nombre: (perfil.nombres as string | null) ?? "Usuario",
        resetUrl,
      });
    } catch {
      console.error("Fallo enviando correo de recuperación");
    }

    return NextResponse.json({
      ok: true,
      message: "Correo enviado si el usuario existe.",
    });
  } catch {
    console.error("Error en /api/auth/reset-password");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
