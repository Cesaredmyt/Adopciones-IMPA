export function buildEsterilizacionProgramadaEmail({
  nombre,
  nombreMascota,
  folio,
  fechaTexto,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  fechaTexto: string;
}) {
  const subject = `📅 Esterilización programada (${folio})`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#f4f6fa; padding:24px;">
      <table align="center" width="560"
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" alt="IMPA"
              style="width:120px; margin-bottom:10px;" />
            <h1 style="color:#1d4ed8; font-size:24px; font-weight:900; margin:0;">
              Cirugía programada
            </h1>
            <p style="color:#2563eb; margin-top:6px;">Folio ${folio}</p>
          </td>
        </tr>

        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              La esterilización de <strong>${nombreMascota}</strong> ha sido
              programada para:
            </p>

            <div style="background:#eef4ff; padding:16px; border-left:4px solid #2563eb; border-radius:10px; margin:18px 0;">
              <p style="margin:0; font-size:16px;">
                <strong>📅 ${fechaTexto}</strong>
              </p>
            </div>

            <p>
              Recuerda llevar a tu mascota en ayuno de al menos 8 horas y
              llegar 15 minutos antes de la hora indicada.
            </p>
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
