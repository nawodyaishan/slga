import type { ContentAdapter } from "./types";
import { seedAdapter } from "./seed";
import { isSanityConfigured } from "@/lib/sanity/client";
import { sanityAdapter } from "@/lib/sanity/queries";

/**
 * The single source page components import content from (plan.md §2). A
 * production deployment must never silently fall back to seed/mock content
 * (TECH-SPEC.md §10.3) - if Sanity is unconfigured there, module load throws
 * instead of shipping placeholder copy.
 */
function selectAdapter(): ContentAdapter {
  if (isSanityConfigured()) return sanityAdapter;
  if (process.env.NODE_ENV !== "production") return seedAdapter;
  throw new Error(
    "SLGA_CONTENT_MISCONFIGURED: no Sanity project configured in production and seed content is disabled outside development. Set NEXT_PUBLIC_SANITY_PROJECT_ID before deploying.",
  );
}

export const content: ContentAdapter = selectAdapter();
