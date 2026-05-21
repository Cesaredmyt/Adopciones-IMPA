// SectionTitle.tsx
"use client";

interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-extrabold text-[#0f830f] tracking-tight mb-2">
      {title}
    </h3>
  );
}
