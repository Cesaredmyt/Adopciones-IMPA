// Sender importable para el correo de confirmación de cuenta.
// Se llama directamente desde route handlers / server actions del flujo auth.
// El endpoint HTTP /api/email/registro queda como wrapper protegido por
// x-internal-token (legacy callers).
//
// Reemplazar en Fase 5 por React Email + transactional provider (Resend).

import nodemailer from "nodemailer";
import { escapeHtml, safeHttpUrl } from "@/lib/email/safeHtml";
import { renderImpaEmail } from "@/app/api/email/templates/_layout";

type AccountConfirmationInput = {
  to: string;
  nombre: string;
  confirmationUrl: string;
  subject?: string;
};

function buildHtml({
  nombre,
  confirmationUrl,
}: {
  nombre: string;
  confirmationUrl: string;
}) {
  const safeNombre = escapeHtml(nombre);
  const safeUrl = safeHttpUrl(confirmationUrl);

  return renderImpaEmail({
    tone: "success",
    title: "Confirma tu cuenta",
    preheader: "Activa tu cuenta IMPA para empezar a adoptar.",
    content: `
      <p style="margin:0 0 14px;">Hola <strong>${safeNombre}</strong>,</p>
      <p style="margin:0 0 8px;">
        Gracias por crear tu cuenta en IMPA. Confirma tu correo electrónico
        haciendo clic en el botón para activar tu acceso.
      </p>
      <p style="margin:14px 0 0;font-size:13px;color:#586e58;">
        Si tú no creaste esta cuenta, puedes ignorar este mensaje.
      </p>
    `,
    cta: { label: "Confirmar cuenta", href: safeUrl },
    ctaHint: "Este enlace expira en 24 horas.",
  });
}

export async function sendAccountConfirmation({
  to,
  nombre,
  confirmationUrl,
  subject = "Confirma tu cuenta · IMPA",
}: AccountConfirmationInput): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // TODO Fase 5: validar TLS al migrar a Resend/Postmark.
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: buildHtml({ nombre, confirmationUrl }),
  });
}
