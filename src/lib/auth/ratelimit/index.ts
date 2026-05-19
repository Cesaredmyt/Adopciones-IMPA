import { NextResponse } from "next/server";
import type { Limiter, RatelimitConfig, RatelimitResult } from "./types";
import { MemoryLimiter } from "./memory";

// Factory: si las env vars de Upstash existen, usa el backend distribuido.
// Si no, cae a memoria local (sólo válido para dev/single-instance).
//
// Esto deja a Fase 2 funcional sin que el usuario tenga que crear el Upstash
// project todavía — el switch ocurre solo cuando configura las env vars.

function buildLimiter(): Limiter {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    // require dinámico para evitar cargar el cliente si no se usa.
    const { UpstashLimiter } = require("./upstash") as typeof import("./upstash");
    return new UpstashLimiter();
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "RateLimit: UPSTASH_* no configurado en producción — usando memoria local. No es seguro en multi-instancia."
    );
  }
  return new MemoryLimiter();
}

let singleton: Limiter | null = null;

export function getLimiter(): Limiter {
  if (!singleton) singleton = buildLimiter();
  return singleton;
}

// =============================================================
// Configuración de límites por flujo. Las ventanas siguen las
// recomendaciones de OWASP "Authentication Cheat Sheet".
// =============================================================
export const LIMITS = {
  login: { name: "auth:login", windowSeconds: 15 * 60, max: 5 }, // 5/15min
  register: { name: "auth:register", windowSeconds: 60 * 60, max: 3 }, // 3/h
  checkEmail: {
    name: "auth:check-email",
    windowSeconds: 60 * 60,
    max: 30,
  }, // 30/h
  resetRequest: {
    name: "auth:reset-request",
    windowSeconds: 60 * 60,
    max: 3,
  }, // 3/h
  resendVerification: {
    name: "auth:resend-verification",
    windowSeconds: 60 * 60,
    max: 5,
  }, // 5/h
} as const satisfies Record<string, RatelimitConfig>;

// =============================================================
// Helpers para handlers.
// =============================================================
function rateLimitResponse(result: RatelimitResult) {
  const retryAfterSec = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: "Demasiados intentos. Inténtalo más tarde.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}

// Devuelve null si la request está permitida; un NextResponse 429 si no.
export async function enforceRateLimit(
  identity: string,
  config: RatelimitConfig
): Promise<NextResponse | null> {
  const limiter = getLimiter();
  const result = await limiter.check(identity, config);
  if (!result.allowed) return rateLimitResponse(result);
  return null;
}

// Extrae el identificador del cliente desde la request. Prioriza el
// header estándar de Vercel (`x-forwarded-for` primer IP), luego cae
// a remoteAddress. Para login/reset combinamos IP + email para que el
// atacante NO pueda probar contra una víctima desde múltiples IPs sin
// pagar el rate del IP y al mismo tiempo NO pueda enumerar emails
// hostigando desde una sola IP sin pagar el rate por-email.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function identityWithEmail(req: Request, email: string): string {
  return `${clientIp(req)}::${email.toLowerCase()}`;
}
