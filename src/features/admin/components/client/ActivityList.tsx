"use client";

import React from "react";
import { ActivityItem } from "./ActivityItem";
import type { ActividadItemType } from "../../types/dashboard";

export function ActividadList({ actividad }: { actividad: ActividadItemType[] }) {
    return (
        <ul className="divide-y divide-impa-line-faint">
            {actividad.map((a, i) => (
                <div
                    key={i}
                    className="stagger-item"
                    style={{ ['--i' as any]: i }}
                >
                    <ActivityItem tipo={a.tipo} mensaje={a.mensaje} fecha={a.fecha} />
                </div>
            ))}
        </ul>
    );
}
