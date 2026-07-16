import { SectionHeading } from "@/components/section-heading";
import { getHoursDisplayLines } from "@/lib/hours";
import {
  formatAddressLines,
  mapsUrl,
  reserveMailto,
  site,
  telHref,
} from "@/lib/site";

/**
 * Visit — what matters after the menu: where, when, how to act.
 * Same facts as the static demo; sample NAP stays honest while demoMode.
 */
export function VisitSection() {
  const { visit } = site.sections;
  const addressLines = formatAddressLines();
  const hours = getHoursDisplayLines();

  return (
    <section id="visit" aria-labelledby="visit-heading" className="scroll-mt-24">
      <SectionHeading id="visit-heading" en={visit.en} cn={visit.cn} />
      <p className="mb-10 max-w-xl font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
        {visit.body}
      </p>

      <div className="grid max-w-2xl gap-10 sm:grid-cols-2 sm:gap-12">
        {/* Find us */}
        <div>
          <p className="mb-3 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat">
            Find us
          </p>
          <address className="not-italic">
            {addressLines.map((line) => (
              <p
                key={line}
                className="font-ui text-base leading-relaxed text-cream sm:text-lg"
              >
                {line}
              </p>
            ))}
          </address>
          {site.access ? (
            <p className="mt-2 font-ui text-sm text-cream/55">{site.access}</p>
          ) : null}
          {site.demoMode ? (
            <p className="mt-3 font-ui text-xs tracking-wide text-cream/40">
              Sample address — replace before launch.
            </p>
          ) : null}
        </div>

        {/* Hours */}
        <div>
          <p className="mb-3 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat">
            Hours
          </p>
          {hours.days ? (
            <p className="font-ui text-base text-cream sm:text-lg">{hours.days}</p>
          ) : null}
          {hours.times ? (
            <p className="mt-1 font-ui text-base tabular-nums text-cream/90 sm:text-lg">
              {hours.times}
            </p>
          ) : null}
          {hours.note ? (
            <p className="mt-2 font-ui text-sm text-cream/55">{hours.note}</p>
          ) : null}
          <p className="mt-2 font-ui text-xs text-cream/40">
            Eastern time · see nav for open now
          </p>
        </div>
      </div>

      {/* Actions — Directions · Reserve · Call */}
      <div className="relative z-10 mt-10 flex flex-wrap gap-3 sm:gap-4">
        <a
          href={mapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-sm border border-cream/25 px-5 py-3 font-ui text-sm tracking-[0.06em] text-cream transition-colors hover:border-wheat/50 hover:text-wheat active:bg-cream/5"
        >
          Directions
        </a>
        <a
          href={reserveMailto()}
          className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-sm bg-wheat px-5 py-3 font-ui text-sm tracking-[0.06em] text-void transition-opacity hover:opacity-90 active:opacity-80"
        >
          Reserve
        </a>
        <a
          href={telHref()}
          className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-sm border border-cream/25 px-5 py-3 font-ui text-sm tracking-[0.06em] text-cream transition-colors hover:border-wheat/50 hover:text-wheat active:bg-cream/5"
        >
          Call
        </a>
      </div>

      {site.social.instagram ? (
        <p className="mt-8">
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-sm tracking-wide text-cream/50 transition-colors hover:text-wheat"
          >
            Instagram
          </a>
        </p>
      ) : null}
    </section>
  );
}
