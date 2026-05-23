"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type ChatRole = "user" | "agent" | "system";

type ChatBubbleProps = {
  role: ChatRole;
  /** Iniciales/avatar (1-2 chars) si querés render del autor. */
  avatar?: React.ReactNode;
  /** Nombre del autor, opcional, render como etiqueta sobre la burbuja. */
  authorName?: string;
  /** Timestamp como ya formateado (e.g. "10:24 AM"). */
  timestamp?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * ChatBubble — usado en seguimiento post-adopción y comunicación coordinador↔adoptante.
 *
 * Diseño basado en el screen "IMPA Adopter Progress Dashboard" de Stitch:
 * mensajes del coordinador (role="agent") en superficie clara a la izquierda;
 * mensajes del adoptante (role="user") en verde a la derecha;
 * "system" para notificaciones automáticas (cambio de estado, recordatorios).
 */
export function ChatBubble({
  role,
  avatar,
  authorName,
  timestamp,
  children,
  className,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <div className={cn("flex justify-center my-2", className)}>
        <span className="impa-chip text-[11px] text-impa-muted">
          {children}
          {timestamp && <span className="ml-1.5 text-impa-quiet">· {timestamp}</span>}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2 max-w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && (
        <span className="grid place-items-center w-8 h-8 rounded-full bg-impa-surface-3 border border-impa-line text-impa-muted text-xs font-bold shrink-0">
          {avatar ?? "•"}
        </span>
      )}

      <div className={cn("flex flex-col gap-0.5 min-w-0 max-w-[78%]", isUser ? "items-end" : "items-start")}>
        {authorName && (
          <span className="text-[11px] font-semibold text-impa-muted px-1">{authorName}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-impa-xs break-words",
            isUser
              ? "bg-impa-cta text-white rounded-br-sm shadow-impa-sm"
              : "bg-impa-surface-2 border border-impa-line text-impa-text rounded-bl-sm"
          )}
        >
          {children}
        </div>
        {timestamp && (
          <span className="text-[10px] text-impa-quiet px-1">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <span className="grid place-items-center w-8 h-8 rounded-full bg-impa-cta text-white text-xs font-bold shadow-impa-xs ring-2 ring-white shrink-0">
          {avatar ?? "Tú"}
        </span>
      )}
    </div>
  );
}

type ChatThreadProps = {
  children: React.ReactNode;
  /** Altura fija con scroll interno (px o clase Tailwind). */
  maxHeight?: string;
  className?: string;
};

/**
 * Contenedor para una lista de ChatBubbles. Aplica scroll vertical estilizado
 * y stack vertical con gap apropiado. Diseñado para el panel de chat del
 * "IMPA Adopter Progress Dashboard".
 */
export function ChatThread({ children, maxHeight = "26rem", className }: ChatThreadProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-y-auto custom-scroll p-4 bg-white rounded-xl border border-impa-line",
        className
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
