"use client";

import type { MouseEvent, ReactNode } from "react";

type HashLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/**
 * In-page #section links that work on mobile Safari / App Router.
 * Native hash alone is flaky after client navigation; we scroll explicitly.
 */
export function HashLink({
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: HashLinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Keep URL in sync without full navigation
    window.history.replaceState(null, "", href);
  };

  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
}
