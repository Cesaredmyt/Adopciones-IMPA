// Sender importable para el correo de recuperación de contraseña.
// Se llama directamente desde /api/auth/reset-password.
//
// Reemplazar en Fase 5 por React Email + Resend.

import nodemailer from "nodemailer";
import { escapeHtml, safeHttpUrl } from "@/lib/email/safeHtml";
import { renderImpaEmail } from "@/app/api/email/templates/_layout";

type PasswordResetInput = {
  to: string;
  nombre: string;
  resetUrl: string;
  subject?: string;
};

function buildHtml({ nombre, resetUrl }: { nombre: string; resetUrl: string }) {
  const safeNombre = escapeHtml(nombre);
  const safeUrl = safeHttpUrl(resetUrl);

  return renderImpaEmail({
    tone: "neutral",
    title: "Restablecer contraseña",
    preheader: "Crea una nueva contraseña segura para tu cuenta IMPA.",
    content: `
      <p style="margin:0 0 14px;">Hola <strong>${safeNombre}</strong>,</p>
      <p style="margin:0 0 8px;">
        Recibimos una solicitud para cambiar la contraseña de tu cuenta.
        Si fuiste tú, haz clic en el botón para crear una nueva.
      </p>
      <p style="margin:14px 0 0;font-size:13px;color:#586e58;">
        Si no solicitaste este cambio, ignora este mensaje — tu contraseña
        actual sigue siendo válida.
      </p>
    `,
    cta: { label: "Restablecer contraseña", href: safeUrl },
    ctaHint: "El enlace expira en 15 minutos por seguridad.",
  });
}

export async function sendPasswordReset({
  to,
  nombre,
  resetUrl,
  subject = "Restablece tu contraseña · IMPA",
}: PasswordResetInput): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // TODO Fase 5: TLS estricto con Resend/Postmark.
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: buildHtml({ nombre, resetUrl }),
  });
}
