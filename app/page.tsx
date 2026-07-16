import { HeroPanel } from "@/components/hero-panel";
import { MenuPanel } from "@/components/menu-panel";
import { SiteFooter } from "@/components/site-footer";
import { StoryPanel } from "@/components/story-panel";
import { VisitPanel } from "@/components/visit-panel";
import { getMenuItems } from "@/lib/data/menu";
import { getStoryChapters } from "@/lib/data/story";

/**
 * Always fetch CMS content on request. Static lib/* fallback if env/DB fails.
 * Site ops (chrome) come from layout SiteOpsProvider.
 */
export const dynamic = "force-dynamic";

/**
 * Four full-viewport panels + footer.
 * Menu / story: Supabase when configured, else static SSOT.
 */
export default async function Home() {
  const [menuItems, storyChapters] = await Promise.all([
    getMenuItems(),
    getStoryChapters(),
  ]);

  return (
    <main id="top">
      <HeroPanel />
      <StoryPanel chapters={storyChapters} />
      <MenuPanel items={menuItems} />
      <VisitPanel />
      <SiteFooter />
    </main>
  );
}
