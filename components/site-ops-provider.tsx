"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteOps } from "@/lib/data/site";
import { siteOpsFromStaticFallback } from "@/lib/data/site-static";

const SiteOpsContext = createContext<SiteOps | null>(null);

export function SiteOpsProvider({
  ops,
  children,
}: {
  ops: SiteOps;
  children: ReactNode;
}) {
  return (
    <SiteOpsContext.Provider value={ops}>{children}</SiteOpsContext.Provider>
  );
}

export function useSiteOps(): SiteOps {
  const ctx = useContext(SiteOpsContext);
  if (!ctx) {
    // SSR safety / missing provider — static craft defaults
    return siteOpsFromStaticFallback();
  }
  return ctx;
}
