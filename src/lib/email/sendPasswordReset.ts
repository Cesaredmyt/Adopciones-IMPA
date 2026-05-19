// Sender importable para el correo de recuperación de contraseña.
// Se llama directamente desde /api/auth/reset-password.
//
// Reemplazar en Fase 5 por React Email + Resend.

import nodemailer from "nodemailer";
import { escapeHtml, safeHttpUrl } from "@/lib/email/safeHtml";

type PasswordResetInput = {
  to: string;
  nombre: string;
  resetUrl: string;
  subject?: string;
};

function buildHtml({ nombre, resetUrl }: { nombre: string; resetUrl: string }) {
  const safeNombre = escapeHtml(nombre);
  const safeUrl = safeHttpUrl(resetUrl);

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #faf6f6; padding: 20px;">
        <table align="center" width="480" style="background-color: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="text-align: center;">
              <img src="https://caamorelia.vercel.app/logo.png"
                alt="Logo IMPA"
                width="120"
                style="margin: 0 auto 10px; display: block;" />
              <h2 style="color: #9B2E45; margin-bottom: 10px; font-weight: 900;">
                Restablecer contraseña
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <p style="color: #333; font-size: 16px;">
                Hola <strong>${safeNombre}</strong>,
              </p>
              <p style="color: #333; font-size: 15px; line-height: 1.6;">
                Recibimos una solicitud para cambiar la contraseña de tu cuenta.
                Si fuiste tú, haz clic en el botón para crear una nueva.
                <br/><strong>El enlace expira en 15 minutos.</strong>
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${safeUrl}"
                  style="background-color: #8B4513; color: white; padding: 14px 26px;
                  text-decoration: none; border-radius: 10px; font-weight: bold;
                  box-shadow: 0 2px 5px rgba(107,30,36,0.3); display: inline-block;">
                  Restablecer contraseña
                </a>
              </p>
              <p style="color: #555; font-size: 14px;">
                Si no solicitaste este cambio, ignora este mensaje — tu contraseña
                actual sigue siendo válida.
              </p>
              <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />
              <p style="text-align: center; color: #888; font-size: 12px; line-height: 1.4;">
                © 2025 Instituto Michoacano de Protección Animal
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendPasswordReset({
  to,
  nombre,
  resetUrl,
  subject = "Restablece tu contraseña – IMPA",
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
