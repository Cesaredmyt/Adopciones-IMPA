import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAccountConfirmation } from "@/lib/email/sendAccountConfirmation";
import { issueToken } from "@/lib/auth/tokens";
import { getSiteUrl } from "@/lib/auth/siteUrl";
import {
  enforceRateLimit,
  identityWithEmail,
  LIMITS,
} from "@/lib/auth/ratelimit";

// POST /api/auth/resend-verification
// Body: { email: string }
//
// Emite un token propio de verificación (purpose: verify_email) e invalida los
// previos del mismo usuario. Manda el correo desde nuestro Nodemailer.
//
// Respuesta uniforme {ok: true} siempre que la entrada sea sintácticamente
// válida — incluso si el email no existe o ya está confirmado. NO filtra
// existencia.

const VERIFY_TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 h

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const rateLimit = await enforceRateLimit(
      identityWithEmail(req, email),
      LIMITS.resendVerification
    );
    if (rateLimit) return rateLimit;

    // Buscar user_id por email vía `perfiles` (indexado, O(1)).
    // No usamos auth.admin.listUsers() porque pagina toda la base.
    const { data: perfil } = await supabaseAdmin
      .from("perfiles")
      .select("id, nombres, email")
      .eq("email", email)
      .maybeSingle();

    if (!perfil) {
      // Email desconocido — respuesta uniforme silenciosa.
      return NextResponse.json({ ok: true });
    }

    // Verificar si ya está confirmado: en ese caso no hacemos nada (silencio)
    // para evitar spam y porque no aplica el flujo de verificación.
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
      perfil.id as string
    );
    if (authUser?.user?.email_confirmed_at) {
      return NextResponse.json({ ok: true });
    }

    let token: string;
    try {
      const issued = await issueToken({
        userId: perfil.id as string,
        purpose: "verify_email",
        ttlSeconds: VERIFY_TOKEN_TTL_SECONDS,
        request: req,
      });
      token = issued.token;
    } catch {
      console.error("Fallo emitiendo token de reenvío");
      return NextResponse.json({ ok: true });
    }

    const confirmationUrl = `${getSiteUrl()}/api/auth/verify?token=${encodeURIComponent(token)}`;

    try {
      await sendAccountConfirmation({
        to: email,
        nombre: (perfil.nombres as string | null) ?? "Usuario",
        confirmationUrl,
        subject: "Reenvío de confirmación – IMPA 🐾",
      });
    } catch {
      console.error("Fallo reenviando correo de confirmación");
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Error en /api/auth/resend-verification");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
