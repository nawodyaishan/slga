import { Container, SectionHeading } from "@/components/ui";
import type { SiteSettings } from "@/lib/content/types";

interface AboutProps {
  settings: SiteSettings;
}

export function About({ settings }: AboutProps) {
  return (
    <section aria-labelledby="slga-about-h" className="border-b border-border">
      <Container className="py-(--spacing-section)">
        <SectionHeading number="01" label="ABOUT SLGA" id="slga-about-h" heading={settings.aboutHeading.join(" ")} />
        <div className="mt-8 flex flex-wrap gap-10">
          {settings.aboutBody.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`min-w-0 max-w-[66ch] flex-[1_1_380px] text-lead leading-[1.68] ${index === 0 ? "text-body" : "text-muted"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-px overflow-hidden rounded-[14px] border border-border bg-border">
          {settings.aboutFacts.map((fact) => (
            <div key={fact.key} className="bg-surface-sunken px-6 py-[26px]">
              <p className="mb-3 font-mono text-label text-accent tracking-[0.14em]">{fact.key.toUpperCase()}</p>
              <p className="mb-1.5 text-[19px] leading-[1.25] font-semibold tracking-[-0.02em]">{fact.title}</p>
              <p className="m-0 text-sm leading-[1.55] text-muted">{fact.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
