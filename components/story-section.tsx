import { SectionHeading } from "@/components/section-heading";
import { STORY_CHAPTERS } from "@/lib/story";
import { site } from "@/lib/site";

/**
 * Origins — all three chapters visible (no client JS / tabs).
 * Always tappable/readable on mobile even if React never hydrates.
 */
export function StorySection() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative scroll-mt-20"
    >
      <SectionHeading
        id="story-heading"
        en={site.sections.story.en}
        cn={site.sections.story.cn}
      />

      <div className="flex flex-col gap-12 sm:gap-16">
        {STORY_CHAPTERS.map((chapter) => (
          <article
            key={chapter.id}
            id={`story-${chapter.id}`}
            className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-void sm:aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={chapter.image}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: chapter.position }}
                loading={chapter.id === "village" ? "eager" : "lazy"}
                decoding="async"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/20"
              />
            </div>

            <div>
              <p className="mb-3 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat">
                {chapter.label}
              </p>
              <p className="max-w-md font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
                {chapter.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
