"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Table — primitivo unificado para todas las tablas admin.
 *
 * Diseño inspirado en "IMPA Admin Dashboard Overview" (Stitch):
 * - Header con gradient `.impa-table-head` (from-impa-surface-2 to /40)
 * - Row hover en `impa-tinted/60`
 * - Dividers `divide-impa-line-faint`
 * - Borde exterior rounded-2xl con sombra impa-sm
 * - Scroll horizontal con `custom-scroll`
 *
 * Composición típica:
 * ```tsx
 * <Table>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeader>Mascota</TableHeader>
 *       <TableHeader>Estado</TableHeader>
 *       <TableHeader align="right">Acciones</TableHeader>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     {rows.map(r => (
 *       <TableRow key={r.id}>
 *         <TableCell>{r.nombre}</TableCell>
 *         <TableCell><StatusBadge estado={r.estado} /></TableCell>
 *         <TableCell align="right">…</TableCell>
 *       </TableRow>
 *     ))}
 *   </TableBody>
 * </Table>
 * ```
 */
type TableProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Ancho mínimo del table interior (px). Útil cuando hay muchas columnas. */
  minWidth?: number | string;
  /** Si el header debe ser sticky al hacer scroll vertical (cuando el contenedor padre tiene altura). */
  stickyHeader?: boolean;
};

export function Table({
  className,
  children,
  minWidth,
  stickyHeader,
  ...props
}: TableProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-impa-line bg-white shadow-impa-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="w-full overflow-x-auto custom-scroll">
        <table
          className={cn("w-full border-collapse text-sm", stickyHeader && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-[1]")}
          style={minWidth ? { minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth } : undefined}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <thead
      className={cn(
        "bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line",
        className
      )}
      {...props}
    />
  );
}

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn("divide-y divide-impa-line-faint", className)} {...props} />;
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  /** Desactiva el hover (filas no interactivas como totales, headers de grupo). */
  noHover?: boolean;
};

export function TableRow({ className, noHover, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "group transition-colors duration-150",
        !noHover && "hover:bg-impa-tinted/60",
        className
      )}
      {...props}
    />
  );
}

type TableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right";
};

export function TableHeader({ className, align = "left", ...props }: TableHeaderProps) {
  return (
    <th
      {...props}
      className={cn(
        "px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    />
  );
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right";
  /** Cell que actúa como "primary": typografía más fuerte, color de marca on hover. */
  primary?: boolean;
};

export function TableCell({ className, align = "left", primary, ...props }: TableCellProps) {
  return (
    <td
      {...props}
      className={cn(
        "px-4 py-3 align-middle text-sm",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        primary && "text-impa-text font-medium group-hover:text-impa-700 transition-colors duration-150",
        className
      )}
    />
  );
}

type TableEmptyProps = {
  colSpan: number;
  /** Mensaje principal mostrado en el centro de la fila vacía. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Fila vacía estilizada — úsala dentro de `<TableBody>` cuando filtered.length === 0.
 */
export function TableEmpty({ colSpan, children, className }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn("px-4 py-10 text-center text-impa-muted", className)}>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-impa-line bg-impa-surface-2/50">
          <span className="text-sm">{children}</span>
        </div>
      </td>
    </tr>
  );
}
