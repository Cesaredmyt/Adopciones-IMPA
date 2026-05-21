"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-impa-500 text-white shadow-impa-sm hover:bg-impa-600 active:bg-impa-700",
        secondary:
          "bg-impa-50 text-impa-700 border border-impa-100 hover:bg-impa-100 active:bg-impa-200",
        outline:
          "bg-white text-impa-text border border-impa-line hover:border-impa-300 hover:bg-impa-50/50 active:bg-impa-50",
        ghost:
          "text-impa-text hover:bg-impa-50 active:bg-impa-100",
        danger:
          "bg-red-600 text-white shadow-impa-sm hover:bg-red-700 active:bg-red-800",
        destructive:
          "bg-red-600 text-white shadow-impa-sm hover:bg-red-700 active:bg-red-800",
        success:
          "bg-impa-600 text-white shadow-impa-sm hover:bg-impa-700 active:bg-impa-800",
        link:
          "text-impa-600 hover:text-impa-700 underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        xl: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
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
