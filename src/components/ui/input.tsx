import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-impa-line bg-white px-3.5 text-sm text-impa-text shadow-impa-xs",
          "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
          "placeholder:text-impa-subtle",
          "hover:border-impa-300 hover:bg-impa-tinted",
          "focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15 focus-visible:bg-white",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-impa-surface-2",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-impa-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
