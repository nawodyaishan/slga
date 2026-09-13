import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Container, Eyebrow } from "@/components/ui";
import { rulesPortableTextComponents } from "@/components/portable-text/rules-portable-text";
import { CommunityCtaLink } from "./community-cta-link";
import { content } from "@/lib/content";
import type { Locale } from "@/lib/content/types";

interface RulesPageProps {
  locale: Locale;
  discordUrl: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** Shared by `/rules` and `/si/rules` - only the locale differs. */
export async function RulesPage({ locale, discordUrl }: RulesPageProps) {
  const [rules, settings] = await Promise.all([content.getRules(), content.getSiteSettings()]);
  const copy = settings.rules;

  return (
    <div lang={locale}>
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,#253041_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(100%_100%_at_50%_0%,#000_0%,transparent_75%)]"
        />
        <Container className="relative pt-(--spacing-page-top) pb-(--spacing-section)">
          <div className="max-w-[70ch]">
            <Eyebrow bar className="mb-[22px]">
              COMMUNITY RULES
            </Eyebrow>
            <h1 className="m-0 text-h1-page leading-[1.04] font-extrabold tracking-[-0.03em]">{copy.heading[locale]}</h1>
            <p className="mt-6 text-lead leading-[1.7] text-body">{copy.intro[locale]}</p>
            <div className="mt-7.5 flex flex-wrap items-center gap-x-6.5 gap-y-3 border-t border-border pt-6">
              <div role="group" aria-label="Rules language" className="flex gap-1.5 rounded-[11px] border border-border bg-surface p-1.5">
                <Link
                  href="/rules"
                  aria-current={locale === "en" ? "page" : undefined}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-[15px] ${
                    locale === "en" ? "bg-accent font-semibold text-accent-ink" : "font-normal text-muted"
                  }`}
                >
                  {locale === "en" && <span aria-hidden="true" className="font-mono text-[10px]">✓</span>}
                  English
                </Link>
                <Link
                  href="/si/rules"
                  lang="si"
                  hrefLang="si"
                  aria-current={locale === "si" ? "page" : undefined}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 font-sinhala text-[15px] ${
                    locale === "si" ? "bg-accent font-semibold text-accent-ink" : "font-normal text-muted"
                  }`}
                >
                  {locale === "si" && <span aria-hidden="true" className="font-mono text-[10px]">✓</span>}
                  සිංහල
                </Link>
              </div>
              <p className="m-0 font-mono text-[11px] leading-[1.5] tracking-[0.06em] text-muted">
                LAST UPDATED{" "}
                <time dateTime={copy.lastUpdated} className="text-foreground">
                  {dateFormatter.format(new Date(copy.lastUpdated))}
                </time>
              </p>
            </div>
            {content.provisional && (
              <p className="mt-6 rounded-[10px] border border-border border-l-2 border-l-accent bg-surface-sunken px-4 py-3.5 text-[13.5px] leading-[1.6] text-muted">
                These rule bodies are migration input from the legacy Sinhala-only group and are pending founder
                review before they are treated as final (English translations especially).
              </p>
            )}
          </div>
        </Container>
      </section>

      <Container className="flex flex-wrap items-start gap-(--spacing-layout-gap) py-(--spacing-section)">
        <nav
          aria-label="Rules index"
          className="hidden min-w-0 flex-[0_1_250px] wide:sticky wide:top-(--spacing-anchor) wide:block"
        >
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.14em] text-muted">INDEX · {rules.length} RULES</p>
          <ol className="m-0 flex max-h-[calc(100vh-180px)] list-none flex-col gap-0.5 overflow-auto p-0">
            {rules.map((rule) => (
              <li key={rule.id}>
                <a
                  href={`#rule-${rule.displayOrder}`}
                  lang={locale}
                  className="flex min-h-10 items-baseline gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] leading-[1.4] text-muted hover:bg-surface hover:text-foreground"
                >
                  <span className="font-mono text-[10.5px] leading-[1.6] text-accent">
                    {String(rule.displayOrder).padStart(2, "0")}
                  </span>
                  {rule.title[locale]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <nav aria-label="Rules index" className="order-first w-full wide:hidden">
          <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-muted">JUMP TO RULE</p>
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
            {rules.map((rule) => (
              <li key={rule.id}>
                <a
                  href={`#rule-${rule.displayOrder}`}
                  aria-label={`Rule ${rule.displayOrder}: ${rule.title[locale]}`}
                  className="grid min-h-11 min-w-11 place-items-center rounded-[10px] border border-border bg-surface-sunken font-mono text-[13px] font-semibold text-body hover:border-accent hover:text-accent"
                >
                  {String(rule.displayOrder).padStart(2, "0")}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-(--spacing-rule-gap)">
          {rules.map((rule) => (
            <article
              key={rule.id}
              id={`rule-${rule.displayOrder}`}
              className="border-b border-border-soft pb-(--spacing-rule-gap) [scroll-margin-top:var(--spacing-anchor)]"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-11 flex-none place-items-center rounded-[10px] border border-border bg-surface-sunken font-mono text-lg font-semibold tracking-[-0.02em] text-accent"
                >
                  {String(rule.displayOrder).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 lang={locale} className="m-0 text-h3 leading-[1.25] font-bold tracking-[-0.02em] break-words">
                    <span className="sr-only">Rule {rule.displayOrder}: </span>
                    {rule.title[locale]}
                  </h2>
                  <div lang={locale} className="mt-4 flex flex-col gap-3.5">
                    <PortableText value={rule.body[locale]} components={rulesPortableTextComponents} />
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4.5 rounded-2xl border border-border bg-surface p-(--spacing-card)">
            <div className="min-w-0">
              <h2 className="m-0 text-h3 leading-[1.2] font-bold tracking-[-0.025em]">{copy.outroTitle[locale]}</h2>
              <p className="mt-2.5 max-w-[52ch] text-[15px] leading-[1.6] text-muted">{copy.outroBody[locale]}</p>
            </div>
            <CommunityCtaLink
              destination="discord"
              placement="footer"
              url={discordUrl}
              className="flex min-h-13 items-center gap-2.5 rounded-[10px] bg-accent px-6 font-sans text-base font-semibold whitespace-nowrap text-accent-ink"
            >
              Join Discord
              <span aria-hidden="true" className="font-mono text-xs opacity-55">
                ↗
              </span>
            </CommunityCtaLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
