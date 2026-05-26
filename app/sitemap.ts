import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://anytoany.com";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  const toolRoutes = Object.values(TOOLS).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...toolRoutes];
}
