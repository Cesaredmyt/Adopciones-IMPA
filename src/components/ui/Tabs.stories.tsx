import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Stethoscope, Syringe, Scissors, AlertCircle } from "lucide-react";
import { Tabs } from "./Tabs";

const meta = {
  title: "IMPA/Primitives/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const vetItems = [
  { value: "chequeo", label: "Chequeo", icon: Stethoscope },
  { value: "vacunacion", label: "Vacunación", icon: Syringe },
  { value: "cirugia", label: "Cirugía", icon: Scissors },
  { value: "urgencia", label: "Urgencia", icon: AlertCircle },
];

export const PillCategoriaSalud: Story = {
  render: () => {
    const [v, setV] = useState("chequeo");
    return <Tabs value={v} onChange={setV} items={vetItems} variant="pill" />;
  },
};

export const Segmented: Story = {
  render: () => {
    const [v, setV] = useState("urgente");
    return (
      <Tabs
        value={v}
        onChange={setV}
        variant="segmented"
        items={[
          { value: "urgente", label: "Urgente" },
          { value: "estandar", label: "Estándar" },
        ]}
      />
    );
  },
};

export const Underline: Story = {
  render: () => {
    const [v, setV] = useState("general");
    return (
      <Tabs
        value={v}
        onChange={setV}
        variant="underline"
        items={[
          { value: "general", label: "General" },
          { value: "documentos", label: "Documentos", badge: <span className="ml-1 text-[10px] font-bold text-impa-600 bg-impa-50 border border-impa-200 px-1.5 py-0.5 rounded-full">3</span> },
          { value: "historial", label: "Historial" },
          { value: "ajustes", label: "Ajustes" },
        ]}
      />
    );
  },
};
