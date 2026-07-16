import Link from "next/link";
import {
  filterMenuItems,
  groupMenuItems,
  listMeta,
  listTitle,
  MENU_FILTERS,
  type MenuCategory,
} from "@/lib/menu";

type FilterId = "all" | MenuCategory;

type MenuListProps = {
  /** From URL ?cat= — works with zero client JS */
  filter?: string;
};

function normalizeFilter(raw?: string): FilterId {
  if (raw === "classic" || raw === "seasonal" || raw === "plant") return raw;
  return "all";
}

/**
 * Menu ledger — progressive enhancement.
 * Filters = real links (?cat=). Rows = <details>/<summary> (native expand).
 * No useState / no client bundle required for taps to work on mobile.
 */
export function MenuList({ filter: filterProp }: MenuListProps) {
  const filter = normalizeFilter(filterProp);
  const visible = filterMenuItems(filter);
  const groups =
    filter === "all"
      ? groupMenuItems(visible)
      : [
          {
            category: filter,
            label: visible[0]?.catLabel || filter,
            items: visible,
          },
        ];

  return (
    <div className="relative w-full max-w-xl">
      <div
        className="mb-6 flex gap-1 overflow-x-auto border-b border-line pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Menu categories"
      >
        {MENU_FILTERS.map((f) => {
          const on = filter === f.id;
          const href =
            f.id === "all" ? "/#menu" : `/?cat=${encodeURIComponent(f.id)}#menu`;
          return (
            <Link
              key={f.id}
              href={href}
              scroll={true}
              className={`inline-flex min-h-12 shrink-0 items-center px-3 py-3 font-ui text-[0.9rem] tracking-[0.08em] ${
                on ? "text-wheat" : "text-cream/60 active:text-cream"
              }`}
              aria-current={on ? "true" : undefined}
            >
              <span
                className={`border-b-2 pb-1 ${
                  on ? "border-wheat" : "border-transparent"
                }`}
              >
                {f.label}
              </span>
            </Link>
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
              {group.items.map((item) => {
                const title = listTitle(item);
                const meta = listMeta(item);
                return (
                  <li
                    key={item.id}
                    className="m-0 border-b border-cream/10 p-0"
                  >
                    <details className="group">
                      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
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
                      </summary>
                      <p className="max-w-md pb-4 font-ui text-sm leading-relaxed text-cream/85">
                        {item.desc}
                      </p>
                    </details>
                  </li>
                );
              })}
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
