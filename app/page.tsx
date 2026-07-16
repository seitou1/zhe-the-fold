import { Hero } from "@/components/hero";
import { MenuList } from "@/components/menu-list";
import { SectionHeading } from "@/components/section-heading";
import { VisitSection } from "@/components/visit-section";
import { site } from "@/lib/site";

export default function Home() {
  const { story, menu } = site.sections;

  return (
    <>
      <Hero />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-[var(--stage-x)] pb-24 pt-6 sm:space-y-28 sm:pb-32">
        <section
          id="story"
          aria-labelledby="story-heading"
          className="scroll-mt-24"
        >
          <SectionHeading id="story-heading" en={story.en} cn={story.cn} />
          <p className="max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {story.body}
          </p>
        </section>

        <section
          id="menu"
          aria-labelledby="menu-heading"
          className="scroll-mt-24"
        >
          <SectionHeading id="menu-heading" en={menu.en} cn={menu.cn} />
          <p className="mb-8 max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {menu.body}
          </p>
          <MenuList />
        </section>

        <VisitSection />
      </div>
    </>
  );
}
