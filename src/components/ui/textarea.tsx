import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-xl border border-impa-line bg-white px-3.5 py-2.5 text-sm text-impa-text shadow-impa-xs transition-all resize-y",
        "placeholder:text-[#638863]",
        "hover:border-impa-300",
        "focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-impa-50/40",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
