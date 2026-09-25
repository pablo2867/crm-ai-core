import React from "react";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CRM AI CORE",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "CRM inteligente con inteligencia artificial para ventas, seguimiento y automatización comercial.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
