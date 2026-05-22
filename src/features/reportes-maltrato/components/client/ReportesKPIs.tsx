"use client";

import { AlertTriangle, Eye, Activity, CheckCircle2 } from "lucide-react";

type Props = {
  totales: {
    recibidos: number;
    en_revision: number;
    en_investigacion: number;
    resueltos: number;
  };
};

export function ReportesKPIs({ totales }: Props) {
  const cards = [
    {
      label: "Recibidos",
      value: totales.recibidos,
      icon: AlertTriangle,
      style: "from-yellow-50 to-white border-yellow-200 text-yellow-700",
    },
    {
      label: "En revisión",
      value: totales.en_revision,
      icon: Eye,
      style: "from-blue-50 to-white border-blue-200 text-blue-700",
    },
    {
      label: "En investigación",
      value: totales.en_investigacion,
      icon: Activity,
      style: "from-indigo-50 to-white border-indigo-200 text-indigo-700",
    },
    {
      label: "Resueltos",
      value: totales.resueltos,
      icon: CheckCircle2,
      style: "from-green-50 to-white border-green-200 text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${c.style} p-4 shadow-impa-xs`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-80">
                  {c.label}
                </p>
                <p className="text-2xl font-extrabold mt-1">{c.value}</p>
              </div>
              <Icon size={20} className="opacity-70" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
