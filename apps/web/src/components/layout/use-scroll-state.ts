"use client";

import { useEffect, useState } from "react";

export interface ScrollState {
  /** Past the header's own height — used to strengthen its background/border. */
  scrolled: boolean;
  /** Deep enough into the page that the mobile CTA bar should appear. */
  deep: boolean;
}

const SCROLLED_AT = 12;
const DEEP_AT = 460;

/** Mirrors the design prototype's scroll thresholds (support.js `onScroll`). */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, deep: false });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const scrolled = y > SCROLLED_AT;
      const deep = y > DEEP_AT;
      setState((prev) => (prev.scrolled === scrolled && prev.deep === deep ? prev : { scrolled, deep }));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
