import Link from "next/link";

export default function NotFound() {
  return <main className="centered"><p className="eyebrow">404</p><h1>Page not found.</h1><Link className="button" href="/">Return home</Link></main>;
}

