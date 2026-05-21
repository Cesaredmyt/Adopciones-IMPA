import { renderImpaEmail, infoBox, petCard } from "./_layout";

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

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>

    <p style="margin:0 0 14px;">
      Tenemos excelentes noticias: tu solicitud para adoptar a
      <strong>${nombreMascota}</strong> fue <strong style="color:#11a611;">aprobada</strong>.
      Ahora puedes acudir al IMPA para recibir a tu nuevo compañero de vida.
    </p>

    ${petCard(nombreMascota, fotoMascota)}

    ${infoBox(
      "Requisitos para recoger",
      `• Identificación oficial (INE)<br/>• Horario: <strong>8:00 a 14:00 hrs</strong>, cualquier día hábil`,
      { tone: "success" }
    )}

    <p style="margin:14px 0 0;">
      En este correo encontrarás también tu <strong>Certificado Oficial de Adopción</strong> en PDF.
    </p>

    <p style="margin:14px 0 0;">¡Gracias por cambiarle la vida a <strong>${nombreMascota}</strong>!</p>
  `;

  const html = renderImpaEmail({
    tone: "success",
    title: "¡Adopción aprobada!",
    preheader: `${nombreMascota} te está esperando.`,
    content,
  });

  return { subject, html };
}
