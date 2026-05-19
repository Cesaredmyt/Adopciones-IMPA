import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Guard server-side: garantiza que la request tiene sesión válida.
// Llamable desde RSC, server actions y route handlers.
//
// IMPORTANTE: usa supabase.auth.getUser() — valida el JWT contra Supabase.
// Nunca usar getSession() para autorización: sólo lee la cookie sin verificar.

type RequireSessionOptions = {
  redirectTo?: string;
};

export async function requireSession(
  options: RequireSessionOptions = {}
): Promise<{ user: User }> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(options.redirectTo ?? "/login");
  }

  return { user };
}
