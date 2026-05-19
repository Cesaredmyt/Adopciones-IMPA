import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Guard server-side: garantiza sesión + rol permitido.
// Si la sesión falta → redirige a `/login`.
// Si el rol no está permitido → redirige al `fallback` (típicamente el dashboard
// del otro rol). El fallback es OBLIGATORIO porque la decisión de "a dónde mandar
// al usuario equivocado" es específica de cada layout.

export const ROLES = {
  admin: 1,
  usuario: 2,
} as const;

export type RolId = (typeof ROLES)[keyof typeof ROLES];

const KNOWN_ROLES: readonly RolId[] = [ROLES.admin, ROLES.usuario];

type RequireRoleOptions = {
  allow: readonly RolId[];
  fallback: string;
  loginRedirect?: string;
};

export async function requireRole({
  allow,
  fallback,
  loginRedirect = "/login",
}: RequireRoleOptions): Promise<{ user: User; rolId: RolId }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(loginRedirect);
  }

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("rol_id")
    .eq("id", user.id)
    .single();

  if (perfilError || !perfil) {
    // Sesión válida pero perfil ausente. No exponemos por qué; lo tratamos
    // como sesión inválida y forzamos signOut implícito al pasar por login.
    redirect(loginRedirect);
  }

  const rolId = perfil.rol_id as RolId;

  // Rol fuera del catálogo conocido (NULL, 3, ...): evita loop de
  // redirecciones entre dashboards mandando directo a /login.
  if (!KNOWN_ROLES.includes(rolId)) {
    redirect(loginRedirect);
  }

  if (!allow.includes(rolId)) {
    redirect(fallback);
  }

  return { user, rolId };
}
