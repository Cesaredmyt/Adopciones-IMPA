export function buildEsterilizacionCanceladaEmail({
  nombre,
  nombreMascota,
  folio,
  motivo,
  variante,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  motivo: string;
  variante: "cancelada" | "rechazada";
}) {
  const titulo =
    variante === "rechazada"
      ? "Solicitud no aprobada"
      : "Esterilización cancelada";

  const subject = `❗ ${titulo} (${folio})`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#fef6f6; padding:24px;">
      <table align="center" width="560"
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" alt="IMPA"
              style="width:120px; margin-bottom:10px;" />
            <h1 style="color:#9B2E45; font-size:22px; font-weight:900; margin:0;">
              ${titulo}
            </h1>
            <p style="color:#a04059; margin-top:6px;">Folio ${folio}</p>
          </td>
        </tr>

        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              Te informamos que la solicitud de esterilización para
              <strong>${nombreMascota}</strong> ha sido
              <strong>${variante === "rechazada" ? "rechazada" : "cancelada"}</strong>
              por el equipo del IMPA.
            </p>

            <div style="background:#fff3f4; padding:14px; border-left:4px solid #9B2E45; border-radius:10px; margin:18px 0;">
              <p style="margin:0;"><strong>Motivo:</strong> ${motivo}</p>
            </div>

            <p>
              Puedes contactarnos si tienes dudas o deseas reintentar la solicitud
              más adelante.
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
