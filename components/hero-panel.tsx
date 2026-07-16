"use client";

import { useRef } from "react";
import { site } from "@/lib/site";
import { usePanelVideo } from "@/lib/use-panel-video";

/** Full-bleed hero — poster LCP + in-view muted loop (balanced load) */
export function HeroPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReady = usePanelVideo(videoRef, panelRef, {
    src: "/assets/hero-loop.mp4",
    srcMobile: "/assets/hero-loop-sm.mp4",
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
          poster="/assets/hero-dumplings.webp"
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Handmade dumplings on worn ceramic at Zhe · The Fold"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-img hero-poster"
          src="/assets/hero-dumplings.webp"
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
            <span className="en">{site.heroLine}</span>
          </p>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
