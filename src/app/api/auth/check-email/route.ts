import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  clientIp,
  enforceRateLimit,
  LIMITS,
} from "@/lib/auth/ratelimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/auth/check-email
// Body: { email?: string } | { curp: string, action: "check-curp" }
//
// Endpoint de UX para el wizard de registro: permite mostrar "este correo /
// CURP ya está registrado" sin esperar a submit final. Es un endpoint de
// enumeración por diseño, mitigado con rate-limit duro por IP. En Fase 6
// se evaluará reemplazarlo por validación de unicidad sólo en /api/auth/register.
//
// La consulta de email usa `perfiles.email` (con índice) en vez de
// listUsers() que paginaba sobre auth.users — O(1) en vez de O(N).

export async function POST(request: NextRequest) {
  const rateLimit = await enforceRateLimit(clientIp(request), LIMITS.checkEmail);
  if (rateLimit) return rateLimit;

  try {
    const body = await request.json().catch(() => ({}));
    const { email, curp, action } = body ?? {};

    // ============================================================
    // Verificación de CURP
    // ============================================================
    if (action === "check-curp") {
      if (typeof curp !== "string" || curp.length !== 18) {
        return NextResponse.json(
          { error: "CURP inválido" },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("perfiles")
        .select("id")
        .eq("curp", curp.toUpperCase())
        .limit(1);

      if (error) {
        return NextResponse.json(
          { error: "Error al verificar CURP" },
          { status: 500 }
        );
      }

      const exists = !!(data && data.length > 0);
      return NextResponse.json({ exists, available: !exists });
    }

    // ============================================================
    // Verificación de email (default)
    // ============================================================
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("perfiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Error al verificar email" },
        { status: 500 }
      );
    }

    const exists = !!(data && data.length > 0);
    return NextResponse.json({ exists, available: !exists });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
