"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterMenuItems,
  groupMenuItems,
  listMeta,
  listTitle,
  MENU_FILTERS,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu";
import { useWallSwipe } from "@/components/use-wall-swipe";

type FilterId = "all" | MenuCategory;

/**
 * Menu — dual-buffer plate + left ledger.
 * Wall swipe only on .menu-wall (never ledger) — kit mobile lesson.
 */
export function MenuPanel() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState(MENU_ITEMS[0]?.id ?? "pork");
  const panelRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const imgA = useRef<HTMLImageElement>(null);
  const imgB = useRef<HTMLImageElement>(null);
  const activeIsA = useRef(true);

  const visible = useMemo(() => filterMenuItems(filter), [filter]);
  const active =
    visible.find((i) => i.id === activeId) || visible[0] || MENU_ITEMS[0];

  const groups = useMemo(() => {
    if (filter !== "all") {
      return [
        {
          category: filter,
          label: visible[0]?.catLabel || filter,
          items: visible,
        },
      ];
    }
    return groupMenuItems(visible);
  }, [filter, visible]);

  const setWall = useCallback((item: MenuItem, animate: boolean) => {
    if (!imgA.current || !imgB.current) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = item.position || "center center";
    const activeEl = activeIsA.current ? imgA.current : imgB.current;
    const idleEl = activeIsA.current ? imgB.current : imgA.current;

    if (!animate || reduced) {
      activeEl.src = item.image;
      activeEl.style.objectPosition = pos;
      activeEl.className = "menu-wall-img is-active";
      idleEl.className = "menu-wall-img";
      return;
    }

    const finish = () => {
      idleEl.className = "menu-wall-img is-active";
      activeEl.className = "menu-wall-img";
      activeIsA.current = !activeIsA.current;
      idleEl.onload = null;
    };

    idleEl.style.objectPosition = pos;
    idleEl.onload = finish;
    if (idleEl.getAttribute("src") === item.image) finish();
    else idleEl.src = item.image;
  }, []);

  useEffect(() => {
    if (active) setWall(active, true);
  }, [active, setWall]);

  const step = useCallback(
    (dir: number) => {
      if (!visible.length) return;
      const idx = Math.max(
        0,
        visible.findIndex((i) => i.id === activeId)
      );
      const next = visible[(idx + dir + visible.length) % visible.length];
      if (next) setActiveId(next.id);
    },
    [visible, activeId]
  );

  const onPrev = useCallback(() => step(-1), [step]);
  const onNext = useCallback(() => step(1), [step]);

  // Panel + axis lock: horizontal steps dishes; vertical leaves list scroll alone.
  // Wall-only fails on phone because .menu-ledger is full-width over the plate.
  useWallSwipe({
    rootRef: panelRef,
    onPrev,
    onNext,
    ignoreSelector:
      "button, a, input, .filter-btn, .menu-head, .nav, .nav-links",
  });

  const seed = MENU_ITEMS[0];

  return (
    <section
      className="menu panel is-list-view"
      id="menu"
      data-tone="dark"
      ref={panelRef}
    >
      <div className="menu-wall" ref={wallRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgA}
          className="menu-wall-img is-active"
          src={seed.image}
          alt=""
          width={1000}
          height={1000}
          style={{ objectPosition: seed.position || "center center" }}
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgB}
          className="menu-wall-img"
          src={seed.image}
          alt=""
          width={1000}
          height={1000}
          style={{ objectPosition: seed.position || "center center" }}
          decoding="async"
        />
        <div className="menu-wall-veil" />
        <div className="menu-wall-grain" />
      </div>

      <div className="stage menu-stage">
        <header className="menu-head">
          <div className="menu-head-title">
            <h2>
              <span className="en">The Menu</span>
              <span className="cn" lang="zh-Hans">
                菜单
              </span>
            </h2>
          </div>
          <div className="menu-filters" role="group" aria-label="Menu categories">
            {MENU_FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-btn${on ? " is-active" : ""}`}
                  aria-pressed={on}
                  onClick={() => {
                    setFilter(f.id);
                    const next = filterMenuItems(f.id);
                    if (next[0]) setActiveId(next[0].id);
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="menu-ledger">
          <ul className="menu-list-view" role="listbox" aria-label="Dishes">
            {groups.map((group) => (
              <Fragment key={group.category}>
                {filter === "all" ? (
                  <li
                    className="menu-list-group"
                    role="presentation"
                    data-group={group.category}
                  >
                    <span className="menu-list-group-label">{group.label}</span>
                  </li>
                ) : null}
                {group.items.map((item) => (
                  <MenuRow
                    key={item.id}
                    item={item}
                    active={item.id === active?.id}
                    onSelect={() => setActiveId(item.id)}
                  />
                ))}
              </Fragment>
            ))}
          </ul>
          <p className="menu-note">
            <span className="en">
              Steamed or pan-seared · Share allergies · About eight per order
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function MenuRow({
  item,
  active,
  onSelect,
}: {
  item: MenuItem;
  active: boolean;
  onSelect: () => void;
}) {
  const title = listTitle(item);
  const meta = listMeta(item);

  return (
    <li
      role="option"
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      className={`menu-list-item${active ? " is-active" : ""}${meta ? " has-meta" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <span className="list-en">{title}</span>
      <span className="list-price">{item.price}</span>
      <span className="list-cn" lang="zh-Hans">
        {item.cn}
      </span>
      {meta ? <span className="list-meta">{meta}</span> : null}
      <span className="list-desc">{item.desc}</span>
    </li>
  );
}
