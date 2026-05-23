import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PawPrint, FileX, Search } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

const meta = {
  title: "IMPA/Primitives/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoPets: Story = {
  args: {
    icon: <PawPrint size={28} />,
    title: "No hay mascotas disponibles",
    description: "Aún no hay animales registrados en esta sección. Vuelve más tarde o ajusta los filtros.",
    action: <Button variant="cta">Ver todas</Button>,
  },
};

export const NoSearchResults: Story = {
  args: {
    icon: <Search size={28} />,
    title: "Sin resultados",
    description: "No encontramos coincidencias para tu búsqueda. Probá con otros filtros.",
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    icon: <FileX size={24} />,
    title: "Sin documentos cargados",
    description: "Cuando subas un documento aparecerá aquí.",
  },
};
