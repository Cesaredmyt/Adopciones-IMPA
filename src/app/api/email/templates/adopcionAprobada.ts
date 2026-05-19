export function buildAdopcionAprobadaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
}) {
  const subject = `🎉 ¡Tu adopción de ${nombreMascota} ha sido aprobada!`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:24px;">

      <table align="center" width="560" 
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <!-- LOGO -->
        <tr>
          <td style="text-align:center;">
            <img 
              src="https://caamorelia.vercel.app/logo.png" 
              alt="Logo IMPA"
              style="width:120px; margin-bottom:10px;"
            />
          </td>
        </tr>

        <!-- TITULO PRINCIPAL -->
        <tr>
          <td style="text-align:center;">
            <h1 style="color:#9B2E45; font-size:30px; font-weight:900; margin-bottom:4px;">
              ¡Adopción aprobada!
            </h1>
            <h3 style="color:#c74b63; font-size:18px; margin-top:0;">
              ¡Felicidades! Tu nueva mascota te está esperando 🐾❤️
            </h3>
          </td>
        </tr>

        <!-- FOTO DE LA MASCOTA -->
        <tr>
          <td style="text-align:center; padding-top:10px;">
            <img 
              src="${fotoMascota}"
              alt="${nombreMascota}"
              style="width:260px; height:260px; border-radius:20px; object-fit:cover; margin-bottom:20px; border:4px solid #9B2E45;" 
            />
          </td>
        </tr>

        <!-- SUBTITULO -->
        <tr>
          <td style="text-align:center;">
            <p style="color:#666; font-size:15px; margin-top:-5px;">
              Gracias por darle un hogar a <strong>${nombreMascota}</strong> 🐶❤️
            </p>
          </td>
        </tr>

        <!-- MENSAJE -->
        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              ¡Nos da mucho gusto informarte que tu proceso de adopción de 
              <strong>${nombreMascota}</strong> ha sido <strong style="color:#9B2E45;">aprobado</strong>!
            </p>

            <p>Ahora puedes acudir al <strong>IMPA</strong> para recoger a tu nuevo compañero de vida.</p>

            <div style="background:#fff4f4; padding:16px; border-radius:12px; margin:18px 0; border-left:6px solid #9B2E45;">
              <p style="margin:0; font-size:15px;">
                <strong>📍 Requisitos:</strong><br/>
                • Llevar una identificación oficial (INE).<br/>
                • Presentarse en el horario laboral:<br/>
                &nbsp;&nbsp;&nbsp;👉 <strong>8:00 AM – 2:00 PM</strong>, cualquier día.
              </p>
            </div>

            <p>
              Este correo incluye tu <strong>Certificado Oficial de Adopción</strong> en formato PDF.
            </p>

            <p>
              ¡Gracias por cambiarle la vida a <strong>${nombreMascota}</strong>! ❤️
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="text-align:center; padding-top:26px; font-size:12px; color:#999;">
            © ${new Date().getFullYear()} IMPA Morelia · Correo automático
          </td>
        </tr>

      </table>
    </body>
  </html>`;

  return { subject, html };
}
