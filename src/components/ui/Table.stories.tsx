import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty } from "./Table";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "IMPA/Primitives/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: "1234", tipo: "Adopción", asunto: "Solicitud Perro", estado: "pendiente", fecha: "10/05/2024" },
  { id: "5678", tipo: "Veterinaria", asunto: "Esterilización", estado: "completado", fecha: "08/05/2024" },
  { id: "9012", tipo: "Reporte", asunto: "Maltrato", estado: "en_proceso", fecha: "09/05/2024" },
  { id: "3456", tipo: "Adopción", asunto: "Solicitud Gato", estado: "aprobada", fecha: "07/05/2024" },
  { id: "7890", tipo: "Reporte", asunto: "Maltrato", estado: "rechazada", fecha: "06/05/2024" },
];

export const ManagementSummary: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow noHover>
          <TableHeader>ID</TableHeader>
          <TableHeader>Tipo</TableHeader>
          <TableHeader>Asunto</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader>Fecha</TableHeader>
          <TableHeader align="right">Acciones</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell primary>#{r.id}</TableCell>
            <TableCell>{r.tipo}</TableCell>
            <TableCell>{r.asunto}</TableCell>
            <TableCell><StatusBadge estado={r.estado} /></TableCell>
            <TableCell>{r.fecha}</TableCell>
            <TableCell align="right">
              <div className="flex justify-end gap-1.5">
                <Button variant="outline" size="sm"><Eye size={13} /> Ver</Button>
                <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil size={13} /></Button>
                <Button variant="danger" size="icon-sm" aria-label="Eliminar"><Trash2 size={13} /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow noHover>
          <TableHeader>ID</TableHeader>
          <TableHeader>Asunto</TableHeader>
          <TableHeader>Estado</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableEmpty colSpan={3}>Sin resultados con los filtros actuales</TableEmpty>
      </TableBody>
    </Table>
  ),
};

export const WithMinWidth: Story = {
  render: () => (
    <Table minWidth={980}>
      <TableHead>
        <TableRow noHover>
          {["Mascota", "Especie", "Raza", "Tamaño", "Edad", "Sexo", "Estado", "Acciones"].map((h) => (
            <TableHeader key={h} align={h === "Acciones" ? "right" : "left"}>{h}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {[1, 2, 3].map((i) => (
          <TableRow key={i}>
            <TableCell primary>Luna #{i}</TableCell>
            <TableCell>Canino</TableCell>
            <TableCell>Golden Retriever</TableCell>
            <TableCell>Grande</TableCell>
            <TableCell>3 años</TableCell>
            <TableCell><Badge variant="female" size="sm">Hembra</Badge></TableCell>
            <TableCell><StatusBadge estado="aprobada" /></TableCell>
            <TableCell align="right"><Button size="sm">Ver</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
