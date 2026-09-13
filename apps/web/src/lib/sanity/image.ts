import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { ImageRef } from "@/lib/content/types";
import { getSanityClient } from "./client";

/**
 * The subset of a Sanity `image` field this app reads. Alt text is required
 * for content images (TECH-SPEC.md §11.5); an empty string marks a
 * deliberately decorative asset.
 */
export interface SanityImageField {
  readonly asset?: {
    readonly _ref: string;
    readonly _type: "reference";
  };
  readonly hotspot?: {
    readonly x: number;
    readonly y: number;
  };
  readonly alt?: string;
}

let cachedBuilder: ReturnType<typeof imageUrlBuilder> | null = null;

function builder() {
  if (!cachedBuilder) {
    cachedBuilder = imageUrlBuilder(getSanityClient());
  }
  return cachedBuilder;
}

/**
 * Resolves a Sanity image field to the app's source-agnostic `ImageRef`,
 * requesting a specific rendered width so `next/image` receives a
 * right-sized, cache-friendly URL rather than the original asset.
 */
export function resolveSanityImage(
  image: SanityImageField | null | undefined,
  options: { readonly width: number; readonly height?: number } | undefined = { width: 1600 },
): ImageRef | null {
  if (!image?.asset) return null;

  let chain = builder()
    .image(image as SanityImageSource)
    .auto("format")
    .fit("max")
    .width(options.width);
  if (options.height) chain = chain.height(options.height);

  return {
    src: chain.url(),
    alt: image.alt ?? "",
    width: options.width,
    height: options.height,
    focalPoint: image.hotspot
      ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%`
      : undefined,
  };
}
