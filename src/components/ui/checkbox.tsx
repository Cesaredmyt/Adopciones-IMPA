import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          className={cn(
            "peer h-[18px] w-[18px] shrink-0 cursor-pointer rounded-md border border-impa-line-strong appearance-none",
            "bg-white shadow-impa-xs transition-[background-color,border-color,box-shadow] duration-150 ease-impa-out",
            "checked:bg-impa-500 checked:border-impa-500 checked:shadow-impa-ring-soft",
            "hover:border-impa-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 stroke-[3] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150" />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
