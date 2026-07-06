type SectionGridProps = {
  tone?: "pink" | "yellow";
};

export function SectionGrid({ tone = "pink" }: SectionGridProps) {
  return (
    <div
      className={`section-grid pointer-events-none absolute inset-0 section-grid-${tone}`}
      aria-hidden
    />
  );
}
