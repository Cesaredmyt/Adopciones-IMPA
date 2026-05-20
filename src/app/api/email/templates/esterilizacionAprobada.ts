export function buildEsterilizacionAprobadaEmail({
  nombre,
  nombreMascota,
  folio,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
}) {
  const subject = `✅ Esterilización aprobada (${folio})`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#f4faf4; padding:24px;">
      <table align="center" width="560"
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" alt="IMPA"
              style="width:120px; margin-bottom:10px;" />
            <h1 style="color:#16793f; font-size:24px; font-weight:900; margin:0;">
              ¡Esterilización aprobada!
            </h1>
            <p style="color:#1f8347; margin-top:6px;">Folio ${folio}</p>
          </td>
        </tr>

        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              ¡Buenas noticias! Tu solicitud para
              <strong>${nombreMascota}</strong> ha sido aprobada por el equipo veterinario del IMPA.
            </p>
            <p>
              Próximo paso: te informaremos por correo cuando asignemos
              fecha y hora para la cirugía.
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
