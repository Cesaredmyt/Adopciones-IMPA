import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Pagination from "./Pagination";

const meta = {
  title: "IMPA/Primitives/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Few: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination page={page} totalPages={4} onChange={setPage} />;
  },
};

export const Many: Story = {
  render: () => {
    const [page, setPage] = useState(7);
    return (
      <Pagination
        page={page}
        totalPages={42}
        onChange={setPage}
        itemsPerPage={12}
        totalItems={500}
        itemsLabel="mascotas"
      />
    );
  },
};

export const NearEnd: Story = {
  render: () => {
    const [page, setPage] = useState(39);
    return <Pagination page={page} totalPages={42} onChange={setPage} />;
  },
};
