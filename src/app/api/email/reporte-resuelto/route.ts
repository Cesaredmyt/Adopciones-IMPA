import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildReporteResueltoEmail } from "../templates/reporteResuelto";

export async function POST(req: Request) {
  try {
    const { email, nombre, folio, resolucion } = await req.json();

    if (!email || !nombre || !folio) {
      return NextResponse.json(
        { error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    const { subject, html } = buildReporteResueltoEmail({
      nombre,
      folio,
      resolucion: resolucion ?? "",
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
    console.error("reporte-resuelto:error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
