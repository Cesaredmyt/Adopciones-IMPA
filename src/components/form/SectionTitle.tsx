// SectionTitle.tsx
"use client";

interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-extrabold text-impa-700 tracking-tight mb-2">
      {title}
    </h3>
  );
}
