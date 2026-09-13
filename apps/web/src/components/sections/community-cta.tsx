import { Container, Eyebrow } from "@/components/ui";
import { CommunityCtaLink } from "./community-cta-link";

interface CommunityCtaProps {
  discordUrl: string;
  facebookUrl: string;
}

/**
 * The page's final conversion point. Neither "hero" nor "header" describes
 * this section, so its clicks are tracked under the `footer` placement
 * (TECH-SPEC.md §15 defines only header/hero/footer) - a deliberate
 * approximation, not a mislabel of the literal page footer below it.
 */
export function CommunityCta({ discordUrl, facebookUrl }: CommunityCtaProps) {
  return (
    <section aria-labelledby="slga-cta-h" className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_100%_at_50%_120%,rgba(32,214,231,.12)_0%,rgba(32,214,231,0)_65%)]"
      />
      <Container className="relative py-(--spacing-section)">
        <div className="mx-auto max-w-[56ch] text-center">
          <Eyebrow className="mb-4.5 justify-center">JOIN THE COMMUNITY</Eyebrow>
          <h2 id="slga-cta-h" className="m-0 text-h2 leading-[1.08] font-bold tracking-[-0.03em]">
            Two rooms, one community
          </h2>
          <p className="mt-4.5 text-lead leading-[1.65] text-muted">
            Discord for voice, LFG and daily chat. Facebook for reach, posts and discussion. Both are free and both
            are moderated by the same team.
          </p>
        </div>
        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
          <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-(--spacing-card)">
            <p className="m-0 font-mono text-[10px] tracking-[0.14em] text-accent">DISCORD</p>
            <h3 className="m-0 text-h3 leading-[1.15] font-bold tracking-[-0.025em]">Where the day happens</h3>
            <p className="m-0 flex-1 text-[15px] leading-[1.6] text-muted">
              Voice channels, looking-for-group posts, screenshot rooms and weekend sessions. The fastest way to
              actually play with other Sri Lankan gamers.
            </p>
            <CommunityCtaLink
              destination="discord"
              placement="footer"
              url={discordUrl}
              className="flex min-h-13 items-center justify-center gap-2.5 rounded-[10px] bg-accent font-sans text-base font-semibold text-accent-ink"
            >
              Join Discord
              <span aria-hidden="true" className="font-mono text-xs opacity-55">
                ↗
              </span>
            </CommunityCtaLink>
          </div>
          <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface-sunken p-(--spacing-card)">
            <p className="m-0 font-mono text-[10px] tracking-[0.14em] text-muted">FACEBOOK</p>
            <h3 className="m-0 text-h3 leading-[1.15] font-bold tracking-[-0.025em]">Where the community lives</h3>
            <p className="m-0 flex-1 text-[15px] leading-[1.6] text-muted">
              66,000+ members, years of posts, and the widest reach in Sri Lankan gaming. Read the rules first -
              every post is reviewed against them.
            </p>
            <CommunityCtaLink
              destination="facebook"
              placement="footer"
              url={facebookUrl}
              className="flex min-h-13 items-center justify-center gap-2.5 rounded-[10px] border border-border bg-transparent font-sans text-base font-medium text-foreground"
            >
              Join Facebook Community
              <span aria-hidden="true" className="font-mono text-xs text-muted">
                ↗
              </span>
            </CommunityCtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
