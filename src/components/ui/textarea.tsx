import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs resize-y",
        "transition-[box-shadow,border-color,background-color] duration-200 ease-impa-out",
        "placeholder:text-impa-subtle",
        "hover:border-impa-300 hover:bg-impa-tinted",
        "focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15 focus-visible:bg-white",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-impa-surface-2",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
