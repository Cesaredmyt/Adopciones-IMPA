"use client";
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepperStatus = "completed" | "current" | "upcoming";

export type StepperStep = {
  label: string;
  description?: string;
  status?: StepperStatus;
};

type StepperProps = {
  steps: StepperStep[];
  /**
   * Índice del paso activo (0-based). Si se provee, sobrescribe los `status` individuales:
   * todos los pasos anteriores se marcan "completed", el activo "current", los siguientes "upcoming".
   */
  activeStep?: number;
  /** "horizontal" para wizards en desktop; "vertical" para timelines tipo seguimiento. */
  orientation?: "horizontal" | "vertical";
  /** Tamaño del círculo de paso. */
  size?: "sm" | "md";
  className?: string;
};

/**
 * Stepper — usado en flujos de adopción ("Tu camino hacia la adopción"),
 * seguimiento post-adopción, esterilizaciones programadas, etc.
 *
 * Diseño basado en el screen "IMPA Adopter Progress Dashboard" de Stitch:
 * círculos numerados con check verde al completar, línea conectora, label + descripción.
 */
export function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  size = "md",
  className,
}: StepperProps) {
  const resolvedSteps = steps.map((s, i): Required<Pick<StepperStep, "status">> & StepperStep => {
    if (typeof activeStep === "number") {
      const status: StepperStatus =
        i < activeStep ? "completed" : i === activeStep ? "current" : "upcoming";
      return { ...s, status };
    }
    return { ...s, status: s.status ?? "upcoming" };
  });

  const circleSize = size === "sm" ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm";
  const labelSize = size === "sm" ? "text-xs" : "text-sm";

  if (orientation === "vertical") {
    return (
      <ol className={cn("flex flex-col gap-0", className)} role="list">
        {resolvedSteps.map((step, i) => {
          const last = i === resolvedSteps.length - 1;
          return (
            <li key={i} className="relative flex gap-3 pb-6 last:pb-0">
              {!last && (
                <span
                  className={cn(
                    "absolute left-[19px] top-10 bottom-0 w-px",
                    step.status === "completed" ? "bg-impa-500" : "bg-impa-line"
                  )}
                  aria-hidden
                />
              )}
              <StepCircle status={step.status} index={i} sizeClass={circleSize} />
              <div className="flex-1 pt-1.5">
                <p className={cn("font-semibold leading-tight", labelSize, step.status === "current" ? "text-impa-text-strong" : "text-impa-text")}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-1 text-xs text-impa-muted">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol
      className={cn("flex items-start w-full", className)}
      role="list"
      aria-label="Pasos del proceso"
    >
      {resolvedSteps.map((step, i) => {
        const last = i === resolvedSteps.length - 1;
        return (
          <li key={i} className={cn("flex flex-col items-center text-center", !last && "flex-1")}>
            <div className="relative flex items-center w-full">
              {/* Connector left */}
              {i > 0 && (
                <span
                  className={cn(
                    "absolute left-0 right-1/2 h-px top-1/2 -translate-y-1/2",
                    resolvedSteps[i - 1].status === "completed" || step.status !== "upcoming"
                      ? "bg-impa-500"
                      : "bg-impa-line"
                  )}
                  aria-hidden
                />
              )}
              {/* Connector right */}
              {!last && (
                <span
                  className={cn(
                    "absolute left-1/2 right-0 h-px top-1/2 -translate-y-1/2",
                    step.status === "completed" ? "bg-impa-500" : "bg-impa-line"
                  )}
                  aria-hidden
                />
              )}
              <span className="relative mx-auto">
                <StepCircle status={step.status} index={i} sizeClass={circleSize} />
              </span>
            </div>
            <p
              className={cn(
                "mt-2 font-semibold leading-tight px-1",
                labelSize,
                step.status === "current" ? "text-impa-text-strong" : "text-impa-text"
              )}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="mt-0.5 text-[11px] text-impa-muted px-1 max-w-[14rem]">
                {step.description}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepCircle({
  status,
  index,
  sizeClass,
}: {
  status: StepperStatus;
  index: number;
  sizeClass: string;
}) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-full border-2 font-bold transition-all duration-200 ease-impa-out shrink-0",
        sizeClass,
        status === "completed" &&
          "bg-impa-cta border-impa-600 text-white shadow-impa-sm",
        status === "current" &&
          "bg-white border-impa-500 text-impa-700 shadow-impa-glow ring-4 ring-impa-500/15",
        status === "upcoming" &&
          "bg-white border-impa-line text-impa-quiet"
      )}
      aria-current={status === "current" ? "step" : undefined}
    >
      {status === "completed" ? <Check size={16} strokeWidth={3} /> : index + 1}
    </span>
  );
}
