import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentScore",
  description: "Reputation system for AI agents on Kite Mainnet.",
  icons: {
    icon: "/brand/kite-logo-mark-beige.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <img className="brand-logo" src="/brand/kite-logo-beige.png" alt="Kite" />
              AgentScore
            </Link>
            <nav className="nav" aria-label="Primary">
              <Link href="/">Overview</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <Link href="/agents">Lookup</Link>
              <a href="https://github.com/gnanam1990/agentscore-app" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
