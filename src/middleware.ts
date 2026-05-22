export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Allowlist explícita de rutas públicas. Cualquier ruta NO listada aquí pasa
// por updateSession() y requiere sesión válida (getUser server-side).
//
// NOTA Fase 6: /dashboards/mascotas es el catálogo público (MascotasPublicPage).
// Conviene moverlo a /mascotas para que /dashboards/* quede uniformemente privado.
const PUBLIC_PATHS = [
  "/",
  "/adopciones",
  "/quienes-somos",
  "/contacto",
  "/login",
  "/register",
  "/recuperacion",
  "/recuperacion/reestablecer_contrasena",
  "/verificar-email",
  "/confirmado",
  "/pendiente",
  "/dashboards/mascotas",
  "/nosotros",
  "/mascota",
  "/reportar-maltrato",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check-email",
  "/api/auth/reset-password",
  "/api/auth/reset/confirm",
  "/api/auth/resend-verification",
  "/api/auth/verify",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /api/email/* puentea el middleware: los 3 endpoints sensibles del flujo
  // auth (registro, reenviar, send) tienen guard server-side propio
  // (x-internal-token). El resto (cita, documento, adopcion-*) sigue abierto
  // hasta Fase 5 — los rediseñamos junto a las plantillas IMPA.
  if (pathname.startsWith("/api/email/")) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
