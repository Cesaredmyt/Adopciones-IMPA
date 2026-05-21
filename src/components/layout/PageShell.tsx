"use client";
import React from "react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 text-impa-text">
      {children}
    </main>
  );
}
