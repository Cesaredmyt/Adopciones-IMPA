import { renderImpaEmail, detailsTable } from "./_layout";

export default function citaAdopcion({
  nombre,
  mascota,
  fecha,
  hora,
}: {
  nombre: string;
  mascota: string;
  fecha: string;
  hora: string;
}) {
  const subject = `Cita de adopción confirmada · ${mascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu cita para conocer a <strong>${mascota}</strong> ha sido confirmada.
      Te esperamos puntualmente.
    </p>

    ${detailsTable([
      { label: "Mascota", value: `<strong>${mascota}</strong>` },
      { label: "Fecha", value: fecha },
      { label: "Hora", value: hora },
    ])}

    <p style="margin:14px 0 0;">¡Gracias por darle una oportunidad a un animalito en espera!</p>
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "success",
      title: "Cita confirmada",
      preheader: `${fecha} · ${hora}`,
      content,
    }),
  };
}
