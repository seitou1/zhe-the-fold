import { Hero } from "@/components/hero";
import { MenuList } from "@/components/menu-list";
import { SectionHeading } from "@/components/section-heading";
import { StorySection } from "@/components/story-section";
import { VisitSection } from "@/components/visit-section";
import { site } from "@/lib/site";

export default function Home() {
  const { menu } = site.sections;

  return (
    <>
      <Hero />

      <div className="relative z-0 mx-auto w-full max-w-6xl space-y-20 px-[var(--stage-x)] pb-24 pt-8 sm:space-y-28 sm:pb-32 sm:pt-10">
        <StorySection />

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
