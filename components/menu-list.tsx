import Link from "next/link";
import {
  filterMenuItems,
  groupMenuItems,
  listMeta,
  listTitle,
  MENU_FILTERS,
  type MenuCategory,
  type MenuItem,
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
 * Menu ledger — progressive enhancement + dish thumbs.
 * Filters = ?cat= links. Rows = <details> with photo + copy.
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
              {group.items.map((item) => (
                <MenuRow key={item.id} item={item} />
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

function MenuRow({ item }: { item: MenuItem }) {
  const title = listTitle(item);
  const meta = listMeta(item);

  return (
    <li className="m-0 border-b border-cream/10 p-0">
      <details className="group">
        <summary className="grid cursor-pointer list-none grid-cols-[4.25rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 py-3.5 marker:content-none sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:gap-x-4 [&::-webkit-details-marker]:hidden">
          {/* Thumb — always visible */}
          <span className="relative row-span-2 block aspect-square w-full overflow-hidden rounded-sm bg-void ring-1 ring-cream/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </span>

          <span className="min-w-0 font-display text-[1.05rem] italic leading-snug text-cream sm:text-[1.15rem]">
            {title}
          </span>
          <span className="font-display text-[0.95rem] tabular-nums tracking-wide text-wheat sm:text-[1.05rem]">
            {item.price}
          </span>

          <span
            className="col-start-2 min-w-0 font-display text-[0.85rem] leading-snug text-cream/70 sm:text-[0.9rem]"
            lang="zh-Hans"
          >
            {item.cn}
          </span>
          <span className="col-start-3" aria-hidden />

          {meta ? (
            <span className="col-span-2 col-start-2 font-ui text-[0.68rem] uppercase tracking-[0.1em] text-wheat/80">
              {meta}
            </span>
          ) : null}
        </summary>

        {/* Expanded: larger plate + description */}
        <div className="grid gap-3 pb-4 pl-0 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-5 sm:pl-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-void ring-1 ring-cream/10 sm:aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="max-w-md font-ui text-sm leading-relaxed text-cream/85 sm:pt-1">
            {item.desc}
          </p>
        </div>
      </details>
    </li>
  );
}
