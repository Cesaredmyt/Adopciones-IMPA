import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      { url: "/impa-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/impa-favicon.svg",
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
    <html lang="es" className={inter.variable}>
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
