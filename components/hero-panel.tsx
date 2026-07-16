"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/** Full-bleed hero panel — poster LCP + muted loop (original grammar) */
export function HeroPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

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
    <section className="hero panel" id="hero" data-tone="dark">
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
          preload="metadata"
          aria-label="Handmade dumplings on worn ceramic at Zhe · The Fold"
        >
          <source src="/assets/hero-loop.mp4" type="video/mp4" />
        </video>
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
          <p className="hero-tagline">
            <span className="en">{site.heroTagline}</span>
          </p>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
