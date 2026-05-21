"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[min(96vw,1400px)]",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-impa-text-strong/55 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative w-full rounded-2xl border border-impa-line bg-white text-impa-text shadow-impa-xl flex flex-col max-h-[92vh] animate-scale-in overflow-hidden",
          sizeMap[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top highlight */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-impa-200/70 to-transparent" />

        {title && (
          <header className="flex items-start gap-3 justify-between border-b border-impa-line px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-impa-text truncate">
                {title}
              </h2>
              {description && (
                <p className="mt-0.5 text-sm text-impa-muted line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15"
            >
              <X size={16} />
            </button>
          </header>
        )}
        {!title && (
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-lg text-impa-muted hover:text-impa-text hover:bg-impa-surface-3 transition-colors duration-150 cursor-pointer z-10"
          >
            <X size={16} />
          </button>
        )}
        <div className="p-6 overflow-y-auto flex-1 custom-scroll">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-impa-line bg-impa-surface-2/50 px-6 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
