"use client";

import { useMemo, useState } from "react";
import {
  groupMenuItems,
  listMeta,
  listTitle,
  MENU_ITEMS,
  type MenuItem,
} from "@/lib/menu";

/**
 * Menu panel — full-bleed dish plate + calm hybrid ledger.
 * Full menu with quiet chapter heads (Classic · Seasonal · Plant-based).
 * Rest rows: EN · price. Active row reveals CN, meta, description.
 * No exclusive filters — browse first; scalable via sections (+ jumps later).
 */
export function MenuPanel() {
  const groups = useMemo(() => groupMenuItems(MENU_ITEMS), []);
  const allItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );
  const [activeId, setActiveId] = useState(MENU_ITEMS[0]?.id ?? "pork");

  const active =
    allItems.find((i) => i.id === activeId) || allItems[0] || MENU_ITEMS[0];

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
        </header>

        <div className="menu-ledger">
          <div className="menu-list-view" role="region" aria-label="Dishes">
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
                  >
                    {group.items.map((item) => (
                      <MenuRow
                        key={item.id}
                        item={item}
                        active={item.id === active?.id}
                        onSelect={() => setActiveId(item.id)}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
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
