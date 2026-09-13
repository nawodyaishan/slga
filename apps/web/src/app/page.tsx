import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/">SLGA<span>.</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/rules">Rules</Link>
          <Link href="/announcements">Announcements</Link>
          <a className="button button-small" href="https://discord.com" target="_blank" rel="noopener noreferrer">Join Discord ↗</a>
        </nav>
      </header>
      <section className="hero" aria-labelledby="hero-heading">
        <p className="eyebrow">Sri Lankan Gaming Alliance</p>
        <h1 id="hero-heading">The home for Sri Lankan gamers.</h1>
        <p className="hero-copy">A welcoming community for players, creators, and everyone who loves games.</p>
        <div className="actions">
          <a className="button" href="https://www.facebook.com/groups/slgaofficial" target="_blank" rel="noopener noreferrer">Join Facebook ↗</a>
          <Link className="button button-secondary" href="/rules">Read the rules</Link>
        </div>
      </section>
      <section className="foundation-note" aria-labelledby="foundation-heading">
        <p className="eyebrow">Phase 1 foundation</p>
        <h2 id="foundation-heading">A faster, maintainable SLGA home is taking shape.</h2>
        <p>Content will be managed in Sanity and published through the Next.js App Router.</p>
      </section>
    </main>
  );
}

