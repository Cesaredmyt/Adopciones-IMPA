import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatBubble, ChatThread } from "./ChatBubble";

const meta = {
  title: "IMPA/Primitives/ChatBubble",
  component: ChatBubble,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AgentMessage: Story = {
  args: {
    role: "agent",
    authorName: "Coordinador IMPA",
    avatar: "C",
    timestamp: "10:24 AM",
    children: "¡Hola Juan! Tu entrevista está confirmada para el jueves. ¿Tienes alguna pregunta previa?",
  },
};

export const UserMessage: Story = {
  args: {
    role: "user",
    avatar: "J",
    timestamp: "10:26 AM",
    children: "¡Hola! Sí, ¿qué documentos debo tener listos?",
  },
};

export const SystemNotice: Story = {
  args: {
    role: "system",
    timestamp: "10:30 AM",
    children: "Solicitud actualizada a estado: En revisión",
  },
};

export const Thread: Story = {
  render: () => (
    <div className="max-w-xl">
      <ChatThread>
        <ChatBubble role="agent" authorName="Coordinador IMPA" avatar="C" timestamp="10:24 AM">
          ¡Hola Juan! Tu entrevista está confirmada para el jueves. ¿Tienes alguna pregunta previa?
        </ChatBubble>
        <ChatBubble role="user" avatar="J" timestamp="10:26 AM">
          ¡Hola! Sí, ¿qué documentos debo tener listos?
        </ChatBubble>
        <ChatBubble role="agent" authorName="Coordinador IMPA" avatar="C" timestamp="10:27 AM">
          Por favor, ten a mano tu identificación oficial y un comprobante de domicilio reciente. ¡Nos vemos pronto!
        </ChatBubble>
        <ChatBubble role="system" timestamp="10:30 AM">
          Solicitud movida a "Entrevista confirmada"
        </ChatBubble>
        <ChatBubble role="user" avatar="J" timestamp="10:31 AM">
          Perfecto, ahí estaré. ¡Gracias!
        </ChatBubble>
      </ChatThread>
    </div>
  ),
};
