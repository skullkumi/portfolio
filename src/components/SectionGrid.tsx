type SectionGridProps = {
  tone?: "cyan" | "violet" | "amber" | "magenta";
};

export function SectionGrid({ tone = "cyan" }: SectionGridProps) {
  return (
    <div
      className={`section-grid pointer-events-none absolute inset-0 section-grid-${tone}`}
      aria-hidden
    />
  );
}
