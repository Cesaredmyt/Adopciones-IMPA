"use client";

import { useState } from "react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-impa-line bg-white text-sm text-impa-text placeholder:text-impa-subtle shadow-impa-xs hover:border-impa-300 focus-visible:outline-none focus-visible:border-impa-500 focus-visible:ring-4 focus-visible:ring-impa-500/15 transition-all duration-200"
      />
      <button
        type="submit"
        className="h-10 px-3.5 rounded-lg bg-impa-cta text-white font-semibold text-xs shadow-impa-sm hover:shadow-impa-glow hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        Suscribir
      </button>
    </form>
  );
}
