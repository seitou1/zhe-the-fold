"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  groupMenuItems,
  listMeta,
  listTitle,
  MENU_ITEMS,
  type MenuItem,
} from "@/lib/menu";

/**
 * Menu panel — full-bleed dish plate + calm hybrid ledger.
 * Full menu with quiet in-list chapter heads only (no filter / jump pills).
 * Rest: EN · price. Active expands CN / meta / desc (fold motion).
 * Desktop hover previews the plate; keyboard ↑↓ channels through dishes.
 */
export function MenuPanel() {
  const groups = useMemo(() => groupMenuItems(MENU_ITEMS), []);
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const [activeId, setActiveId] = useState(MENU_ITEMS[0]?.id ?? "pork");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const finePointer = useRef(false);

  const active =
    allItems.find((i) => i.id === activeId) || allItems[0] || MENU_ITEMS[0];

  const wallId = previewId ?? activeId;
  const wallItem =
    allItems.find((i) => i.id === wallId) || active || MENU_ITEMS[0];

  /*
   * Plate crossfade — dual permanent layers; only is-active toggles
   * so opacity transitions (remounting with key skips the fade).
   */
  const [slotA, setSlotA] = useState(wallItem);
  const [slotB, setSlotB] = useState(wallItem);
  const [aActive, setAActive] = useState(true);
  const shownIdRef = useRef(wallItem.id);
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

  /** Keep expanded row fully inside .menu-list-view (not the window). */
  const ensureRowVisible = useCallback((id: string) => {
    const root = listRef.current;
    const el = rowRefs.current.get(id);
    if (!root || !el) return;

    const pad = 16;
    const er = el.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    let delta = 0;
    if (er.bottom > rr.bottom - pad) {
      delta = er.bottom - rr.bottom + pad;
    } else if (er.top < rr.top + pad) {
      delta = er.top - rr.top - pad;
    }
    if (delta !== 0) {
      root.scrollBy({ top: delta, behavior: "smooth" });
    }
  }, []);

  const selectDish = useCallback(
    (id: string, opts?: { focus?: boolean }) => {
      setActiveId(id);
      setPreviewId(null);

      const settle = () => {
        const el = rowRefs.current.get(id);
        if (!el) return;
        ensureRowVisible(id);
        if (opts?.focus) el.focus({ preventScroll: true });
      };

      // Before fold, after layout, and after expand (~280ms) so desc isn’t clipped
      requestAnimationFrame(() => {
        settle();
        requestAnimationFrame(settle);
      });
      window.setTimeout(settle, 320);
    },
    [ensureRowVisible]
  );

  const moveActive = useCallback(
    (delta: number) => {
      const idx = allItems.findIndex((i) => i.id === activeId);
      if (idx < 0) return;
      const next =
        allItems[Math.max(0, Math.min(allItems.length - 1, idx + delta))];
      if (next) selectDish(next.id, { focus: true });
    },
    [activeId, allItems, selectDish]
  );

  const onListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        const first = allItems[0];
        if (first) selectDish(first.id, { focus: true });
      } else if (e.key === "End") {
        e.preventDefault();
        const last = allItems[allItems.length - 1];
        if (last) selectDish(last.id, { focus: true });
      }
    },
    [allItems, moveActive, selectDish]
  );

  const posA = slotA?.position || "center center";
  const posB = slotB?.position || "center center";

  return (
    <section className="menu panel is-list-view" id="menu" data-tone="dark">
      <div className="menu-wall" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`menu-wall-img${aActive ? " is-active" : ""}`}
          src={slotA.image}
          alt=""
          width={1000}
          height={1000}
          style={{ objectPosition: posA }}
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`menu-wall-img${!aActive ? " is-active" : ""}`}
          src={slotB.image}
          alt=""
          width={1000}
          height={1000}
          style={{ objectPosition: posB }}
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
          <div
            ref={listRef}
            className="menu-list-view"
            role="region"
            aria-label="Dishes"
            tabIndex={-1}
            onKeyDown={onListKeyDown}
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
                      group.items.some((i) => i.id === activeId)
                        ? `menu-dish-${activeId}`
                        : undefined
                    }
                  >
                    {group.items.map((item) => (
                      <MenuRow
                        key={item.id}
                        item={item}
                        active={item.id === activeId}
                        preview={item.id === previewId && item.id !== activeId}
                        onSelect={() =>
                          selectDish(item.id, { focus: true })
                        }
                        onPreview={() => {
                          if (finePointer.current) setPreviewId(item.id);
                        }}
                        onPreviewEnd={() => {
                          if (finePointer.current) setPreviewId(null);
                        }}
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
  preview,
  onSelect,
  onPreview,
  onPreviewEnd,
  rowRef,
}: {
  item: MenuItem;
  active: boolean;
  preview: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPreviewEnd: () => void;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const title = listTitle(item);
  const meta = listMeta(item);

  return (
    <li
      id={`menu-dish-${item.id}`}
      ref={rowRef}
      role="option"
      tabIndex={active ? 0 : -1}
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
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
