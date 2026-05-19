import type { Limiter, RatelimitConfig, RatelimitResult } from "./types";

// Backend in-memory para desarrollo y como fallback si Upstash NO está
// configurado. NO sirve para serverless multi-instancia (cada lambda tiene
// su propio Map). Pero protege contra bots ingenuos en single-instance.
//
// Algoritmo: ventana fija. Para Fase 2 alcanza; si necesitamos algo más
// estricto migramos a sliding-window en Upstash (ya viene en la lib).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function bucketKey(identity: string, name: string): string {
  return `${name}::${identity}`;
}

export class MemoryLimiter implements Limiter {
  async check(
    identity: string,
    config: RatelimitConfig
  ): Promise<RatelimitResult> {
    const key = bucketKey(identity, config.name);
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const reset = now + config.windowSeconds * 1000;
      buckets.set(key, { count: 1, resetAt: reset });
      return {
        allowed: true,
        remaining: config.max - 1,
        reset,
        limit: config.max,
      };
    }

    existing.count += 1;
    const allowed = existing.count <= config.max;
    return {
      allowed,
      remaining: Math.max(0, config.max - existing.count),
      reset: existing.resetAt,
      limit: config.max,
    };
  }
}
