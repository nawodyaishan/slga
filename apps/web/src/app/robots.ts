import type { MetadataRoute } from "next";
import { absoluteSiteUrl, isIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexableDeployment();
  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? undefined : "/",
    },
    sitemap: indexable ? absoluteSiteUrl("/sitemap.xml") : undefined,
  };
}
