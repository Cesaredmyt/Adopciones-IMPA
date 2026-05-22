"use client";

import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: "info" | "danger";
}

export default function PanelEstado({
  icon,
  title,
  desc,
  tone = "info",
}: Props) {
  const t =
    tone === "danger"
      ? {
          section: "border-red-200 bg-red-50",
          icon: "bg-red-600",
          title: "text-red-900",
          desc: "text-red-700",
        }
      : {
          section: "border-impa-200 bg-impa-50",
          icon: "bg-impa-500",
          title: "text-impa-900",
          desc: "text-impa-700",
        };

  return (
    <section
      className={`rounded-2xl border p-5 shadow-impa-sm ${t.section}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid h-9 w-9 place-items-center rounded-full text-white shadow-impa-xs ${t.icon}`}
        >
          {icon}
        </span>
        <div className="flex-1">
          <h3 className={`text-sm font-extrabold ${t.title}`}>{title}</h3>
          <p className={`mt-1 text-sm ${t.desc}`}>{desc}</p>
        </div>
      </div>
    </section>
  );
}
