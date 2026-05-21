"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type TabItem<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: React.ReactNode;
  disabled?: boolean;
};

type TabsProps<T extends string = string> = {
  value: T;
  onChange: (value: T) => void;
  items: TabItem<T>[];
  variant?: "pill" | "underline" | "segmented";
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
};

export function Tabs<T extends string = string>({
  value,
  onChange,
  items,
  variant = "pill",
  size = "md",
  fullWidth = false,
  className,
}: TabsProps<T>) {
  const sizeCls =
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";

  if (variant === "underline") {
    return (
      <div
        role="tablist"
        className={cn(
          "flex items-end gap-1 border-b border-impa-line overflow-x-auto custom-scroll",
          className
        )}
      >
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              onClick={() => onChange(item.value)}
              className={cn(
                "relative -mb-px inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium cursor-pointer whitespace-nowrap",
                "transition-colors duration-200 ease-impa-out",
                active
                  ? "text-impa-700"
                  : "text-impa-muted hover:text-impa-text",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {item.icon ? <item.icon size={15} /> : null}
              <span>{item.label}</span>
              {item.badge}
              <span
                className={cn(
                  "absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-all duration-300 ease-impa-out",
                  active ? "bg-impa-500" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-xl border border-impa-line bg-impa-surface-2 p-1 shadow-impa-xs",
          fullWidth && "w-full",
          className
        )}
      >
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              onClick={() => onChange(item.value)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium cursor-pointer whitespace-nowrap",
                "transition-all duration-200 ease-impa-out",
                sizeCls,
                fullWidth && "flex-1",
                active
                  ? "bg-white text-impa-text shadow-impa-sm border border-impa-line"
                  : "text-impa-muted hover:text-impa-text hover:bg-white/60",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {item.icon ? <item.icon size={14} /> : null}
              <span>{item.label}</span>
              {item.badge}
            </button>
          );
        })}
      </div>
    );
  }

  // pill
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl p-1 flex-wrap",
        className
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg font-medium cursor-pointer whitespace-nowrap",
              "transition-all duration-200 ease-impa-out",
              sizeCls,
              active
                ? "bg-impa-50 text-impa-700 border border-impa-200 shadow-impa-xs"
                : "text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 border border-transparent",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {item.icon ? <item.icon size={14} /> : null}
            <span>{item.label}</span>
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}
