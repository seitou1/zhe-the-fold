"use client";

import { useRef } from "react";
import type { SiteOps } from "@/lib/data/site";
import { site } from "@/lib/site";
import { usePanelVideo } from "@/lib/use-panel-video";

/** Full-bleed hero — poster LCP + in-view muted loop (balanced load) */
export function HeroPanel({ ops }: { ops: SiteOps }) {
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { media } = site;
  const videoReady = usePanelVideo(videoRef, panelRef, {
    src: media.heroVideo,
    srcMobile: media.heroVideoMobile,
  });

  return (
    <section
      ref={panelRef}
      className="hero panel"
      id="hero"
      data-tone="dark"
    >
      <div className="hero-bg">
        <video
          ref={videoRef}
          className={`hero-img hero-video${videoReady ? " is-ready" : ""}`}
          poster={media.heroPoster}
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.heroVideoLabel}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-img hero-poster"
          src={media.heroPoster}
          alt=""
          width={1280}
          height={704}
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
        />
        <div className="hero-ambient" aria-hidden="true">
          <div className="hero-glow" />
          <div className="hero-steam">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="stage hero-stage">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="en">{site.city}</span>
          </p>
          <h1 className="hero-title">
            <span className="title-cn" lang="zh-Hans" aria-hidden="true">
              {site.nameCn}
            </span>
            <span className="title-en">{site.name}</span>
          </h1>
          <p className="hero-line">
            <span className="en">{ops.heroLine}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
