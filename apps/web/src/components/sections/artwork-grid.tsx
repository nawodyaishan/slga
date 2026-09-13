"use client";

import { useState } from "react";
import type { Artwork } from "@/lib/content/types";
import { ArtworkLightbox } from "./artwork-lightbox";

interface ArtworkGridProps {
  readonly artworks: readonly Artwork[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (artworks.length === 0) {
    return (
      <p className="text-body text-muted">No artwork pieces have been curated yet.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(135px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5 sm:gap-4">
        {artworks.map((art, index) => {
          const badgeNum =
            art.displayOrder < 10 ? `0${art.displayOrder}` : String(art.displayOrder);
          const staggerDelay = `${Math.min(index, 7) * 50}ms`;

          return (
            <button
              key={art.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View ${art.title} by ${art.artist} full size`}
              style={{ animationDelay: staggerDelay }}
              className="group flex flex-col gap-3 rounded-xl text-left text-foreground transition-all cursor-pointer animate-rise focus-visible:outline-2 focus-visible:outline-accent"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-surface-sunken transition-colors group-hover:border-accent [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
                <span
                  aria-hidden="true"
                  className="absolute left-2.5 top-2.5 z-10 rounded-md border border-border bg-abyss/80 px-2 py-1 font-mono text-[10px] font-semibold leading-none text-accent"
                >
                  {badgeNum}
                </span>

                {art.image.src ? (
                  <img
                    src={art.image.src}
                    alt={art.image.alt || art.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    style={
                      art.image.focalPoint
                        ? { objectPosition: art.image.focalPoint }
                        : undefined
                    }
                  />
                ) : (
                  <span className="absolute inset-x-0 bottom-0 p-3 text-center font-mono text-[9.5px] leading-relaxed tracking-[0.1em] text-dim">
                    ARTWORK IMAGE
                    <br />
                    MOCK · 4:5
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[15.5px] leading-[1.3] font-semibold tracking-[-0.02em] text-foreground">
                  {art.title}
                </span>
                <span className="text-[13.5px] leading-[1.4] text-body">
                  {art.artist}
                </span>
                <span className="font-mono text-[11px] leading-normal tracking-[0.06em] text-muted">
                  {art.game}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-10 max-w-[60ch] text-[15px] leading-[1.65] text-muted">
        Want your work here? Post it in the Facebook group with the game name and credit.
        Admins refresh this page when new pieces are picked.
      </p>

      {selectedIndex !== null && (
        <ArtworkLightbox
          artworks={artworks}
          initialIndex={selectedIndex}
          open={selectedIndex !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedIndex(null);
          }}
        />
      )}
    </>
  );
}
