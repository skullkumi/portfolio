"use client";

import { works } from "@/data/site";
import { MediaCard } from "./MediaCard";
import { Reveal } from "./Reveal";
import { SectionGrid } from "./SectionGrid";
import { SectionHeading } from "./SectionHeading";

export function WorksSection() {
  return (
    <section id="works" className="section-padding relative overflow-hidden bg-[#07070c]/88">
      <SectionGrid tone="violet" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          title="Works"
          subtitle="音と光が交差する空間の記録"
        />

        <Reveal className="grid gap-8" stagger={0.12}>
          {works.map((work, i) => (
            <div key={work.id} className={i % 2 === 1 ? "md:pl-12" : "md:pr-12"}>
              <MediaCard
                title={work.title}
                description={`${work.description}（${work.year}）`}
                tags={work.tags}
                videoSrc={work.videoSrc}
                posterSrc={work.posterSrc}
                linkUrl={work.linkUrl}
                linkLabel={work.linkLabel}
                aspect="wide"
                parallax
                parallaxDepth={6}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
