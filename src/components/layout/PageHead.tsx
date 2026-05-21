"use client";
import React from "react";

export default function PageHead({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="m-0 font-bold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight text-impa-text">
          {title}
        </h1>
        {subtitle && (
          <div className="m-0 text-sm sm:text-base text-impa-muted">
            {subtitle}
          </div>
        )}
      </div>

      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}
