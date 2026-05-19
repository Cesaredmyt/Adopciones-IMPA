// Interfaz común a los dos backends (Upstash distribuido, memoria local).
//
// Los handlers SIEMPRE consumen esta interfaz — nunca importan Upstash
// directamente. Eso deja swap-able el backend según env vars.

export type RatelimitResult = {
  allowed: boolean;
  remaining: number;
  reset: number; // epoch ms
  limit: number;
};

export type RatelimitConfig = {
  // Identificador del límite (e.g. "auth:login").
  name: string;
  // Ventana de tiempo en segundos.
  windowSeconds: number;
  // Tope de hits permitidos por identidad en la ventana.
  max: number;
};

export interface Limiter {
  check(identity: string, config: RatelimitConfig): Promise<RatelimitResult>;
}
