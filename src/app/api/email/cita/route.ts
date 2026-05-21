import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      email,
      nombre,
      nombreMascota,
      fechaTexto,
      horaTexto,
      lugar,
      notas,
      folio,
    } = await req.json();

    console.log("📨 Solicitud de correo de cita:", {
      email,
      nombre,
      nombreMascota,
      fechaTexto,
      horaTexto,
      lugar,
      folio,
    });

    if (!email || !nombre || !nombreMascota || !fechaTexto || !horaTexto) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos para enviar el correo de cita." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const subject = `📅 Cita confirmada para conocer a ${nombreMascota}`;

    const bodyHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #faf6f6; padding: 20px;">
          <table align="center" width="520" style="background-color: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="text-align: center;">
                <img src="https://impa.vercel.app/logo.png"
                  alt="Logo IMPA"
                  width="120"
                  style="margin: 0 auto 10px; display: block;" />
                <h2 style="color: #0d660d; margin-bottom: 6px; font-weight: 900;">
                  Instituto Michoacano de Protección Animal
                </h2>
              </td>
            </tr>

            <tr>
              <td>
                <p style="color: #333; font-size: 16px;">
                  Hola <strong>${nombre}</strong>,
                </p>

                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Tu <strong>cita ha sido confirmada</strong> para conocer a
                  <strong>${nombreMascota}</strong> 🐾.
                </p>

                <div style="margin: 16px 0; padding: 12px 16px; background-color: #fff7f2; border-radius: 10px; border: 1px solid #f3d0ba;">
                  <p style="margin: 0 0 4px; font-size: 14px; color: #555;">
                    <strong>Fecha:</strong> ${fechaTexto}
                  </p>
                  <p style="margin: 0 0 4px; font-size: 14px; color: #555;">
                    <strong>Hora:</strong> ${horaTexto}
                  </p>
                  ${
                    lugar
                      ? `<p style="margin: 0 0 4px; font-size: 14px; color: #555;">
                          <strong>Lugar:</strong> ${lugar}
                        </p>`
                      : ""
                  }
                  ${
                    folio
                      ? `<p style="margin: 0 0 4px; font-size: 14px; color: #555;">
                          <strong>Folio de cita:</strong> ${folio}
                        </p>`
                      : ""
                  }
                </div>

                ${
                  notas
                    ? `<p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 8px;">
                        <strong>Indicaciones adicionales:</strong><br/>
                        ${notas}
                       </p>`
                    : ""
                }

                <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 16px;">
                  Te pedimos llegar unos minutos antes de tu cita y llevar una identificación oficial.
                </p>

                <p style="color: #777; font-size: 13px; line-height: 1.6; margin-top: 10px;">
                  Si necesitas reprogramar o cancelar tu cita, por favor comunícate con nosotros a la brevedad.
                </p>

                <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

                <p style="text-align: center; color: #888; font-size: 12px; line-height: 1.4;">
                  © 2025 Instituto Michoacano de Protección Animal<br/>
                  Hecho con <span style="color: #f17a36;">❤</span> por el equipo IMPA
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: bodyHtml,
    });

    console.log("✅ Correo de cita enviado a:", email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al enviar correo de cita:", error);
    return NextResponse.json(
      { ok: false, error: "Error al enviar el correo de cita." },
      { status: 500 }
    );
  }
}
