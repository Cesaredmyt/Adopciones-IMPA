import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Limiter, RatelimitConfig, RatelimitResult } from "./types";

// Backend Upstash (sliding-window distribuido). Único válido para serverless
// multi-instancia. Requiere env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

const redis = Redis.fromEnv();

// Cache de instancias por config (Ratelimit reusa connections internamente).
const cache = new Map<string, Ratelimit>();

function getLimiter(config: RatelimitConfig): Ratelimit {
  const key = `${config.name}:${config.max}:${config.windowSeconds}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.max, `${config.windowSeconds} s`),
    analytics: false,
    prefix: `rl:${config.name}`,
  });
  cache.set(key, limiter);
  return limiter;
}

export class UpstashLimiter implements Limiter {
  async check(
    identity: string,
    config: RatelimitConfig
  ): Promise<RatelimitResult> {
    const limiter = getLimiter(config);
    const result = await limiter.limit(identity);
    return {
      allowed: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  }
}
