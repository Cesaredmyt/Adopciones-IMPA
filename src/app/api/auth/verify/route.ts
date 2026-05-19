import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { consumeToken } from "@/lib/auth/tokens";
import { getSiteUrl } from "@/lib/auth/siteUrl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/verify?token=...
//
// Consume el token propio (un solo uso, 24 h) y marca el email del usuario
// como confirmado vía supabaseAdmin.auth.admin.updateUserById.
//
// Mensajes uniformes: cualquier fallo (token inválido, expirado, ya usado)
// redirige a /confirmado?error=invalid — no distinguimos motivos.

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const base = getSiteUrl();
  const successUrl = `${base}/confirmado`;
  const failureUrl = `${base}/confirmado?error=invalid`;

  const result = await consumeToken(token, "verify_email");
  if (!result.ok) {
    return NextResponse.redirect(failureUrl);
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    result.userId,
    { email_confirm: true }
  );

  if (error) {
    console.error("Fallo confirmando email tras consumir token");
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(successUrl);
}
