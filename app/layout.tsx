import "./globals.css";
import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "CRM AI CORE | CRM Inteligente con IA",
    template: "%s | CRM AI CORE",
  },
  description:
    "CRM inteligente con inteligencia artificial para ventas, seguimiento, automatización y análisis comercial.",
  applicationName: "CRM AI CORE",
  keywords: [
    "CRM con IA",
    "CRM inteligente",
    "inteligencia artificial para ventas",
    "automatización comercial",
    "gestión de leads",
    "CRM México",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "CRM AI CORE",
    title: "CRM AI CORE | CRM Inteligente con IA",
    description:
      "CRM inteligente con IA para ventas, seguimiento y automatización comercial.",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <OrganizationJsonLd />{children}</body>
    </html>
  );
}


