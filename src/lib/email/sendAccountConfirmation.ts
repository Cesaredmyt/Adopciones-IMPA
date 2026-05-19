// Sender importable para el correo de confirmación de cuenta.
// Se llama directamente desde route handlers / server actions del flujo auth.
// El endpoint HTTP /api/email/registro queda como wrapper protegido por
// x-internal-token (legacy callers).
//
// Reemplazar en Fase 5 por React Email + transactional provider (Resend).

import nodemailer from "nodemailer";
import { escapeHtml, safeHttpUrl } from "@/lib/email/safeHtml";

type AccountConfirmationInput = {
  to: string;
  nombre: string;
  confirmationUrl: string;
  subject?: string;
};

function buildHtml({ nombre, confirmationUrl }: { nombre: string; confirmationUrl: string }) {
  const safeNombre = escapeHtml(nombre);
  const safeUrl = safeHttpUrl(confirmationUrl);

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
                Instituto Michoacano de Protección Animal
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <p style="color: #333; font-size: 16px;">
                Hola <strong>${safeNombre}</strong>,
              </p>
              <p style="color: #333; font-size: 15px; line-height: 1.6;">
                Confirma tu correo electrónico haciendo clic en el botón.
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${safeUrl}"
                  style="background-color: #8B4513; color: white; padding: 14px 26px;
                  text-decoration: none; border-radius: 10px; font-weight: bold;
                  box-shadow: 0 2px 5px rgba(107,30,36,0.3); display: inline-block;">
                  Confirmar cuenta
                </a>
              </p>
              <p style="color: #555; font-size: 14px;">
                Si tú no creaste esta cuenta, puedes ignorar este mensaje.
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

export async function sendAccountConfirmation({
  to,
  nombre,
  confirmationUrl,
  subject = "Confirmación de cuenta – IMPA 🐾",
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
