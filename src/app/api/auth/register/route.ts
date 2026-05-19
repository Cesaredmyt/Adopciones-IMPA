import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAccountConfirmation } from "@/lib/email/sendAccountConfirmation";
import {
  clientIp,
  enforceRateLimit,
  LIMITS,
} from "@/lib/auth/ratelimit";
import { registerSchema } from "@/lib/auth/schemas/register";
import { issueToken } from "@/lib/auth/tokens";
import { getSiteUrl } from "@/lib/auth/siteUrl";

const VERIFY_TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 h

export async function POST(req: Request) {
  // Rate limit por IP — 3 registros/hora.
  const rateLimit = await enforceRateLimit(clientIp(req), LIMITS.register);
  if (rateLimit) return rateLimit;

  try {
    const raw = await req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de registro inválidos",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // =======================================
    // 1️⃣ CREAR USUARIO EN SUPABASE
    // =======================================
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        user_metadata: {
          nombre: data.nombres,
        },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "No se pudo crear el usuario" },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // =======================================
    // 2️⃣ CREAR PERFIL EN TABLA perfiles
    // =======================================
    const { error: perfilError } = await supabaseAdmin
      .from("perfiles")
      .insert([
        {
          id: userId,
          nombres: data.nombres,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno || null,
          curp: data.curp || null,
          telefono: data.telefono || null,
          fecha_nacimiento: data.fecha_nacimiento || null,
          ocupacion: data.ocupacion || null,
          email: data.email,
          rol_id: 2,
        },
      ]);

    if (perfilError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Error creando perfil: ${perfilError.message}` },
        { status: 400 }
      );
    }

    // =======================================
    // 3️⃣ EMITIR TOKEN PROPIO DE VERIFICACIÓN.
    // Hash en DB, plano sólo en el correo. 24 h, un solo uso.
    // =======================================
    let token: string;
    try {
      const issued = await issueToken({
        userId,
        purpose: "verify_email",
        ttlSeconds: VERIFY_TOKEN_TTL_SECONDS,
        request: req,
      });
      token = issued.token;
    } catch {
      console.error("Fallo emitiendo token de verificación");
      return NextResponse.json(
        { error: "No se pudo generar el link de verificación." },
        { status: 500 }
      );
    }

    const confirmationUrl = `${getSiteUrl()}/api/auth/verify?token=${encodeURIComponent(token)}`;

    // =======================================
    // 4️⃣ ENVIAR CORREO DE CONFIRMACIÓN (server-side).
    // El link NUNCA regresa al cliente.
    // =======================================
    try {
      await sendAccountConfirmation({
        to: data.email,
        nombre: data.nombres,
        confirmationUrl,
      });
    } catch {
      console.error("Fallo enviando correo de confirmación tras registro");
    }

    return NextResponse.json(
      {
        success: true,
        email: data.email,
        nombre: data.nombres,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    console.error("Error general en /api/auth/register");
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
