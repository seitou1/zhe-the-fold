import { Hero } from "@/components/hero";
import { MenuList } from "@/components/menu-list";
import { SectionHeading } from "@/components/section-heading";
import { StorySection } from "@/components/story-section";
import { VisitSection } from "@/components/visit-section";
import { site } from "@/lib/site";

type HomeProps = {
  searchParams: Promise<{ cat?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { menu } = site.sections;

  return (
    <>
      <Hero />

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-20 px-[var(--stage-x)] pb-24 pt-10 sm:space-y-28 sm:pb-32 sm:pt-14">
        <StorySection />

        <section
          id="menu"
          aria-labelledby="menu-heading"
          className="relative scroll-mt-20"
        >
          <SectionHeading id="menu-heading" en={menu.en} cn={menu.cn} />
          <p className="mb-8 max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {menu.body}
          </p>
          <MenuList filter={params.cat} />
        </section>

        <div className="relative">
          <VisitSection />
        </div>
      </div>
    </>
  );
}
