/**
 * Layout base compartido para todos los correos IMPA.
 * Diseño moderno, responsive y compatible con clientes de correo (Gmail, Outlook, etc).
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://impa.vercel.app";

export type ImpaEmailTone = "success" | "danger" | "warning" | "info" | "neutral";

const TONE: Record<
  ImpaEmailTone,
  { accent: string; soft: string; emoji: string; label: string }
> = {
  success: { accent: "#17cf17", soft: "#ecfdec", emoji: "✓", label: "Aprobado" },
  danger:  { accent: "#dc2626", soft: "#fee2e2", emoji: "✕", label: "Rechazado" },
  warning: { accent: "#d97706", soft: "#fef3c7", emoji: "!", label: "Atención" },
  info:    { accent: "#0284c7", soft: "#e0f2fe", emoji: "i", label: "Información" },
  neutral: { accent: "#586e58", soft: "#f0f4f0", emoji: "•", label: "IMPA" },
};

export interface ImpaEmailOptions {
  /** Tono visual del correo (color del header). */
  tone?: ImpaEmailTone;
  /** Título grande del correo. */
  title: string;
  /** Subtítulo opcional bajo el título. */
  preheader?: string;
  /** Contenido HTML principal del correo. */
  content: string;
  /** CTA opcional (botón). */
  cta?: { label: string; href: string };
  /** Texto pequeño debajo del CTA. */
  ctaHint?: string;
}

/**
 * Genera el HTML completo de un correo IMPA con layout consistente.
 */
export function renderImpaEmail({
  tone = "neutral",
  title,
  preheader,
  content,
  cta,
  ctaHint,
}: ImpaEmailOptions): string {
  const t = TONE[tone];

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f8f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111811;">
  ${
    preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;mso-hide:all;">${escapeHtml(
          preheader
        )}</div>`
      : ""
  }

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dce5dc;box-shadow:0 4px 12px -2px rgba(17,24,17,0.06);">

          <!-- HEADER -->
          <tr>
            <td style="background:${t.accent};padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;padding-right:10px;">
                          <div style="width:36px;height:36px;border-radius:10px;background:#ffffff;display:inline-block;text-align:center;line-height:36px;font-size:20px;">🐾</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;line-height:1;">IMPA</div>
                          <div style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.85);margin-top:2px;line-height:1;">Instituto Michoacano de Protección Animal</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 36px 8px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111811;line-height:1.25;letter-spacing:-0.5px;">${escapeHtml(
                title
              )}</h1>
              ${
                preheader
                  ? `<p style="margin:0 0 24px;font-size:15px;color:#586e58;line-height:1.5;">${escapeHtml(
                      preheader
                    )}</p>`
                  : '<div style="height:12px;"></div>'
              }
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 28px;font-size:15px;color:#3a4a3a;line-height:1.65;">
              ${content}

              ${
                cta
                  ? `
                <div style="margin:28px 0 4px;">
                  <a href="${cta.href}" style="display:inline-block;padding:13px 24px;background:#17cf17;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;box-shadow:0 1px 3px rgba(17,24,17,0.08);">
                    ${escapeHtml(cta.label)}
                  </a>
                </div>
                ${
                  ctaHint
                    ? `<p style="margin:8px 0 0;font-size:12px;color:#638863;">${escapeHtml(
                        ctaHint
                      )}</p>`
                    : ""
                }
              `
                  : ""
              }
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 36px;">
              <div style="height:1px;background:#dce5dc;"></div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 36px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#638863;line-height:1.5;">
                    <strong style="color:#111811;">IMPA · Morelia, Michoacán</strong><br/>
                    Álamos No. 395, Col. Centenario, C.P. 58128<br/>
                    Tel. 443 321 4731
                  </td>
                  <td align="right" style="font-size:12px;color:#638863;">
                    <a href="${SITE_URL}" style="color:#11a611;text-decoration:none;font-weight:600;">impa.gob.mx</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0;font-size:11px;color:#638863;text-align:center;">
          © ${new Date().getFullYear()} IMPA · Correo automático, por favor no respondas.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Helpers reutilizables para construir contenido dentro de los correos.
 */

export function infoBox(
  label: string,
  value: string,
  options?: { tone?: ImpaEmailTone }
): string {
  const t = TONE[options?.tone ?? "neutral"];
  return `
    <div style="margin:16px 0;padding:14px 16px;background:${t.soft};border-left:3px solid ${t.accent};border-radius:8px;">
      <div style="font-size:11px;font-weight:700;color:${t.accent};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">${escapeHtml(
        label
      )}</div>
      <div style="font-size:14px;color:#111811;font-weight:500;">${value}</div>
    </div>
  `;
}

export function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f4f0;">
        <div style="font-size:11px;font-weight:700;color:#638863;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:2px;">${escapeHtml(
          label
        )}</div>
        <div style="font-size:14px;color:#111811;">${value}</div>
      </td>
    </tr>
  `;
}

export function detailsTable(rows: Array<{ label: string; value: string }>): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
      ${rows.map((r) => detailRow(r.label, r.value)).join("")}
    </table>
  `;
}

export function petCard(name: string, photoUrl?: string): string {
  if (!photoUrl) return "";
  return `
    <div style="margin:12px 0 20px;padding:14px;background:#f6f8f6;border-radius:14px;border:1px solid #dce5dc;text-align:center;">
      <img src="${photoUrl}" alt="${escapeHtml(
    name
  )}" style="width:200px;height:200px;border-radius:14px;object-fit:cover;border:4px solid #ffffff;box-shadow:0 4px 12px -2px rgba(17,24,17,0.10);"/>
      <div style="margin-top:10px;font-size:13px;font-weight:700;color:#111811;letter-spacing:-0.2px;">${escapeHtml(
        name
      )}</div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
