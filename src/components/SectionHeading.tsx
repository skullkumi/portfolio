export function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono text-xs tracking-[0.3em] text-accent/70">
        {index}
      </p>
      <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-lg text-sm text-muted">{subtitle}</p>
      <div className="mt-6 h-px w-24 origin-left bg-gradient-to-r from-accent/60 to-transparent" />
    </div>
  );
}
