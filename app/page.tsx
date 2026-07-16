import { HeroPanel } from "@/components/hero-panel";
import { MenuPanel } from "@/components/menu-panel";
import { SiteFooter } from "@/components/site-footer";
import { StoryPanel } from "@/components/story-panel";
import { VisitPanel } from "@/components/visit-panel";
import { getMenuItems } from "@/lib/data/menu";
import { getSiteOps } from "@/lib/data/site";
import { getStoryChapters } from "@/lib/data/story";

/**
 * Always fetch CMS content on request. Static lib/* fallback if env/DB fails.
 */
export const dynamic = "force-dynamic";

/**
 * Four full-viewport panels + footer.
 * Menu / story / visit ops: Supabase when configured, else static SSOT.
 */
export default async function Home() {
  const [menuItems, storyChapters, siteOps] = await Promise.all([
    getMenuItems(),
    getStoryChapters(),
    getSiteOps(),
  ]);

  return (
    <main id="top">
      <HeroPanel ops={siteOps} />
      <StoryPanel chapters={storyChapters} />
      <MenuPanel items={menuItems} ops={siteOps} />
      <VisitPanel ops={siteOps} />
      <SiteFooter />
    </main>
  );
}
