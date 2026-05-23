import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus, ArrowRight, Heart, Trash2 } from "lucide-react";
import { Button } from "./Button";

const meta = {
  title: "IMPA/Primitives/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary", "cta", "accent", "secondary", "outline",
        "ghost", "soft", "danger", "destructive", "success", "link",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "icon", "icon-sm"] },
    shape: { control: "select", options: ["default", "pill"] },
    full: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { children: "Adoptar mascota" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const CTA: Story = { args: { variant: "cta", children: "Crear cuenta" } };
export const Accent: Story = { args: { variant: "accent", children: "Destacado" } };
export const Outline: Story = { args: { variant: "outline", children: "Conoce IMPA" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Cancelar" } };
export const Danger: Story = { args: { variant: "danger", children: "Eliminar" } };
export const Link: Story = { args: { variant: "link", children: "Ver detalles" } };

export const Pill: Story = {
  args: { variant: "cta", shape: "pill", children: "Ver mascotas en adopción" },
};

export const WithIcon: Story = {
  args: { children: <><Plus size={16} /> Nueva mascota</> },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
      <Button size="icon" aria-label="like"><Heart size={16} /></Button>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 max-w-md">
      <Button variant="primary">Primary</Button>
      <Button variant="cta">CTA gradient</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
      <Button variant="cta" shape="pill">Pill CTA <ArrowRight size={14} /></Button>
      <Button variant="danger" size="icon" aria-label="delete"><Trash2 size={16} /></Button>
    </div>
  ),
};
