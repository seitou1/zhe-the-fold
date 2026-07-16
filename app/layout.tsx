import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/components/site-nav";
import { ShellChrome } from "@/components/shell-chrome";
import { site, siteTitleDefault } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteTitleDefault(),
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: siteTitleDefault(),
    description: site.description,
    type: "website",
    locale: site.seo.locale,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: site.seo.themeColor,
};

/**
 * Craft shell — structure mirrors static index.html chrome.
 * Panel CSS from zhe-craft.css. Content SSOT: lib/site · menu · story · hours.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/fonts/fonts.css" />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodeURIComponent(site.nameCn)}</text></svg>`}
        />
        <link
          rel="preload"
          as="image"
          href={site.media.heroPoster}
          type="image/webp"
        />
      </head>
      <body>
        <a className="skip-link" href={site.ui.skipToMenuHref}>
          {site.ui.skipToMenu}
        </a>
        <div className="grain" aria-hidden="true" />
        <ShellChrome />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
