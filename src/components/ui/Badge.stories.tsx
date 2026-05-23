import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "IMPA/Primitives/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default", "brand", "solid", "outline", "accent",
        "success", "warning", "danger", "info",
        "neutral", "female", "male",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    dot: { control: "boolean" },
  },
  args: { children: "Aprobado" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Brand: Story = { args: { variant: "brand" } };
export const Accent: Story = { args: { variant: "accent", children: "+24 esta semana" } };
export const Success: Story = { args: { variant: "success", dot: true, children: "Completado" } };
export const Warning: Story = { args: { variant: "warning", dot: true, children: "Pendiente" } };
export const Danger: Story = { args: { variant: "danger", dot: true, children: "En proceso" } };

export const StatusGallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Badge variant="success" dot>Completado</Badge>
      <Badge variant="warning" dot>Pendiente</Badge>
      <Badge variant="danger" dot>Rechazado</Badge>
      <Badge variant="info" dot>En revisión</Badge>
      <Badge variant="accent">Urgente</Badge>
      <Badge variant="brand">Adopción</Badge>
      <Badge variant="solid">Premium</Badge>
      <Badge variant="outline">Borrador</Badge>
      <Badge variant="neutral">Archivado</Badge>
    </div>
  ),
};
