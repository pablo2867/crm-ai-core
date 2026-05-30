import type { Metadata }
from "next";

import "./globals.css";

import Sidebar
from "@/components/Sidebar";

import {
  Toaster,
} from "sonner";

import AINotifications
from "@/components/AINotifications";

export const metadata: Metadata = {

  title: "CRM AI Core",

  description:
    "CRM Inteligente con IA",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="es">

      <body
        className="
          bg-[#09090B]
          text-white
          overflow-x-hidden
        "
      >

        <div className="lg:flex">

          <Sidebar />

          <main
            className="
              flex-1

              lg:ml-[280px]

              min-h-screen

              overflow-x-hidden
            "
          >

            {children}

          </main>

        </div>

        <AINotifications />

        <Toaster
          richColors
          position="top-right"
        />

      </body>

    </html>

  );

}
