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

export async function generateMetadata(): Promise<Metadata> {
  const ops = await getSiteOps();
  const title = opsSiteTitle(ops);
  return {
    title: {
      default: title,
      template: `%s · ${ops.shortName}`,
    },
    description: ops.description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: ops.description,
      type: "website",
      locale: site.seo.locale,
    },
    icons: {
      icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodeURIComponent(ops.nameCn)}</text></svg>`,
    },
  };
}

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

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/fonts/fonts.css" />
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
