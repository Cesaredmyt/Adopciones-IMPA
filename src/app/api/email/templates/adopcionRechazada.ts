import { renderImpaEmail, infoBox, petCard } from "./_layout";

export function buildAdopcionRechazadaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
  motivo,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
  motivo: string;
}) {
  const subject = `Actualización sobre la adopción de ${nombreMascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>

    <p style="margin:0 0 14px;">
      Agradecemos sinceramente tu interés en adoptar a <strong>${nombreMascota}</strong>.
      Después de revisar tu solicitud con detalle, lamentamos informarte que
      <strong>no pudo ser aprobada en esta ocasión.</strong>
    </p>

    ${petCard(nombreMascota, fotoMascota)}

    ${infoBox("Motivo del rechazo", motivo || "Sin motivo especificado.", { tone: "danger" })}

    <p style="margin:14px 0 0;">
      Te invitamos a intentarlo de nuevo en el futuro. Nuestro compromiso es
      asegurar que cada mascota tenga un hogar adecuado y seguro.
    </p>

    <p style="margin:14px 0 0;">Si necesitas apoyo o tienes dudas, estamos para ayudarte.</p>
  `;

  const html = renderImpaEmail({
    tone: "danger",
    title: "Solicitud no aprobada",
    preheader: `Información sobre la adopción de ${nombreMascota}.`,
    content,
  });

  return { subject, html };
}
