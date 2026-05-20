export function buildEsterilizacionCompletadaEmail({
  nombre,
  nombreMascota,
  folio,
  estado,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
  estado: "completada" | "complicacion";
}) {
  const exitosa = estado === "completada";
  const subject = exitosa
    ? `🎉 Esterilización completada (${folio})`
    : `⚠️ Esterilización con observaciones (${folio})`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:24px;">
      <table align="center" width="560"
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" alt="IMPA"
              style="width:120px; margin-bottom:10px;" />
            <h1 style="color:${
              exitosa ? "#16793f" : "#b54708"
            }; font-size:24px; font-weight:900; margin:0;">
              ${exitosa ? "Cirugía exitosa" : "Cirugía con observaciones"}
            </h1>
            <p style="color:${
              exitosa ? "#1f8347" : "#a55205"
            }; margin-top:6px;">Folio ${folio}</p>
          </td>
        </tr>

        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6; padding-top:10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              La esterilización de <strong>${nombreMascota}</strong> ha
              finalizado${exitosa ? " satisfactoriamente." : ", pero presentó observaciones clínicas relevantes."}
            </p>
            <p>
              Puedes consultar el expediente clínico desde tu panel:
              <strong>Mis mascotas · Esterilizaciones</strong>.
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
