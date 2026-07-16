import { HeroPanel } from "@/components/hero-panel";
import { MenuPanel } from "@/components/menu-panel";
import { SiteFooter } from "@/components/site-footer";
import { StoryPanel } from "@/components/story-panel";
import { VisitPanel } from "@/components/visit-panel";
import { getMenuItems } from "@/lib/data/menu";

/**
 * Four full-viewport panels + footer.
 * Menu dishes: Supabase when configured, else lib/menu.ts.
 */
export default async function Home() {
  const menuItems = await getMenuItems();

  return (
    <main id="top">
      <HeroPanel />
      <StoryPanel />
      <MenuPanel items={menuItems} />
      <VisitPanel />
      <SiteFooter />
    </main>
  );
}
