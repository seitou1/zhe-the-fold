type SectionHeadingProps = {
  en: string;
  cn?: string;
  id?: string;
};

export function SectionHeading({ en, cn, id }: SectionHeadingProps) {
  return (
    <header className="mb-5 border-b border-line pb-4 sm:mb-6">
      <h2
        id={id}
        className="font-display text-[clamp(1.55rem,4vw,2.1rem)] font-normal italic leading-tight tracking-wide text-cream"
      >
        {en}
      </h2>
      {cn ? (
        <p
          className="mt-1 font-display text-sm tracking-[0.14em] text-cream/70 sm:text-base"
          lang="zh-Hans"
        >
          {cn}
        </p>
      ) : null}
    </header>
  );
}
