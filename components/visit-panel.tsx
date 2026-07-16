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
 * Title → Find us | Hours → Join us → Directions · Takeout · Table → social.
 * Storefront wall = space cue; copy SSOT = site.visit / site.service.
 */
export function VisitPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { media, service, visit, sections, social } = site;
  const videoReady = usePanelVideo(videoRef, panelRef, {
    src: media.storefrontVideo,
    srcMobile: media.storefrontVideoMobile,
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
          poster={media.storefrontPoster}
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.storefrontVideoLabel}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="visit-wall-img visit-wall-poster"
          src={media.storefrontPoster}
          alt=""
          width={1400}
          height={787}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
      </div>

      <div className="stage visit-stage">
        <div className="visit-band">
          <header className="visit-head">
            <div className="visit-head-title">
              <h2>
                <span className="en">{sections.visit.en}</span>
                <span className="cn" lang="zh-Hans">
                  {sections.visit.cn}
                </span>
              </h2>
            </div>
          </header>

          <div className="visit-spotlight">
            <div className="visit-facts">
              <div className="visit-fact visit-fact--find">
                <p className="visit-kicker">
                  <span className="en">{visit.findUs}</span>
                </p>
                <p className="visit-address">
                  {addressLines.map((line) => (
                    <span key={line} className="visit-address-line">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="visit-fact visit-fact--hours">
                <p className="visit-kicker">
                  <span className="en">{visit.hours}</span>
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

              <div className="visit-fact visit-fact--serve">
                <p className="visit-kicker">
                  <span className="en">{service.kicker}</span>
                </p>
                <ul className="visit-serve">
                  {service.modes.map((mode) => (
                    <li key={mode.id} className="visit-serve-row">
                      <span className="visit-serve-mode">{mode.label}</span>
                      <span className="visit-serve-detail">{mode.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <nav className="visit-actions" aria-label={visit.actionsAria}>
              <a
                className="visit-action"
                href={mapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="en">{service.actions.directions}</span>
              </a>
              <a
                className="visit-action visit-action--takeout"
                href={telHref()}
                aria-label={`${service.actions.takeout}: ${service.aria.takeoutCall} ${site.telephoneDisplay}`}
              >
                <span className="en">{service.actions.takeout}</span>
              </a>
              <a
                className="visit-action visit-action--table"
                href={reserveMailto()}
                aria-label={`${service.actions.table}: ${service.aria.tableEmail}`}
              >
                <span className="en">{service.actions.table}</span>
              </a>
            </nav>

            {social.instagram ? (
              <nav className="visit-social" aria-label={visit.socialAria}>
                <a
                  href={social.instagram}
                  className="visit-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.instagramLabel}
                </a>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
