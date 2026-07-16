"use client";

import { useEffect, useRef, useState } from "react";
import { getHoursDisplayLines } from "@/lib/hours";
import {
  formatAddressLines,
  mapsUrl,
  reserveMailto,
  site,
  telHref,
} from "@/lib/site";

/** Visit panel — storefront wall + facts / CTAs (original grammar) */
export function VisitPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const addressLines = formatAddressLines();
  const hours = getHoursDisplayLines();

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const v = videoRef.current;
    if (!v || reduced) return;

    const onReady = () => {
      setVideoReady(true);
      void v.play().catch(() => {});
    };
    if (v.readyState >= 2) onReady();
    else {
      v.addEventListener("loadeddata", onReady, { once: true });
      v.addEventListener("canplay", onReady, { once: true });
    }
    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
    };
  }, []);

  return (
    <section className="visit panel" id="visit" data-tone="dark">
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
          preload="metadata"
          aria-label="Zhe · The Fold storefront at dusk"
        >
          <source src="/assets/storefront-loop.mp4" type="video/mp4" />
        </video>
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
            <div className="visit-fact">
              <p className="visit-kicker">
                <span className="en">Find us</span>
              </p>
              <p className="visit-address">
                {addressLines.map((line) => (
                  <span key={line} style={{ display: "block" }}>
                    {line}
                  </span>
                ))}
              </p>
              {site.access ? (
                <p className="visit-access">{site.access}</p>
              ) : null}
              {site.demoMode ? (
                <p className="visit-access" style={{ opacity: 0.55 }}>
                  Sample address — replace before launch.
                </p>
              ) : null}
            </div>
            <div className="visit-fact">
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

          <div className="visit-actions">
            <a
              className="visit-action"
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="en">Directions</span>
            </a>
            <a className="visit-action" href={reserveMailto()}>
              <span className="en">Reserve</span>
            </a>
            <a className="visit-action" href={telHref()}>
              <span className="en">Call</span>
            </a>
          </div>

          <nav className="visit-social" aria-label="Social">
            {site.social.instagram ? (
              <a
                href={site.social.instagram}
                className="visit-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            ) : null}
          </nav>
        </div>
      </div>
    </section>
  );
}
