import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { ArtworkGrid } from "@/components/sections/artwork-grid";
import { content } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();
  return createPageMetadata({
  fallbackImage: settings.defaultOgImage,
  title: "Showcase",
  description:
    "In-game photography and art made by SLGA members. Admins pick the pieces; each one links back to the original post in the Facebook group.",
  path: "/showcase",
  });
}

export default async function ShowcasePage() {
  const artworks = await content.getArtworks();

  return (
    <div>
      <section className="border-b border-border">
        <Container className="pt-(--spacing-page-top) pb-(--spacing-section)">
          <Eyebrow bar className="mb-[22px]">
            COMMUNITY SHOWCASE
          </Eyebrow>
          <h1 className="m-0 max-w-[20ch] text-h1-page leading-[1.04] font-extrabold tracking-[-0.03em]">
            Best artwork
          </h1>
          <p className="mt-6 max-w-[62ch] text-lead leading-[1.7] text-muted">
            In-game photography and art made by SLGA members. Admins pick the pieces; each
            one links back to the original post in the Facebook group.
          </p>
          {artworks.length > 0 && (
            <p className="mt-5.5 font-mono text-[11px] font-medium leading-relaxed tracking-[0.06em] text-dim">
              SHOWING {artworks.length} PIECES · CURATED ORDER · UPDATED BY ADMINS
            </p>
          )}
        </Container>
      </section>

      <Container className="py-(--spacing-section)">
        {artworks.length === 0 ? (
          <p className="text-body text-muted">No artwork pieces have been curated yet.</p>
        ) : (
          <ArtworkGrid artworks={artworks} />
        )}
      </Container>
    </div>
  );
}
