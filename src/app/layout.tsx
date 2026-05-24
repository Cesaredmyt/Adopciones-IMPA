import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "IMPA · Instituto Michoacano de Protección Animal",
    template: "%s · IMPA",
  },
  description:
    "Plataforma oficial del IMPA para adopción responsable, esterilización y cuidado animal en Michoacán.",
  applicationName: "IMPA",
  icons: {
    icon: [
      { url: "/FAVICON IMPA.png", type: "image/png", sizes: "32x32" },
      { url: "/FAVICON IMPA.png", type: "image/png", sizes: "any" },
    ],
    apple: "/ISOTIPO IMPA.png",
    shortcut: "/FAVICON IMPA.png",
  },
  openGraph: {
    title: "IMPA · Adopta y cambia una vida",
    description:
      "Adopción responsable, esterilización gratuita y cuidado animal en Michoacán.",
    siteName: "IMPA",
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#17cf17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning
        className="min-h-screen text-[var(--impa-text)] font-sans antialiased"
      >
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
