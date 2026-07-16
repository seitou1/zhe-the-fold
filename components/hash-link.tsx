import type { ReactNode } from "react";

type HashLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/**
 * Plain in-page anchors — native browser behavior (no client JS).
 * Most reliable on mobile Safari over LAN.
 */
export function HashLink({
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: HashLinkProps) {
  return (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
