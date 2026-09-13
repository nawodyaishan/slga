import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Sri Lankan Gaming Alliance", template: "%s | SLGA" },
  description: "The home for Sri Lankan gamers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}

