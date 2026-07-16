"use client";

import { useMemo, useState } from "react";
import {
  filterMenuItems,
  listMeta,
  listTitle,
  MENU_CATEGORY_ORDER,
  MENU_FILTERS,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu";

type FilterId = "all" | MenuCategory;

/**
 * Menu panel — full-bleed dish plate + calm hybrid ledger.
 * Rest rows: English name + price. Active row reveals CN, meta, description.
 * Chapter filters only — never group headers in the list.
 */
export function MenuPanel() {
  const [filter, setFilter] = useState<FilterId>("classic");
  const [activeId, setActiveId] = useState(MENU_ITEMS[0]?.id ?? "pork");

  const visible = useMemo(() => {
    const items = filterMenuItems(filter);
    if (filter !== "all") return items;
    // Flat list ordered Classic → Seasonal → Plant, no group labels
    return [...items].sort(
      (a, b) =>
        MENU_CATEGORY_ORDER.indexOf(a.category) -
        MENU_CATEGORY_ORDER.indexOf(b.category)
    );
  }, [filter]);

  const active =
    visible.find((i) => i.id === activeId) || visible[0] || MENU_ITEMS[0];

  const pos = active?.position || "center center";

  return (
    <section className="menu panel is-list-view" id="menu" data-tone="dark">
      <div className="menu-wall" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active?.id}
          className="menu-wall-img is-active"
          src={active?.image}
          alt=""
          width={1000}
          height={1000}
          style={{ objectPosition: pos }}
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
            {visible.map((item) => (
              <MenuRow
                key={item.id}
                item={item}
                active={item.id === active?.id}
                onSelect={() => setActiveId(item.id)}
              />
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
  const showMeta = active && Boolean(meta);

  return (
    <li
      role="option"
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      className={`menu-list-item${active ? " is-active" : ""}${showMeta ? " has-meta" : ""}`}
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
      {active ? (
        <>
          <span className="list-cn" lang="zh-Hans">
            {item.cn}
          </span>
          {meta ? <span className="list-meta">{meta}</span> : null}
          <span className="list-desc">{item.desc}</span>
        </>
      ) : null}
    </li>
  );
}
