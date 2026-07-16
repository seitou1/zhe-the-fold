import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-stage">
        <div className="footer-brand">
          <span className="logo-cn" lang="zh-Hans" aria-hidden="true">
            {site.nameCn}
          </span>
          <span className="logo-en">{site.name}</span>
        </div>
        <p className="footer-tag">
          <span className="en">{site.ui.footerTag}</span>
        </p>
        <p className="footer-copy">
          © {year} {site.name}. {site.ui.footerRights}
        </p>
      </div>
    </footer>
  );
}
