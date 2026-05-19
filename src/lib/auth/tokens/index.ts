// Emisión y consumo de tokens propios hasheados (tabla public.auth_tokens).
//
// Diseño:
//  - 256 bits de entropía (`randomBytes(32)`) codificados como base64url.
//  - En la DB sólo se guarda sha256(token) — el token plano NUNCA se persiste.
//  - Un solo uso: consumeToken hace un UPDATE atómico con WHERE used_at IS NULL.
//  - Si dos requests intentan consumir el mismo token a la vez, sólo una hace
//    el UPDATE exitoso; la otra recibe 0 filas → token inválido (PostgreSQL
//    serializa los UPDATE sobre la misma fila por su lock interno).
//  - Cuando se emite un token nuevo, invalidamos los anteriores del mismo
//    (user_id, purpose) marcándolos como usados → impide acumular tokens
//    activos por si uno previo se filtró.

import { createHash, randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type TokenPurpose = "verify_email" | "password_reset";

const TOKEN_BYTE_LENGTH = 32; // 256 bits — overkill seguro.

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function generateToken(): { token: string; hash: string } {
  const token = randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
  return { token, hash: hashToken(token) };
}

// Lee IP y user-agent de una Request para audit.
function readClientHints(req?: Request): {
  ip_origin: string | null;
  user_agent: string | null;
} {
  if (!req) return { ip_origin: null, user_agent: null };

  const xff = req.headers.get("x-forwarded-for");
  let ip: string | null = null;
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && first !== "unknown") ip = first;
  }
  if (!ip) {
    const realIp = req.headers.get("x-real-ip");
    if (realIp && realIp !== "unknown") ip = realIp;
  }

  const ua = req.headers.get("user-agent");

  return { ip_origin: ip, user_agent: ua ?? null };
}

type IssueTokenInput = {
  userId: string;
  purpose: TokenPurpose;
  ttlSeconds: number; // p.e. 900 = 15 min
  request?: Request;
};

// Emite un token nuevo para (userId, purpose). Invalida tokens previos vivos
// del mismo (userId, purpose). Devuelve el token plano para incluirlo en la URL
// del correo — sólo este momento existe en memoria; nunca se vuelve a obtener.
export async function issueToken({
  userId,
  purpose,
  ttlSeconds,
  request,
}: IssueTokenInput): Promise<{ token: string }> {
  // Invalida tokens vivos previos del mismo user+purpose (defensa contra
  // que un token filtrado siga siendo válido tras "reenviar correo").
  await supabaseAdmin
    .from("auth_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("purpose", purpose)
    .is("used_at", null);

  const { token, hash } = generateToken();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const audit = readClientHints(request);

  const { error } = await supabaseAdmin.from("auth_tokens").insert({
    user_id: userId,
    purpose,
    token_hash: hash,
    expires_at: expiresAt,
    ip_origin: audit.ip_origin,
    user_agent: audit.user_agent,
  });

  if (error) {
    throw new Error(`No se pudo emitir el token: ${error.message}`);
  }

  return { token };
}

type ConsumeTokenResult =
  | { ok: true; userId: string }
  | { ok: false };

// Consume el token plano: hash → UPDATE atómico con guardas. Si la fila no
// existe / expiró / ya fue usada, devuelve { ok: false } sin distinguir el
// motivo (no enumeramos estado para el atacante).
export async function consumeToken(
  token: string,
  purpose: TokenPurpose
): Promise<ConsumeTokenResult> {
  if (typeof token !== "string" || token.length < 20 || token.length > 200) {
    return { ok: false };
  }

  const hash = hashToken(token);
  const nowIso = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("auth_tokens")
    .update({ used_at: nowIso })
    .eq("token_hash", hash)
    .eq("purpose", purpose)
    .is("used_at", null)
    .gt("expires_at", nowIso)
    .select("user_id")
    .maybeSingle();

  if (error || !data) return { ok: false };

  return { ok: true, userId: data.user_id as string };
}
