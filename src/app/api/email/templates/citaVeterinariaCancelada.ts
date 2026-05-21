import { renderImpaEmail, infoBox, petCard } from "./_layout";

export function buildCitaVeterinariaCanceladaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
  motivo,
  fechaTexto,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
  motivo: string;
  fechaTexto: string;
}) {
  const subject = `Cita veterinaria cancelada · ${nombreMascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Te informamos que tu cita veterinaria programada para
      <strong>${fechaTexto}</strong> con <strong>${nombreMascota}</strong> ha sido
      <strong>cancelada</strong>.
    </p>

    ${petCard(nombreMascota, fotoMascota)}

    ${infoBox("Motivo", motivo || "Sin motivo especificado.", { tone: "danger" })}

    <p style="margin:14px 0 0;">
      Puedes volver a agendar otra cita cuando lo desees desde tu panel personal.
    </p>
  `;

  return {
    subject,
    html: renderImpaEmail({
      tone: "danger",
      title: "Cita cancelada",
      preheader: `Visita con ${nombreMascota} cancelada`,
      content,
    }),
  };
}
