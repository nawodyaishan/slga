import type { SocialLink } from "@/lib/content/types";
import { Github, Linkedin } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  siteLinks: readonly FooterLink[];
  socialLinks: readonly SocialLink[];
}

/**
 * Global footer. Pure Server Component - everything it renders comes from
 * props, so it has no dependency on the content-boundary or analytics agents.
 */
export function Footer({ siteLinks, socialLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-footer">
      <div className="mx-auto grid max-w-(--spacing-shell) gap-10 px-(--spacing-gutter) py-14 nav:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-[30px] place-items-center rounded-[7px] border border-accent font-sans text-[13px] font-bold text-accent"
            >
              SL
            </span>
            <span className="font-sans text-[15px] font-bold tracking-[-0.02em] text-foreground">
              SLGA
            </span>
          </div>
          <p className="max-w-[34ch] text-[14.5px] leading-relaxed text-muted">
            The home for Sri Lankan gamers - community-built, community-run.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-label font-medium tracking-[0.14em] text-dim">SITE</p>
          <ul className="flex flex-col gap-1">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center text-[14.5px] text-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-label font-medium tracking-[0.14em] text-dim">COMMUNITY</p>
          <ul className="flex flex-col gap-1">
            {socialLinks.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2.5 text-[14.5px] text-muted hover:text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-6 flex-none place-items-center rounded-full border border-border-soft font-mono text-[11px] text-dim"
                  >
                    {social.mark}
                  </span>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border-soft">
        <div className="mx-auto flex max-w-(--spacing-shell) flex-col justify-between gap-4 px-(--spacing-gutter) pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] nav:pb-5 md:flex-row md:items-center">
          <p className="text-[12.5px] leading-relaxed text-dim">
            © {year} Sri Lankan Gaming Alliance. COMMUNITY-RUN · NOT AN OFFICIAL GOVERNING BODY.
          </p>
          <div className="flex items-center gap-3 text-[12.5px] text-dim">
            <span>Built by Nawodya Ishan</span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/nawodyaishan"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                aria-label="GitHub Profile"
              >
                <Github className="size-[15px]" />
              </a>
              <a
                href="https://www.linkedin.com/in/nawodyaishan/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="size-[15px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
