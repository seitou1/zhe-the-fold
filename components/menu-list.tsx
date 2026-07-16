"use client";

import { useMemo, useState } from "react";
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

type FilterId = "all" | MenuCategory;

/**
 * Scannable menu ledger — type-first, left-aligned.
 * Filters + expand-for-desc; no photo wall yet (port later).
 */
export function MenuList() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState<string | null>(MENU_ITEMS[0]?.id ?? null);

  const visible = useMemo(() => filterMenuItems(filter), [filter]);
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

  return (
    <div className="w-full max-w-xl">
      {/* Category filters — same set as original */}
      <div
        role="group"
        aria-label="Menu categories"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-line pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MENU_FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setFilter(f.id);
                const next = filterMenuItems(f.id);
                setActiveId(next[0]?.id ?? null);
              }}
              className={`relative z-10 min-h-11 shrink-0 touch-manipulation px-3 py-2.5 font-ui text-[0.85rem] tracking-[0.08em] transition-colors sm:text-[0.88rem] ${
                on
                  ? "text-wheat"
                  : "text-cream/55 hover:text-cream/85 active:text-cream"
              }`}
            >
              <span
                className={`border-b pb-0.5 ${
                  on ? "border-wheat" : "border-transparent"
                }`}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col" role="listbox" aria-label="Dishes">
        {groups.map((group) => (
          <div key={group.category} className="mb-2">
            {filter === "all" ? (
              <p className="mb-1 border-b border-line/60 pb-2 pt-4 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat first:pt-0">
                {group.label}
              </p>
            ) : null}

            <ul className="list-none p-0">
              {group.items.map((item) => (
                <MenuRow
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  onSelect={() =>
                    setActiveId((id) => (id === item.id ? null : item.id))
                  }
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-line pt-4 font-ui text-[0.7rem] leading-relaxed tracking-wide text-cream/50">
        Steamed or pan-seared · Share allergies · About eight per order
      </p>
    </div>
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
    <li role="option" aria-selected={active}>
      <button
        type="button"
        onClick={onSelect}
        className={`group relative z-10 grid w-full touch-manipulation grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 border-b border-cream/10 py-3.5 text-left transition-colors ${
          active
            ? "border-wheat/35 bg-gradient-to-r from-wheat/[0.06] to-transparent"
            : "hover:border-cream/20 active:bg-cream/[0.03]"
        }`}
      >
        <span className="flex min-w-0 items-baseline gap-2 font-display text-[1.05rem] italic leading-snug text-cream sm:text-[1.15rem]">
          <span className="min-w-0">{title}</span>
          {/* Print-menu leader dots */}
          <span
            className="mb-[0.35em] hidden min-w-[1.5rem] flex-1 border-b border-dotted border-cream/30 sm:block"
            aria-hidden
          />
        </span>

        <span className="font-display text-[0.95rem] tabular-nums tracking-wide text-wheat sm:text-[1.05rem]">
          {item.price}
        </span>

        <span
          className="col-span-2 font-display text-[0.85rem] leading-snug text-cream/70 sm:text-[0.9rem]"
          lang="zh-Hans"
        >
          {item.cn}
        </span>

        {meta ? (
          <span className="col-span-2 mt-0.5 font-ui text-[0.68rem] uppercase tracking-[0.1em] text-wheat/80">
            {meta}
          </span>
        ) : null}

        {active ? (
          <span className="col-span-2 mt-1.5 max-w-md font-ui text-sm leading-relaxed text-cream/85">
            {item.desc}
          </span>
        ) : null}
      </button>
    </li>
  );
}
