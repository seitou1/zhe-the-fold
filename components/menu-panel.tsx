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
  MENU_CHAPTERS,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu";

/**
 * Menu panel — full-bleed dish plate + calm hybrid ledger.
 * Full menu with chapter heads + sticky jump / scroll-spy.
 * Rest: EN · price. Active expands CN / meta / desc (fold motion).
 * Desktop hover previews the plate; keyboard ↑↓ channels through dishes.
 */
export function MenuPanel() {
  const groups = useMemo(() => groupMenuItems(MENU_ITEMS), []);
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const [activeId, setActiveId] = useState(MENU_ITEMS[0]?.id ?? "pork");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [spyChapter, setSpyChapter] = useState<MenuCategory>(
    groups[0]?.category ?? "classic"
  );

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

  /* ── Scroll-spy on chapters inside list scroller ── */
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(".menu-list-group[data-chapter]")
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
          );
        const top = visible[0]?.target as HTMLElement | undefined;
        const ch = top?.dataset.chapter as MenuCategory | undefined;
        if (ch) setSpyChapter(ch);
      },
      {
        root,
        rootMargin: "-8% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [groups]);

  const selectDish = useCallback(
    (id: string, opts?: { scroll?: boolean; focus?: boolean }) => {
      setActiveId(id);
      setPreviewId(null);
      if (opts?.scroll || opts?.focus) {
        requestAnimationFrame(() => {
          const el = rowRefs.current.get(id);
          if (!el) return;
          if (opts.scroll) {
            el.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
          if (opts.focus) el.focus({ preventScroll: true });
        });
      }
    },
    []
  );

  const jumpChapter = useCallback(
    (category: MenuCategory) => {
      const root = listRef.current;
      const section = root?.querySelector<HTMLElement>(`#menu-${category}`);
      if (section && root) {
        const sticky =
          root.querySelector<HTMLElement>(".menu-chapters")?.offsetHeight ?? 0;
        const next =
          root.scrollTop +
          section.getBoundingClientRect().top -
          root.getBoundingClientRect().top -
          sticky -
          2;
        root.scrollTo({ top: Math.max(0, next), behavior: "smooth" });
      }
      setSpyChapter(category);
      const first = groups.find((g) => g.category === category)?.items[0];
      if (first) selectDish(first.id, { focus: false });
    },
    [groups, selectDish]
  );

  const moveActive = useCallback(
    (delta: number) => {
      const idx = allItems.findIndex((i) => i.id === activeId);
      if (idx < 0) return;
      const next =
        allItems[Math.max(0, Math.min(allItems.length - 1, idx + delta))];
      if (next) selectDish(next.id, { scroll: true, focus: true });
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
        if (first) selectDish(first.id, { scroll: true, focus: true });
      } else if (e.key === "End") {
        e.preventDefault();
        const last = allItems[allItems.length - 1];
        if (last) selectDish(last.id, { scroll: true, focus: true });
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
            <nav
              className="menu-chapters"
              aria-label="Menu chapters"
            >
              {MENU_CHAPTERS.map((ch) => {
                const on = spyChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    className={`menu-chapter-btn${on ? " is-active" : ""}`}
                    aria-current={on ? "true" : undefined}
                    onClick={() => jumpChapter(ch.id)}
                  >
                    {ch.label}
                  </button>
                );
              })}
            </nav>

            {groups.map((group) => {
              const labelId = `menu-chapter-${group.category}`;
              return (
                <section
                  key={group.category}
                  className="menu-list-group"
                  id={`menu-${group.category}`}
                  data-chapter={group.category}
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
