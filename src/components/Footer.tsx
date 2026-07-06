export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} kumi — sound & light spatial design
        </p>
        <p className="font-mono text-[10px] text-muted/60">
          built with Next.js / GSAP / Lenis
        </p>
      </div>
    </footer>
  );
}
