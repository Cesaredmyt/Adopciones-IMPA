// @ts-check

export default function citaVeterinaria({ nombre, mascota, fecha, hora }) {
  return {
    subject: `Cita veterinaria confirmada – ${mascota} 🐾`,
    body: `
      <html>
      <body style="font-family:Arial;background:#faf6f6;padding:20px;">

        <table align="center" width="480"
          style="background:#fff;border-radius:14px;padding:30px;">

          <tr><td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" width="120"/>
            <h2 style="color:#9B2E45;font-weight:900;">
              Cita veterinaria confirmada
            </h2>
          </td></tr>

          <tr><td>

            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              Tu cita veterinaria para <strong>${mascota}</strong> ha sido confirmada.
            </p>

            <p>
              <strong>📅 Fecha:</strong> ${fecha}<br/>
              <strong>⏰ Hora:</strong> ${hora}
            </p>

            <p style="color:#555;">
              Recuerda llegar 10 minutos antes.
            </p>

            <hr style="margin:25px 0;border-top:1px solid #eee;">
            <p style="text-align:center;color:#888;font-size:12px;">
              © IMPA – Instituto Michoacano de Protección Animal
            </p>

          </td></tr>

        </table>

      </body>
      </html>
    `,
  };
}
