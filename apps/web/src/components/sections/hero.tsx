import { Container, Eyebrow } from "@/components/ui";
import { CommunityCtaLink } from "./community-cta-link";
import type { SiteSettings } from "@/lib/content/types";

interface HeroProps {
  settings: SiteSettings;
  discordUrl: string;
  facebookUrl: string;
}

const ctaBase =
  "flex min-h-[54px] flex-1 items-center justify-center gap-2.5 rounded-[10px] px-6 font-sans text-[16px] leading-none tracking-[-0.01em] sm:flex-none";

export function Hero({ settings, discordUrl, facebookUrl }: HeroProps) {
  return (
    <section aria-labelledby="slga-hero-h" className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_120%_at_88%_-10%,rgba(94,58,196,.38)_0%,rgba(94,58,196,0)_58%),radial-gradient(70%_90%_at_4%_108%,rgba(32,214,231,.16)_0%,rgba(32,214,231,0)_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(#253041_1px,transparent_1px),linear-gradient(90deg,#253041_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(120%_90%_at_50%_0%,#000_10%,transparent_72%)]"
      />
      <Container className="relative flex flex-wrap items-center gap-10 pt-(--spacing-hero-top) pb-(--spacing-hero-bottom)">
        <div className="animate-rise min-w-0 flex-[1_1_440px]">
          <Eyebrow bar className="mb-[22px]">
            {settings.heroEyebrow}
          </Eyebrow>
          <h1 id="slga-hero-h" className="m-0 text-h1 leading-[0.98] font-extrabold tracking-[-0.035em]">
            {settings.heroHeading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-[26px] max-w-[52ch] text-lead leading-[1.6] text-muted">{settings.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <CommunityCtaLink
              destination="discord"
              placement="hero"
              url={discordUrl}
              className={`${ctaBase} bg-accent font-semibold text-accent-ink`}
            >
              Join Discord
              <span aria-hidden="true" className="font-mono text-xs opacity-55">
                ↗
              </span>
            </CommunityCtaLink>
            <CommunityCtaLink
              destination="facebook"
              placement="hero"
              url={facebookUrl}
              className={`${ctaBase} border border-border bg-surface font-medium text-foreground`}
            >
              Join Facebook Community
              <span aria-hidden="true" className="font-mono text-xs text-muted">
                ↗
              </span>
            </CommunityCtaLink>
          </div>
          <div className="mt-9 flex items-center gap-3.5 border-t border-border pt-[26px]">
            <span className="text-stat font-bold tracking-[-0.03em]">{settings.memberCount.toLocaleString()}+</span>
            <span className="text-[13.5px] leading-[1.45] text-muted">
              {settings.memberCountLabel}
              <br />
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-dim">
                {settings.memberCountSource}
              </span>
            </span>
          </div>
        </div>
        <div className="animate-rise-slow min-w-0 flex-[1_1_330px]">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-border [background:repeating-linear-gradient(135deg,#111722_0_11px,#0D131E_11px_22px)]">
            {settings.heroImage?.src ? (
              <img
                src={settings.heroImage.src}
                alt={settings.heroImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(8,11,18,.9)] to-transparent to-55%"
            />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 z-10 bg-accent" />
          </div>
        </div>
      </Container>
    </section>
  );
}
