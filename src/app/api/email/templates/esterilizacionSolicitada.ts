export function buildEsterilizacionSolicitadaEmail({
  nombre,
  nombreMascota,
  folio,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
}) {
  const subject = `🐾 Solicitud de esterilización recibida (${folio})`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:24px;">
      <table align="center" width="560"
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" alt="IMPA"
              style="width:120px; margin-bottom:10px;" />
            <h1 style="color:#8B4513; font-size:24px; font-weight:900; margin:0;">
              Solicitud recibida
            </h1>
            <p style="color:#BC5F36; margin-top:6px;">Folio ${folio}</p>
          </td>
        </tr>

        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              Recibimos tu solicitud de esterilización para
              <strong>${nombreMascota}</strong>. Nuestro equipo veterinario la
              revisará y te avisará por correo cuando esté aprobada y agendada.
            </p>

            <div style="background:#fff4e7; padding:14px; border-left:4px solid #BC5F36; border-radius:10px; margin:18px 0;">
              <p style="margin:0;">
                Mientras tanto, puedes revisar el estado en tu panel:
                <strong>Mis mascotas · Esterilizaciones</strong>.
              </p>
            </div>

            <p>Gracias por cuidar de tu peludito. 🐾</p>
          </td>
        </tr>

        <tr>
          <td style="text-align:center; padding-top:26px; font-size:12px; color:#999;">
            © ${new Date().getFullYear()} IMPA Morelia · Correo automático
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return { subject, html };
}
