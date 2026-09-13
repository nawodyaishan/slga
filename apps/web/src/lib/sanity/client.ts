import { createClient, type SanityClient } from "next-sanity";

/**
 * Read-only, token-free Sanity client (TECH-SPEC.md §10.2, §13.1).
 *
 * Server-only: never import this module from a Client Component. It reads
 * only public env vars because Phase 1 requires no write/preview token to
 * render published content, and no token may reach the browser bundle.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";

/** True once a founder has provisioned a Sanity project for this deployment. */
export function isSanityConfigured(): boolean {
  return Boolean(projectId);
}

let cachedClient: SanityClient | null = null;

/** Lazily constructed so unconfigured environments never touch the network. */
export function getSanityClient(): SanityClient {
  if (!projectId) {
    throw new Error(
      "SLGA_SANITY_NOT_CONFIGURED: NEXT_PUBLIC_SANITY_PROJECT_ID is unset; call isSanityConfigured() before getSanityClient().",
    );
  }
  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    });
  }
  return cachedClient;
}
