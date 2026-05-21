import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Eleva la card con superficies y sombra más marcada */
  elevated?: boolean;
  /** Aplica un hover-lift sutil */
  interactive?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group/card relative rounded-2xl border border-impa-line text-impa-text shadow-impa-sm transition-[box-shadow,transform,border-color] duration-200 ease-impa-out overflow-hidden",
        elevated
          ? "bg-gradient-to-b from-white to-impa-surface-2 shadow-impa-md"
          : "bg-white",
        interactive && "cursor-pointer hover:-translate-y-0.5 hover:shadow-impa-lg hover:border-impa-line-strong",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />
      {children}
    </div>
  )
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
        "flex items-center gap-2 p-5 sm:p-6 pt-4 border-t border-impa-line bg-impa-surface-2/40 rounded-b-2xl",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
