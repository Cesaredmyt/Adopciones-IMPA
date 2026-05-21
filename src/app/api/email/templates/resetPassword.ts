import { escapeHtml, safeHttpUrl } from "@/lib/email/safeHtml";
import { renderImpaEmail } from "./_layout";

type ResetPasswordData = {
  nombre?: string;
  url?: string;
};

export default function resetPassword({ nombre, url }: ResetPasswordData) {
  const safeNombre = escapeHtml(nombre);
  const safeUrl = safeHttpUrl(url);

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${safeNombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta IMPA.
      Haz clic en el siguiente botón para crear una nueva.
    </p>

    <p style="margin:18px 0 6px;font-size:12px;color:#638863;">
      Este enlace expira en 60 minutos por seguridad.
    </p>
    <p style="margin:14px 0 0;font-size:13px;color:#586e58;">
      Si no solicitaste este cambio, ignora este mensaje — tu contraseña actual
      seguirá activa.
    </p>
  `;

  return {
    subject: "Restablece tu contraseña · IMPA",
    body: renderImpaEmail({
      tone: "neutral",
      title: "Restablecer contraseña",
      preheader: "Crea una nueva contraseña segura para tu cuenta.",
      content,
      cta: { label: "Restablecer contraseña", href: safeUrl },
      ctaHint: "Si el botón no funciona, copia y pega el enlace en tu navegador.",
    }),
  };
}
