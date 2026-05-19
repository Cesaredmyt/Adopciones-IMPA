export const runtime = "nodejs";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresh de sesión en cada request. Llamado por src/middleware.ts SÓLO para
// rutas NO incluidas en PUBLIC_PATHS — es decir, rutas que requieren sesión.
//
// Si no hay sesión válida (server-side getUser → valida firma del JWT contra
// Supabase, no se conforma con la cookie), redirige a /login.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mirror para que el SDK vea el estado nuevo al releer en el mismo
          // ciclo, sin perder los options al propagar al response final.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANTE: getUser() valida el JWT contra Supabase. getSession() sólo lee
  // la cookie y NO autentica nada — nunca usarlo para autorizar.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Preservar destino para post-login redirect (lo aprovechará Fase 2).
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
