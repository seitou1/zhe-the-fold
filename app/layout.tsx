import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/components/site-nav";
import { ShellChrome } from "@/components/shell-chrome";
import { SiteOpsProvider } from "@/components/site-ops-provider";
import { getSiteOps } from "@/lib/data/site";
import { opsSiteTitle } from "@/lib/data/site-helpers";
import { site } from "@/lib/site";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: site.seo.themeColor,
};

/**
 * Craft shell — structure mirrors static index.html chrome.
 * Content from Supabase site_settings + menu/story tables (static fallback).
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ops = await getSiteOps();
  const title = opsSiteTitle(ops);

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={ops.description} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={ops.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={site.seo.locale} />
        <link rel="stylesheet" href="/assets/fonts/fonts.css" />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodeURIComponent(ops.nameCn)}</text></svg>`}
        />
        <link
          rel="preload"
          as="image"
          href={site.media.heroPoster}
          type="image/webp"
        />
      </head>
      <body>
        <SiteOpsProvider ops={ops}>
          <a className="skip-link" href={ops.skipToMenuHref}>
            {ops.skipToMenu}
          </a>
          <div className="grain" aria-hidden="true" />
          <ShellChrome />
          <SiteNav />
          {children}
        </SiteOpsProvider>
      </body>
    </html>
  );
}

// Keep type export for tooling that expects Metadata
export type { Metadata };
