"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  groupMenuItems,
  listMeta,
  listTitle,
  type MenuItem,
} from "@/lib/menu";
import { site } from "@/lib/site";

/**
 * Menu panel — full-bleed dish plate + calm hybrid ledger.
 * Dishes come from getMenuItems() (Supabase or static fallback).
 * Rest: EN · price. Active expands CN / meta / desc (fold motion).
 */
export function MenuPanel({ items }: { items: MenuItem[] }) {
  const groups = useMemo(() => groupMenuItems(items), [items]);
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const defaultId = items[0]?.id ?? "pork";

  /** null = all rows closed (default on first visit); re-tap collapses open row */
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  /** Last open dish — keeps the plate when the list is fully collapsed */
  const [lastOpenId, setLastOpenId] = useState<string>(defaultId);

  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const finePointer = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<string | null>(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const wallId = previewId ?? activeId ?? lastOpenId;
  const wallItem =
    allItems.find((i) => i.id === wallId) || allItems[0] || null;

  /*
   * Plate crossfade — dual permanent layers; only is-active toggles
   * so opacity transitions (remounting with key skips the fade).
   */
  const [slotA, setSlotA] = useState<MenuItem | null>(wallItem);
  const [slotB, setSlotB] = useState<MenuItem | null>(wallItem);
  const [aActive, setAActive] = useState(true);
  const shownIdRef = useRef(wallItem?.id ?? "");
  const aActiveRef = useRef(true);

  useEffect(() => {
    if (!wallItem || wallItem.id === shownIdRef.current) return;
    shownIdRef.current = wallItem.id;
    if (aActiveRef.current) {
      setSlotB(wallItem);
      aActiveRef.current = false;
      setAActive(false);
    } else {
      setSlotA(wallItem);
      aActiveRef.current = true;
      setAActive(true);
    }
  }, [wallItem]);

  /* ── Fine pointer (hover preview only when true) ── */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => {
      finePointer.current = mq.matches;
      if (!mq.matches) setPreviewId(null);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /**
   * Keep expanded row inside .menu-list-view.
   * Instant scroll only — smooth + multi-fire was stacking while folds ran.
   */
  const ensureRowVisible = useCallback((id: string) => {
    const root = listRef.current;
    const el = rowRefs.current.get(id);
    if (!root || !el) return;
    if (id !== activeIdRef.current) return;

    const pad = 12;
    const er = el.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    let delta = 0;
    if (er.bottom > rr.bottom - pad) {
      delta = er.bottom - rr.bottom + pad;
    } else if (er.top < rr.top + pad) {
      delta = er.top - rr.top - pad;
    }
    if (Math.abs(delta) > 1) {
      root.scrollTop += delta;
    }
  }, []);

  const selectDish = useCallback(
    (id: string, opts?: { focus?: boolean }) => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }

      /* Second tap / Enter on the open row collapses it */
      if (activeIdRef.current === id) {
        activeIdRef.current = null;
        setActiveId(null);
        setPreviewId(null);
        requestAnimationFrame(() => {
          const el = rowRefs.current.get(id);
          if (opts?.focus && el) el.focus({ preventScroll: true });
        });
        return;
      }

      activeIdRef.current = id;
      setLastOpenId(id);
      setActiveId(id);
      setPreviewId(null);

      // Focus now; wait for open fold once, then a single scroll
      requestAnimationFrame(() => {
        const el = rowRefs.current.get(id);
        if (opts?.focus && el) el.focus({ preventScroll: true });
      });

      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        if (activeIdRef.current !== id) return;
        ensureRowVisible(id);
      }, 220);
    },
    [ensureRowVisible]
  );

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  const moveActive = useCallback(
    (delta: number) => {
      const idx = allItems.findIndex((i) => i.id === activeIdRef.current);
      if (idx < 0) {
        /* Nothing open — open first/last from keyboard direction */
        const pick =
          delta > 0 ? allItems[0] : allItems[allItems.length - 1];
        if (pick) selectDish(pick.id, { focus: true });
        return;
      }
      const next =
        allItems[Math.max(0, Math.min(allItems.length - 1, idx + delta))];
      if (next && next.id !== activeIdRef.current) {
        selectDish(next.id, { focus: true });
      }
    },
    [allItems, selectDish]
  );

  const onDishKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, dishId: string) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        e.stopPropagation();
        moveActive(1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        moveActive(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        e.stopPropagation();
        const first = allItems[0];
        if (first) selectDish(first.id, { focus: true });
      } else if (e.key === "End") {
        e.preventDefault();
        e.stopPropagation();
        const last = allItems[allItems.length - 1];
        if (last) selectDish(last.id, { focus: true });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        selectDish(dishId, { focus: true });
      } else if (e.key === "Escape") {
        if (activeIdRef.current) {
          e.preventDefault();
          e.stopPropagation();
          selectDish(activeIdRef.current, { focus: true });
        }
      }
    },
    [allItems, moveActive, selectDish]
  );

  const wallVars = (item: typeof slotA): CSSProperties =>
    ({
      ["--menu-pos" as string]: item?.position || "center 52%",
      ["--menu-pos-m" as string]:
        item?.positionMobile || item?.position || "center 48%",
    }) as CSSProperties;

  return (
    <section className="menu panel is-list-view" id="menu" data-tone="dark">
      <div className="menu-wall" aria-hidden="true">
        {slotA ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={`menu-wall-img${aActive ? " is-active" : ""}`}
            src={slotA.image}
            alt=""
            width={1000}
            height={1000}
            style={wallVars(slotA)}
            decoding="async"
          />
        ) : null}
        {slotB ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={`menu-wall-img${!aActive ? " is-active" : ""}`}
            src={slotB.image}
            alt=""
            width={1000}
            height={1000}
            style={wallVars(slotB)}
            decoding="async"
          />
        ) : null}
      </div>

      <div className="stage menu-stage">
        <header className="menu-head">
          <div className="menu-head-title">
            <h2>
              <span className="en">{site.sections.menu.en}</span>
              <span className="cn" lang="zh-Hans">
                {site.sections.menu.cn}
              </span>
            </h2>
          </div>
        </header>

        <div className="menu-ledger">
          <div
            ref={listRef}
            className="menu-list-view"
            role="region"
            aria-label={site.menu.dishesAria}
          >
            {groups.map((group) => {
              const labelId = `menu-chapter-${group.category}`;
              return (
                <section
                  key={group.category}
                  className="menu-list-group"
                  id={`menu-${group.category}`}
                  aria-labelledby={labelId}
                >
                  <h3 className="menu-list-group-label" id={labelId}>
                    {group.label}
                  </h3>
                  <ul
                    className="menu-list-group-items"
                    role="listbox"
                    aria-labelledby={labelId}
                    aria-activedescendant={
                      activeId && group.items.some((i) => i.id === activeId)
                        ? `menu-dish-${activeId}`
                        : undefined
                    }
                  >
                    {group.items.map((item) => (
                      <MenuRow
                        key={item.id}
                        item={item}
                        active={item.id === activeId}
                        preview={
                          item.id === previewId && item.id !== activeId
                        }
                        onSelect={() =>
                          selectDish(item.id, { focus: true })
                        }
                        onPreview={() => {
                          if (finePointer.current) setPreviewId(item.id);
                        }}
                        onPreviewEnd={() => {
                          if (finePointer.current) setPreviewId(null);
                        }}
                        onKeyDown={(e) => onDishKeyDown(e, item.id)}
                        rowRef={(el) => {
                          if (el) rowRefs.current.set(item.id, el);
                          else rowRefs.current.delete(item.id);
                        }}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
          <p className="menu-note">
            <span className="en">{site.menu.note}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function MenuRow({
  item,
  active,
  preview,
  onSelect,
  onPreview,
  onPreviewEnd,
  onKeyDown,
  rowRef,
}: {
  item: MenuItem;
  active: boolean;
  preview: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPreviewEnd: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const title = listTitle(item);
  const meta = listMeta(item);

  return (
    <li
      id={`menu-dish-${item.id}`}
      ref={rowRef}
      role="option"
      tabIndex={0}
      aria-selected={active}
      className={[
        "menu-list-item",
        active ? "is-active" : "",
        preview ? "is-preview" : "",
        meta ? "has-meta" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onSelect}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      onKeyDown={onKeyDown}
    >
      <span className="list-en">{title}</span>
      <span className="list-price">{item.price}</span>
      <div className="list-detail">
        <div className="list-detail-inner">
          <span className="list-cn" lang="zh-Hans">
            {item.cn}
          </span>
          {meta ? <span className="list-meta">{meta}</span> : null}
          <span className="list-desc">{item.desc}</span>
        </div>
      </div>
    </li>
  );
}
