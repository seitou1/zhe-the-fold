"use client";

import { useRef } from "react";
import { getHoursDisplayLines } from "@/lib/hours";
import {
  formatAddressLines,
  mapsUrl,
  reserveMailto,
  site,
  telHref,
} from "@/lib/site";
import { usePanelVideo } from "@/lib/use-panel-video";

/**
 * Visit — logistics hierarchy (scan order):
 * Title → quiet lead → Find us | Hours → Directions · Call · Reserve → social.
 * Storefront loop only while panel is in view (balanced resources).
 */
export function VisitPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReady = usePanelVideo(videoRef, panelRef, {
    src: "/assets/storefront-loop.mp4",
    srcMobile: "/assets/storefront-loop-sm.mp4",
  });
  const addressLines = formatAddressLines();
  const hours = getHoursDisplayLines();

  return (
    <section
      ref={panelRef}
      className="visit panel"
      id="visit"
      data-tone="dark"
    >
      <div className="visit-wall" aria-hidden="true">
        <video
          ref={videoRef}
          className={`visit-wall-img visit-wall-video${videoReady ? " is-ready" : ""}`}
          poster="/assets/storefront.webp"
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Zhe · The Fold storefront at dusk"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="visit-wall-img visit-wall-poster"
          src="/assets/storefront.webp"
          alt=""
          width={1400}
          height={787}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div className="visit-wall-veil" />
      </div>

      <div className="stage visit-stage">
        <div className="visit-band">
          <header className="visit-head">
            <div className="visit-head-title">
              <h2>
                <span className="en">Visit</span>
                <span className="cn" lang="zh-Hans">
                  造访
                </span>
              </h2>
            </div>
            <p className="visit-head-lead">
              <span className="en">{site.sections.visit.body}</span>
            </p>
          </header>

          <div className="visit-spotlight">
            <div className="visit-facts">
              <div className="visit-fact visit-fact--find">
                <p className="visit-kicker">
                  <span className="en">Find us</span>
                </p>
                <p className="visit-address">
                  {addressLines.map((line) => (
                    <span key={line} className="visit-address-line">
                      {line}
                    </span>
                  ))}
                </p>
                {site.access ? (
                  <p className="visit-access">{site.access}</p>
                ) : null}
                {site.demoMode ? (
                  <p className="visit-access visit-access--demo">
                    Sample address — replace before launch.
                  </p>
                ) : null}
              </div>

              <div className="visit-fact visit-fact--hours">
                <p className="visit-kicker">
                  <span className="en">Hours</span>
                </p>
                <div className="visit-hours">
                  {hours.days ? (
                    <p className="visit-hours-days">{hours.days}</p>
                  ) : null}
                  {hours.times ? (
                    <p className="visit-hours-times">{hours.times}</p>
                  ) : null}
                  {hours.note ? (
                    <p className="visit-hours-note">{hours.note}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <nav className="visit-actions" aria-label="Visit actions">
              <a
                className="visit-action"
                href={mapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="en">Directions</span>
              </a>
              <a
                className="visit-action"
                href={telHref()}
                aria-label={`Call ${site.telephoneDisplay}`}
              >
                <span className="en">Call</span>
              </a>
              <a className="visit-action" href={reserveMailto()}>
                <span className="en">Reserve</span>
              </a>
            </nav>

            {site.social.instagram ? (
              <nav className="visit-social" aria-label="Social">
                <a
                  href={site.social.instagram}
                  className="visit-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
