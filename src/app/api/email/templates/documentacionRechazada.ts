import { renderImpaEmail, infoBox } from "./_layout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://impa.vercel.app";

export default function documentacionRechazada({
  nombre,
  razon,
}: {
  nombre: string;
  razon: string;
}) {
  const subject = "Documentación rechazada · IMPA";

  const content = `
    <p style="margin:0 0 14px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 8px;">
      Tu documentación no pudo ser aprobada en esta revisión.
    </p>

    ${infoBox("Motivo", razon, { tone: "danger" })}

    <p style="margin:14px 0 0;">
      Por favor, ajusta los documentos según las observaciones y vuelve a subirlos
      desde tu panel.
    </p>
  `;

  return {
    subject,
    body: renderImpaEmail({
      tone: "danger",
      title: "Documentación rechazada",
      preheader: "Revisa las observaciones y vuelve a enviarla.",
      content,
      cta: { label: "Subir documentos", href: `${SITE_URL}/dashboards/usuario` },
    }),
  };
}
