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
 * Scannable menu ledger — plain buttons (no listbox roles; cleaner on iOS).
 */
export function MenuList() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState<string | null>(
    MENU_ITEMS[0]?.id ?? null
  );

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
    <div className="relative w-full max-w-xl">
      <div
        className="mb-6 flex gap-1 overflow-x-auto border-b border-line pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Menu categories"
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
              className={`min-h-12 shrink-0 px-3 py-3 font-ui text-[0.9rem] tracking-[0.08em] ${
                on ? "text-wheat" : "text-cream/60 active:text-cream"
              }`}
            >
              <span
                className={`border-b-2 pb-1 ${
                  on ? "border-wheat" : "border-transparent"
                }`}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        {groups.map((group) => (
          <div key={group.category} className="mb-2">
            {filter === "all" ? (
              <p className="mb-1 border-b border-line/60 pb-2 pt-4 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat first:pt-0">
                {group.label}
              </p>
            ) : null}

            <ul className="m-0 list-none p-0">
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
    <li className="m-0 p-0">
      <button
        type="button"
        onClick={onSelect}
        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 border-b border-cream/10 py-4 text-left ${
          active
            ? "border-wheat/35 bg-wheat/[0.06]"
            : "active:bg-cream/[0.04]"
        }`}
      >
        <span className="font-display text-[1.08rem] italic leading-snug text-cream sm:text-[1.15rem]">
          {title}
        </span>
        <span className="font-display text-[1rem] tabular-nums tracking-wide text-wheat">
          {item.price}
        </span>
        <span
          className="col-span-2 font-display text-[0.88rem] leading-snug text-cream/70"
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
          <span className="col-span-2 mt-2 max-w-md font-ui text-sm leading-relaxed text-cream/85">
            {item.desc}
          </span>
        ) : null}
      </button>
    </li>
  );
}
