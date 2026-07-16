import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { ShellChrome } from "@/components/shell-chrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Handmade Dumplings in New York`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${site.name} | Handmade Dumplings in New York`,
    description: site.description,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12100e",
};

/**
 * Craft shell — structure mirrors static index.html chrome.
 * Panel CSS from zhe-craft.css (ported styles.css). Kit: AGENTS / BUILD_PLAYBOOK.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="/assets/fonts/fonts.css"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>褶</text></svg>"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/hero-dumplings.webp"
          type="image/webp"
        />
      </head>
      <body>
        <a className="skip-link" href="#menu">
          Skip to menu
        </a>
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <ShellChrome />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
