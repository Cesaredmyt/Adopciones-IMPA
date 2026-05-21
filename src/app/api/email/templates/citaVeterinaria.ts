import { renderImpaEmail, detailsTable, infoBox } from "./_layout";

export default function citaVeterinaria({
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
  const subject = `Cita veterinaria confirmada · ${mascota}`;

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu cita veterinaria para <strong>${mascota}</strong> está confirmada.
    </p>

    ${detailsTable([
      { label: "Mascota", value: `<strong>${mascota}</strong>` },
      { label: "Fecha", value: fecha },
      { label: "Hora", value: hora },
    ])}

    ${infoBox("Recomendación", "Llega 10 minutos antes de la hora indicada.", { tone: "info" })}
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "info",
      title: "Cita veterinaria confirmada",
      preheader: `${fecha} · ${hora}`,
      content,
    }),
  };
}
