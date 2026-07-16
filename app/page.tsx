import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export default function Home() {
  const { story, menu, visit } = site.sections;

  return (
    <>
      <Hero />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-[var(--stage-x)] pb-24 pt-6 sm:space-y-28 sm:pb-32">
        <section id="story" aria-labelledby="story-heading" className="scroll-mt-24">
          <SectionHeading id="story-heading" en={story.en} cn={story.cn} />
          <p className="max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {story.body}
          </p>
        </section>

        <section id="menu" aria-labelledby="menu-heading" className="scroll-mt-24">
          <SectionHeading id="menu-heading" en={menu.en} cn={menu.cn} />
          <p className="max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {menu.body}
          </p>
          <p className="mt-4 font-ui text-sm text-wheat/80">
            Full ledger + dish wall coming next — data can land in Supabase.
          </p>
        </section>

        <section id="visit" aria-labelledby="visit-heading" className="scroll-mt-24">
          <SectionHeading id="visit-heading" en={visit.en} cn={visit.cn} />
          <p className="max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {visit.body}
          </p>
          <dl className="mt-6 grid max-w-md gap-3 font-ui text-sm text-cream/80">
            <div className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-cream/50">City</dt>
              <dd>{site.city}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-cream/50">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="text-wheat transition-colors hover:text-cream"
                >
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
