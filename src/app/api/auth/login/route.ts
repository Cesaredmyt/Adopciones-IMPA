import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/auth/schemas/login";
import {
  enforceRateLimit,
  identityWithEmail,
  LIMITS,
} from "@/lib/auth/ratelimit";

export const runtime = "nodejs";

// POST /api/auth/login
// Body: { email: string, password: string }
//
// Login server-side. Devuelve { ok, redirect } con cookies de sesión httpOnly
// seteadas en la response. El cliente refresca y el middleware ve la sesión.
//
// Mensajes uniformes — NO distinguimos "email no existe" vs "password incorrecto"
// para no facilitar enumeración. La única excepción es "email no confirmado",
// que SÍ revelamos para guiar al usuario al flujo de reenvío.

export async function POST(req: Request) {
  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(parsedBody);
  if (!parsed.success) {
    // Mensaje genérico para no filtrar qué campo falló.
    return NextResponse.json(
      { error: "Datos de inicio de sesión inválidos" },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;

  // Rate limit por IP + email — 5 intentos / 15 min.
  const rateLimit = await enforceRateLimit(
    identityWithEmail(req, email),
    LIMITS.login
  );
  if (rateLimit) return rateLimit;

  const cookieStore = await cookies();
  const response = NextResponse.json({ ok: true, redirect: "/" });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Mensaje uniforme. Loggeamos al server-side para análisis.
    console.error("Login fallido");
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  if (!data.user.email_confirmed_at) {
    // Salimos para no dejar cookie de sesión activa con email sin verificar.
    await supabase.auth.signOut();
    return NextResponse.json(
      {
        error:
          "Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
        code: "EMAIL_NOT_CONFIRMED",
      },
      { status: 403 }
    );
  }

  // Lookup de rol server-side para decidir destino. Usamos admin (service-role)
  // para evitar depender de la RLS que aplique a perfiles bajo la sesión nueva.
  const { data: perfil } = await supabaseAdmin
    .from("perfiles")
    .select("rol_id")
    .eq("id", data.user.id)
    .single();

  const redirectPath =
    perfil?.rol_id === 1 ? "/dashboards/administrador" : "/dashboards/usuario";

  // Reescribimos el body de la response preservando las cookies seteadas
  // por el adapter. NextResponse.json(...) no las mantiene si construimos
  // una nueva instancia, por eso clonamos cookies.
  const final = NextResponse.json({ ok: true, redirect: redirectPath });
  response.cookies.getAll().forEach((c) => {
    final.cookies.set(c);
  });
  return final;
}
