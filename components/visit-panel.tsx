"use client";

import { useRef } from "react";
import { useSiteOps } from "@/components/site-ops-provider";
import {
  opsAddressLines,
  opsMapsUrl,
  opsReserveMailto,
  opsTelHref,
} from "@/lib/data/site-helpers";
import { getHoursDisplayLines } from "@/lib/hours";
import { site } from "@/lib/site";
import { usePanelVideo } from "@/lib/use-panel-video";

/**
 * Visit — logistics hierarchy.
 * All guest copy from SiteOps CMS (or static fallback).
 */
export function VisitPanel() {
  const ops = useSiteOps();
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { media, service, visit } = site;
  const videoReady = usePanelVideo(videoRef, panelRef, {
    src: media.storefrontVideo,
    srcMobile: media.storefrontVideoMobile,
  });
  const addressLines = opsAddressLines(ops);
  const hours = getHoursDisplayLines(ops.hours, ops.kitchen);
  const modes = [
    {
      id: "table",
      label: ops.modeTableLabel,
      detail: ops.tableDetail,
    },
    {
      id: "takeout",
      label: ops.modeTakeoutLabel,
      detail: ops.takeoutDetail,
    },
  ];

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
                <span className="en">{ops.sectionVisitEn}</span>
                <span className="cn" lang="zh-Hans">
                  {ops.sectionVisitCn}
                </span>
              </h2>
            </div>
          </header>

          <div className="visit-spotlight">
            <div className="visit-facts">
              <div className="visit-fact visit-fact--find">
                <p className="visit-kicker">
                  <span className="en">{ops.visitFindUs}</span>
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
                  <span className="en">{ops.visitHoursLabel}</span>
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
                  <span className="en">{ops.serviceKicker}</span>
                </p>
                <ul className="visit-serve">
                  {modes.map((mode) => (
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
                href={opsMapsUrl(ops)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="en">{ops.actionDirections}</span>
              </a>
              <a
                className="visit-action visit-action--takeout"
                href={opsTelHref(ops)}
                aria-label={`${ops.actionCall}: ${service.aria.takeoutCall} ${ops.telephoneDisplay}`}
              >
                <span className="en">{ops.actionCall}</span>
              </a>
              <a
                className="visit-action visit-action--table"
                href={opsReserveMailto(ops)}
                aria-label={`${ops.actionReserve}: ${service.aria.tableEmail}`}
              >
                <span className="en">{ops.actionReserve}</span>
              </a>
            </nav>

            {ops.instagram ? (
              <nav className="visit-social" aria-label={visit.socialAria}>
                <a
                  href={ops.instagram}
                  className="visit-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ops.instagramLabel}
                </a>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
