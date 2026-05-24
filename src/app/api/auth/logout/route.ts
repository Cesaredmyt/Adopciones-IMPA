import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

// POST /api/auth/logout
//
// Cierra sesión server-side: invalida el token en Supabase y borra las
// cookies httpOnly que el login estableció. El browser-side signOut() no
// puede borrar cookies httpOnly, por eso el logout DEBE pasar por aquí.

export async function POST() {
  const cookieStore = await cookies();

  const response = NextResponse.json({ ok: true });

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

  // Invalida la sesión en Supabase y hace que el SDK borre las cookies
  // de sesión en la respuesta (las mismas que setAll recibe arriba).
  await supabase.auth.signOut();

  // Forzamos expiración inmediata de cualquier cookie de sesión residual
  // por si el SDK no las incluyó todas en setAll.
  cookieStore.getAll().forEach((cookie) => {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("supabase") ||
      cookie.name.includes("auth")
    ) {
      response.cookies.set(cookie.name, "", {
        maxAge: 0,
        path: "/",
      });
    }
  });

  return response;
}
