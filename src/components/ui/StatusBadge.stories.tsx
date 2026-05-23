import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "IMPA/Primitives/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    estado: { control: "text" },
    dot: { control: "boolean" },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
  args: { estado: "pendiente", dot: true },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pendiente: Story = {};
export const Aprobada: Story = { args: { estado: "aprobada" } };
export const Rechazada: Story = { args: { estado: "rechazada" } };
export const EnProceso: Story = { args: { estado: "en_proceso" } };
export const Completado: Story = { args: { estado: "completado" } };
export const Custom: Story = { args: { estado: "personalizado", label: "Etiqueta libre" } };

export const AllDomainEstados: Story = {
  render: () => {
    const groups: Array<{ title: string; estados: string[] }> = [
      { title: "Solicitudes", estados: ["pendiente", "en_revision", "en_proceso", "aprobada", "rechazada", "cancelada"] },
      { title: "Citas", estados: ["programada", "confirmada", "reprogramada", "no_asistio", "finalizada"] },
      { title: "Documentos", estados: ["pendiente", "aprobado", "rechazado", "faltante"] },
      { title: "Reportes maltrato", estados: ["recibido", "en_investigacion", "falso_positivo", "resuelto"] },
      { title: "Esterilizaciones", estados: ["solicitada", "programada", "realizada", "cancelada"] },
    ];
    return (
      <div className="flex flex-col gap-5 max-w-2xl">
        {groups.map((g) => (
          <section key={g.title}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-impa-muted mb-2">{g.title}</h3>
            <div className="flex flex-wrap gap-2">
              {g.estados.map((e) => <StatusBadge key={e} estado={e} />)}
            </div>
          </section>
        ))}
      </div>
    );
  },
};
