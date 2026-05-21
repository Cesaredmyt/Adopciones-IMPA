import { renderImpaEmail, infoBox } from "./_layout";

export function buildEsterilizacionAprobadaEmail({
  nombre,
  nombreMascota,
  folio,
}: {
  nombre: string;
  nombreMascota: string;
  folio: string;
}) {
  const subject = `Esterilización aprobada · Folio ${folio}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      ¡Buenas noticias! Tu solicitud para <strong>${nombreMascota}</strong> ha sido
      <strong style="color:#11a611;">aprobada</strong> por el equipo veterinario del IMPA.
    </p>

    ${infoBox("Folio", folio, { tone: "success" })}

    <p style="margin:14px 0 0;">
      <strong>Próximo paso:</strong> te informaremos por correo cuando asignemos
      fecha y hora para la cirugía.
    </p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "success",
      title: "¡Esterilización aprobada!",
      preheader: `Folio ${folio} aprobado.`,
      content,
    }),
  };
}
