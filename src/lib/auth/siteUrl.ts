// Resuelve la URL base del sitio para construir URLs absolutas en correos.
// Orden:
//   1. NEXT_PUBLIC_SITE_URL          (configurable explícita)
//   2. process.env.VERCEL_URL        (en Vercel; sin protocolo)
//   3. http://localhost:3000         (fallback dev)
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
