import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildReporteEnInvestigacionEmail } from "../templates/reporteEnInvestigacion";

export async function POST(req: Request) {
  try {
    const { email, nombre, folio } = await req.json();

    if (!email || !nombre || !folio) {
      return NextResponse.json(
        { error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    const { subject, html } = buildReporteEnInvestigacionEmail({
      nombre,
      folio,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reporte-en-investigacion:error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
