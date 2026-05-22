"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-xl font-semibold",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-impa-out",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/25",
    "disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
    "active:translate-y-[1px] cursor-pointer select-none whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "border border-impa-600/20 bg-impa-500 text-white shadow-impa-md hover:bg-impa-600 hover:shadow-impa-lg active:bg-impa-700",
        cta:
          "border border-impa-600/20 bg-impa-cta text-white shadow-impa-md hover:shadow-impa-glow hover:-translate-y-[1px] active:translate-y-0",
        secondary:
          "bg-impa-50 text-impa-800 border border-impa-200 shadow-impa-xs hover:bg-impa-100 hover:border-impa-300 hover:shadow-impa-sm active:bg-impa-200",
        outline:
          "bg-white/95 text-impa-text border border-impa-line shadow-impa-xs hover:border-impa-300 hover:bg-impa-50/70 hover:shadow-impa-sm active:bg-impa-50",
        ghost:
          "text-impa-700 hover:text-impa-900 hover:bg-impa-50 active:bg-impa-100",
        soft:
          "bg-impa-surface-2 text-impa-text border border-impa-line/70 shadow-impa-xs hover:bg-impa-surface-3 hover:border-impa-line-strong hover:shadow-impa-sm",
        danger:
          "bg-red-600 text-white shadow-impa-sm hover:bg-red-700 hover:shadow-impa-md active:bg-red-800",
        destructive:
          "bg-red-600 text-white shadow-impa-sm hover:bg-red-700 hover:shadow-impa-md active:bg-red-800",
        success:
          "bg-impa-600 text-white shadow-impa-sm hover:bg-impa-700 hover:shadow-impa-md active:bg-impa-800",
        link:
          "text-impa-600 hover:text-impa-700 underline-offset-4 hover:underline px-0",
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1.5",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        xl: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
        'icon-sm': "h-8 w-8 p-0",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string; full?: boolean };

export function ButtonLink({
  href,
  className,
  variant,
  size,
  full,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
