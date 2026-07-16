import { HeroPanel } from "@/components/hero-panel";
import { MenuPanel } from "@/components/menu-panel";
import { SiteFooter } from "@/components/site-footer";
import { StoryPanel } from "@/components/story-panel";
import { VisitPanel } from "@/components/visit-panel";

/**
 * Four full-viewport panels + footer — original experience shape.
 * Content SSOT: lib/site · menu · story · hours
 */
export default function Home() {
  return (
    <main id="top">
      <HeroPanel />
      <StoryPanel />
      <MenuPanel />
      <VisitPanel />
      <SiteFooter />
    </main>
  );
}
