// Escape mínimo para interpolación en plantillas HTML de correo.
// Sustituye en Fase 5 por render con React-Email / MJML.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

// Devuelve la URL sólo si usa un esquema seguro (http/https) o es relativa al sitio.
// Cualquier otro valor (incluido javascript:, data:, vbscript:) cae a "#".
export function safeHttpUrl(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "#";

  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return escapeHtml(trimmed);

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return escapeHtml(parsed.toString());
    }
  } catch {
    // URL inválida
  }
  return "#";
}
