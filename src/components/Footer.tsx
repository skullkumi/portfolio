import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-background/95 px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-mono text-xs text-foreground/85">
            &copy; {year} kumi — 音と光の空間設計
          </p>
          <p className="mt-1 font-mono text-[10px] text-muted/70">
            site v{site.version}
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted/60">
          built with Next.js / GSAP / Lenis
        </p>
      </div>
    </footer>
  );
}
