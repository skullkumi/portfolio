"use client";

import { site } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function AboutSection() {
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden border-t border-border"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading index="04" title="About" subtitle="短い自己紹介" />

        <Reveal className="grid items-center gap-10 md:grid-cols-[auto_1fr]" stagger={0.07}>
          <div className="relative mx-auto md:mx-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-card to-[#0e0e18] font-mono text-3xl text-foreground shadow-depth">
              K
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-medium tracking-tight">{site.name}</h3>
            <p className="text-spectrum text-lg">{site.tagline}</p>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              {site.description}
              コラボレーションや空間演出のご相談を歓迎しています。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
