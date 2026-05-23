import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./Button";
import { Badge } from "./Badge";

const meta = {
  title: "IMPA/Primitives/Card",
  component: Card,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: ["default", "warm", "tinted", "accent"] },
    elevated: { control: "boolean" },
    interactive: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardHeader>
        <CardTitle>Solicitud de adopción</CardTitle>
        <CardDescription>Estado actual de tu solicitud y próximos pasos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-impa-muted">Mascota</span>
          <span className="text-sm font-semibold text-impa-text">Luna · Golden Retriever</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">Cancelar</Button>
        <Button size="sm" className="ml-auto">Continuar</Button>
      </CardFooter>
    </Card>
  ),
};

export const Warm: Story = {
  args: { tone: "warm" },
  parameters: { backgrounds: { default: "impa-cream" } },
  render: (args) => (
    <Card {...args} interactive className="max-w-xs">
      <div className="aspect-[4/3] bg-impa-cream-2" />
      <CardContent className="pt-4">
        <h3 className="font-bold text-impa-text">Max</h3>
        <p className="text-xs text-impa-muted">Golden Retriever · 2 años</p>
        <div className="flex gap-1.5 mt-2">
          <Badge variant="brand" size="xs">Vacunado</Badge>
          <Badge variant="accent" size="xs">Amistoso</Badge>
        </div>
        <Button shape="pill" size="sm" className="mt-3" full>Quick View</Button>
      </CardContent>
    </Card>
  ),
};

export const Accent: Story = {
  args: { tone: "accent" },
  render: (args) => (
    <Card {...args} className="max-w-xs">
      <CardContent className="pt-5">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Adopción</p>
        <p className="text-4xl font-bold mt-1">+24</p>
        <p className="text-xs opacity-80 mt-0.5">esta semana</p>
      </CardContent>
    </Card>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {(["default", "warm", "tinted", "accent"] as const).map((t) => (
        <Card key={t} tone={t}>
          <CardContent className="pt-5">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{t}</p>
            <p className="text-sm mt-2">Card con tono <code className="font-mono">{t}</code>.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
