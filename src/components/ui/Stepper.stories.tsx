import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stepper } from "./Stepper";

const meta = {
  title: "IMPA/Primitives/Stepper",
  component: Stepper,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const adoptionSteps = [
  { label: "Solicitud", description: "Recibida" },
  { label: "Entrevista", description: "Programada para el 24 Oct" },
  { label: "Visita al Hogar" },
  { label: "Aprobación" },
];

export const HorizontalAdoption: Story = {
  args: { steps: adoptionSteps, activeStep: 1, orientation: "horizontal" },
  parameters: { layout: "padded" },
};

export const HorizontalAllCompleted: Story = {
  args: { steps: adoptionSteps, activeStep: 4 },
};

export const VerticalTimeline: Story = {
  args: {
    steps: [
      { label: "Solicitud enviada", description: "10 Oct · Documentos recibidos", status: "completed" },
      { label: "Entrevista", description: "12 Oct · Aprobada por Coordinador", status: "completed" },
      { label: "Visita al hogar", description: "Programada · 24 Oct, 10:00", status: "current" },
      { label: "Aprobación final", description: "Pendiente", status: "upcoming" },
      { label: "Entrega de la mascota", description: "Por confirmar", status: "upcoming" },
    ],
    orientation: "vertical",
  },
};

export const Compact: Story = {
  args: { steps: adoptionSteps, activeStep: 2, size: "sm" },
};
