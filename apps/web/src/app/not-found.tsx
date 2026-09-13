import Link from "next/link";
import { Container, buttonVariants } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(#253041_1px,transparent_1px),linear-gradient(90deg,#253041_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(70%_70%_at_50%_50%,#000_0%,transparent_70%)]"
      />
      <Container className="relative py-(--spacing-section) text-center">
        <p className="mx-auto mb-6.5 font-mono text-[11px] tracking-[0.2em] text-accent">ERROR 404</p>
        <p aria-hidden="true" className="m-0 text-ghost leading-[0.85] font-extrabold tracking-[-0.05em] text-surface">
          404
        </p>
        <h1 className="-mt-[0.12em] text-h2 leading-[1.08] font-bold tracking-[-0.03em]">This page is off the map</h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-lead leading-[1.65] text-muted">
          The link may be old, or the page may have moved. Everything current is one of these doors.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({
              variant: "solid",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Back to home
          </Link>
          <Link
            href="/rules"
            className={buttonVariants({
              variant: "surface",
              size: "lg",
              className: "w-full sm:w-auto font-medium",
            })}
          >
            Read the rules
          </Link>
        </div>
      </Container>
    </div>
  );
}
