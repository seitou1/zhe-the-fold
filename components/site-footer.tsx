"use client";

import { useSiteOps } from "@/components/site-ops-provider";

export function SiteFooter() {
  const ops = useSiteOps();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-stage">
        <div className="footer-brand">
          <span className="logo-cn" lang="zh-Hans" aria-hidden="true">
            {ops.nameCn}
          </span>
          <span className="logo-en">{ops.name}</span>
        </div>
        <p className="footer-tag">
          <span className="en">{ops.footerTag}</span>
        </p>
        <p className="footer-copy">
          © {year} {ops.name}. {ops.footerRights}
        </p>
      </div>
    </footer>
  );
}
