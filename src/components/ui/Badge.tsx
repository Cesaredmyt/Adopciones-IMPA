import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors duration-150 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-impa-surface-3 text-impa-text border-impa-line",
        brand:
          "bg-impa-50 text-impa-700 border-impa-200",
        solid:
          "bg-impa-cta text-white border-impa-600 shadow-impa-xs",
        outline:
          "bg-white text-impa-text border-impa-line shadow-impa-xs",
        success:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning:
          "bg-amber-50 text-amber-700 border-amber-200",
        danger:
          "bg-red-50 text-red-700 border-red-200",
        info:
          "bg-sky-50 text-sky-700 border-sky-200",
        neutral:
          "bg-slate-50 text-slate-700 border-slate-200",
        female:
          "bg-pink-50 text-pink-700 border-pink-200",
        male:
          "bg-blue-50 text-blue-700 border-blue-200",
      },
      size: {
        xs: "px-2 py-0.5 text-[10px]",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

const dotColorByVariant: Record<string, string> = {
  default: "bg-impa-quiet",
  brand: "bg-impa-500",
  solid: "bg-white",
  outline: "bg-impa-quiet",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  neutral: "bg-slate-500",
  female: "bg-pink-500",
  male: "bg-blue-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}: BadgeProps) {
  const dotCls = dotColorByVariant[variant ?? "default"] ?? "bg-current";
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotCls)} />}
      {children}
    </span>
  );
}

export { badgeVariants };
