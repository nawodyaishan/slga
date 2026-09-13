import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";
  return { rules: { userAgent: "*", allow: isProduction ? "/" : undefined, disallow: isProduction ? undefined : "/" }, sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/sitemap.xml` };
}

