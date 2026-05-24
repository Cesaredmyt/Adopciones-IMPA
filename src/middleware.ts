export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ─── Categorías de rutas ────────────────────────────────────────────────────

/** Sólo admin (rol 1). Cualquier otra sesión → dashboard usuario. */
const ADMIN_PATHS = ["/dashboards/administrador"];

/** Sólo usuario (rol 2). Cualquier otra sesión → dashboard admin. */
const USER_PATHS = ["/dashboards/usuario"];

/**
 * Rutas de autenticación: si ya tienes sesión, no tiene sentido estar aquí
 * → redirige a tu dashboard.
 */
const AUTH_PAGES = [
  "/login",
  "/register",
  "/recuperacion",
  "/verificar-email",
  "/confirmado",
  "/pendiente",
];

/**
 * Rutas públicas que, si estás autenticado, redirigen a tu dashboard.
 * No tiene sentido navegar por la web pública cuando ya tienes sesión.
 */
const PUBLIC_REDIRECT_PATHS = [
  "/",
  "/adopciones",
  "/quienes-somos",
  "/contacto",
  "/nosotros",
  "/dashboards/mascotas",
  "/reportar-maltrato",
];

/**
 * Rutas públicas que siempre son accesibles sin importar el estado de sesión
 * (links de QR, reportar seguimiento, etc.).
 */
const ALWAYS_PUBLIC = [
  "/mascota",
  "/reportar-maltrato/seguimiento",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function matchPath(pathname: string, paths: string[]) {
  return paths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// ─── Middleware ──────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Las API routes de auth y de email las dejamos pasar siempre.
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/email/")) {
    return NextResponse.next();
  }

  // Rutas siempre públicas (QR, seguimiento público, etc.)
  if (matchPath(pathname, ALWAYS_PUBLIC)) {
    return NextResponse.next();
  }

  // ── Creamos el cliente Supabase para leer/refrescar la sesión ──────────────
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
          // Propaga el refresh de tokens al response final.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() valida el JWT contra Supabase (no se conforma con la cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Cookie de rol seteada en /api/auth/login. Evita DB call en cada request.
  const roleStr = request.cookies.get("impa-role")?.value;
  const isAdmin   = roleStr === "1";
  const isUsuario = roleStr === "2";

  const isAdminPath   = matchPath(pathname, ADMIN_PATHS);
  const isUserPath    = matchPath(pathname, USER_PATHS);
  const isDashboard   = isAdminPath || isUserPath;
  const isAuthPage    = matchPath(pathname, AUTH_PAGES);
  const isPublicPage  = matchPath(pathname, PUBLIC_REDIRECT_PATHS);

  // ─── Sin sesión ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    if (isDashboard) {
      // Intento de acceder a un dashboard sin sesión → login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Cualquier otra ruta pública: dejar pasar
    return response;
  }

  // ─── Con sesión ────────────────────────────────────────────────────────────

  const dashboardDest = isAdmin
    ? "/dashboards/administrador"
    : "/dashboards/usuario";

  // Páginas de auth (login, register, etc.) → ya tienes sesión, ve a tu dashboard
  if (isAuthPage) {
    return NextResponse.redirect(new URL(dashboardDest, request.url));
  }

  // Rutas públicas generales → ya tienes sesión, ve a tu dashboard
  if (isPublicPage) {
    return NextResponse.redirect(new URL(dashboardDest, request.url));
  }

  // Dashboard del rol incorrecto → redirige al correcto
  if (isAdminPath && isUsuario) {
    return NextResponse.redirect(
      new URL("/dashboards/usuario", request.url)
    );
  }
  if (isUserPath && isAdmin) {
    return NextResponse.redirect(
      new URL("/dashboards/administrador", request.url)
    );
  }

  // Todo ok: devuelve el response con los tokens refrescados si aplica
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
