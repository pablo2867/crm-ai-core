import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const routes = [
    "",
    "/features",
    "/solutions",
    "/demo",
    "/pricing",
    "/resources",
    "/faq",
    "/documentation",
    "/contact",
    "/ai-policy",
    "/privacy",
    "/terms",
    "/refunds",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
