import { renderImpaEmail, infoBox, petCard } from "./_layout";

export function buildCitaVeterinariaAprobadaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
  fechaTexto,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
  fechaTexto: string;
}) {
  const subject = `Cita veterinaria aprobada · ${nombreMascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu cita veterinaria con <strong>${nombreMascota}</strong> ha sido
      <strong style="color:#11a611;">aprobada</strong>.
    </p>

    ${petCard(nombreMascota, fotoMascota)}

    ${infoBox("Fecha y hora", fechaTexto, { tone: "success" })}

    <p style="margin:14px 0 0;">
      Llega 5 a 10 minutos antes para evitar retrasos. ¡Te esperamos en el IMPA!
    </p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "success",
      title: "Cita aprobada",
      preheader: `Visita con ${nombreMascota}`,
      content,
    }),
  };
}
