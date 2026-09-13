import type { Metadata } from "next";
import type { ImageRef } from "./content/types";

const DEFAULT_SITE_ORIGIN = "https://slgaofficial.github.io";

function parseOrigin(value: string | undefined): URL {
  try {
    const url = new URL(value || DEFAULT_SITE_ORIGIN);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(DEFAULT_SITE_ORIGIN);
  }
}

export function getSiteOrigin(): URL {
  return parseOrigin(process.env.NEXT_PUBLIC_SITE_URL);
}

export function isIndexableDeployment(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
}

export function absoluteSiteUrl(path = "/"): string {
  return new URL(path, getSiteOrigin()).toString();
}

interface PageMetadataInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly image?: ImageRef | null;
  readonly fallbackImage?: ImageRef | null;
  readonly publishedTime?: string;
  readonly locale?: "en_LK" | "si_LK";
  readonly type?: "website" | "article";
}

export function socialImage(image?: ImageRef | null) {
  if (!image?.src) return undefined;
  const url = new URL(image.src, getSiteOrigin());
  if (url.hostname === "cdn.sanity.io") {
    url.searchParams.set("w", "1200");
    url.searchParams.set("h", "630");
    url.searchParams.set("fit", "crop");
    return { url: url.toString(), width: 1200, height: 630, alt: image.alt };
  }
  return { url: url.toString(), width: image.width, height: image.height, alt: image.alt };
}

export function createPageMetadata({ title, description, path, image, fallbackImage, publishedTime, locale = "en_LK", type = "website" }: PageMetadataInput): Metadata {
  const indexable = isIndexableDeployment();
  const url = absoluteSiteUrl(path);
  const shareImage = socialImage(image ?? fallbackImage);
  const images = shareImage ? [shareImage] : undefined;

  return {
    title,
    description,
    alternates: indexable ? { canonical: url } : undefined,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
    openGraph: {
      type,
      ...(type === "article" ? { publishedTime } : {}),
      locale,
      siteName: "Sri Lankan Gaming Alliance",
      title,
      description,
      url: indexable ? url : undefined,
      images,
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}
