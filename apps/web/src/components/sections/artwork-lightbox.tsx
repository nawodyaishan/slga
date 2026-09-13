"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { track } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui";
import type { Artwork } from "@/lib/content/types";

interface ArtworkLightboxProps {
  readonly artworks: readonly Artwork[];
  readonly initialIndex: number;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ArtworkLightbox({
  artworks,
  initialIndex,
  open,
  onOpenChange,
}: ArtworkLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

  if (prevInitialIndex !== initialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
  }

  useEffect(() => {
    if (!api) return;

    if (api.selectedScrollSnap() !== initialIndex) {
      api.scrollTo(initialIndex, true);
    }

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, initialIndex]);

  const currentArtwork = artworks[currentIndex] ?? artworks[0];
  const currentArtworkId = currentArtwork?.id;

  useEffect(() => {
    if (open && currentArtworkId) {
      track("artwork_open", {
        artwork_id: currentArtworkId,
        placement: "showcase",
      });
    }
  }, [open, currentArtworkId]);

  if (artworks.length === 0 || !currentArtwork) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 z-50 flex h-full max-h-screen w-full max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-none bg-abyss/96 p-0 shadow-none backdrop-blur-md animate-scale-in duration-200 focus-visible:outline-none [&>button:last-child]:hidden"
        aria-describedby="artwork-viewer-description"
      >
        <DialogTitle className="sr-only">{currentArtwork.title}</DialogTitle>
        <DialogDescription id="artwork-viewer-description" className="sr-only">
          {currentArtwork.title} by {currentArtwork.artist}, from {currentArtwork.game}
        </DialogDescription>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border-soft px-3.5 py-3">
          <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.14em] text-accent">
            {currentIndex + 1} / {artworks.length}
          </p>
          <DialogClose
            aria-label="Close viewer"
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-border bg-surface text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X className="h-4.5 w-4.5" />
          </DialogClose>
        </div>

        {/* Stage Area */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-3.5">
          <Carousel
            setApi={setApi}
            opts={{
              startIndex: initialIndex,
              loop: true,
            }}
            className="flex h-full w-full max-w-5xl items-center justify-center gap-2.5"
          >
            <CarouselPrevious
              className="relative inset-auto top-auto left-auto translate-x-0 translate-y-0 grid h-11 w-11 nav:h-12 nav:w-12 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
              aria-label="Previous artwork"
            />

            <CarouselContent className="m-0 flex h-full w-full flex-1 items-center">
              {artworks.map((art) => (
                <CarouselItem
                  key={art.id}
                  className="flex h-full w-full items-center justify-center p-0"
                >
                  <div className="relative flex h-[54vh] [@supports(height:100dvh)]:h-[54dvh] nav:h-[68vh] nav:[@supports(height:100dvh)]:h-[68dvh] max-h-[760px] w-full max-w-[760px] items-center justify-center overflow-hidden rounded-[14px] border border-border bg-surface-sunken [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
                    {art.image.src ? (
                      <img
                        src={art.image.src}
                        alt={art.image.alt || art.title}
                        className="max-h-full max-w-full object-contain"
                        style={
                          art.image.focalPoint
                            ? { objectPosition: art.image.focalPoint }
                            : undefined
                        }
                      />
                    ) : (
                      <p className="m-0 p-5 text-center font-mono text-[10px] leading-[1.7] tracking-[0.1em] text-dim">
                        FULL-SIZE ARTWORK
                        <br />
                        FOUNDER-SUPPLIED · MOCK
                      </p>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselNext
              className="relative inset-auto top-auto right-auto translate-x-0 translate-y-0 grid h-11 w-11 nav:h-12 nav:w-12 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
              aria-label="Next artwork"
            />
          </Carousel>
        </div>

        {/* Bottom Info Bar */}
        <div className="flex flex-col nav:flex-row items-stretch nav:items-center justify-between gap-3.5 border-t border-border-soft bg-background px-4.5 py-4 pb-[calc(18px+env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="m-0 text-[18px] leading-[1.25] font-bold tracking-[-0.02em] text-foreground">
              {currentArtwork.title}
            </p>
            <p className="mt-1.5 text-[14.5px] leading-[1.4] text-body">
              {currentArtwork.artist}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[12.5px] nav:text-[10.5px] leading-normal tracking-[0.06em] text-muted">
              {currentArtwork.game}
            </p>
          </div>

          <a
            href={currentArtwork.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("artwork_source_click", {
                artwork_id: currentArtwork.id,
              })
            }
            className={buttonVariants({
              variant: "surface",
              size: "default",
              className: "w-full nav:w-auto font-medium shrink-0",
            })}
          >
            View original post
            <span
              aria-hidden="true"
              className="font-mono text-[11px] text-muted"
            >
              ↗
            </span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
