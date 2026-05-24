import * as React from "react";
import { cn } from "@/lib/utils";

type CardTone = "default" | "warm" | "tinted" | "accent";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Eleva la card con superficies y sombra más marcada */
  elevated?: boolean;
  /** Aplica un hover-lift sutil */
  interactive?: boolean;
  /**
   * Tono de superficie:
   * - "default": fondo blanco con borde verde sutil (admin, dashboards)
   * - "warm":    fondo blanco con borde cream (Adoptions Gallery sobre cream bg)
   * - "tinted":  fondo verde muy suave (cards destacadas en flujos)
   * - "accent":  fondo amarillo cálido (stat callouts, highlights)
   */
  tone?: CardTone;
};

const toneStyles: Record<CardTone, { base: string; topLine: string }> = {
  default: {
    // bg-white sólido (no /95) para que la card se vea contra el body verde
    base: "border-impa-line bg-white",
    topLine: "bg-gradient-to-r from-transparent via-impa-300/70 to-transparent",
  },
  warm: {
    base: "border-impa-cream-3 bg-white",
    topLine: "bg-gradient-to-r from-transparent via-impa-accent/40 to-transparent",
  },
  tinted: {
    base: "border-impa-200 bg-gradient-to-br from-white to-impa-50/60",
    topLine: "bg-gradient-to-r from-transparent via-impa-300/60 to-transparent",
  },
  accent: {
    base: "border-impa-accent bg-impa-accent-soft text-impa-accent-ink",
    topLine: "bg-gradient-to-r from-transparent via-impa-accent-strong/40 to-transparent",
  },
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, interactive, tone = "default", children, ...props }, ref) => {
    const t = toneStyles[tone];
    return (
      <div
        ref={ref}
        className={cn(
          "group/card relative rounded-2xl border text-impa-text shadow-impa-sm transition-[box-shadow,transform,border-color,background-color] duration-200 ease-impa-out overflow-hidden",
          t.base,
          elevated && "shadow-impa-md",
          interactive && "cursor-pointer hover:-translate-y-0.5 hover:shadow-impa-lg hover:border-impa-line-strong",
          className
        )}
        {...props}
      >
        <span className={cn("pointer-events-none absolute inset-x-0 top-0 h-px", t.topLine)} />
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-bold leading-tight tracking-tight text-impa-text",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-impa-muted", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 sm:p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 p-5 sm:p-6 pt-4 border-t border-impa-line bg-impa-surface-2/55 rounded-b-2xl",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
