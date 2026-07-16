import type { Metadata } from "next";
import { Outfit, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-source-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-void font-ui text-cream">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
