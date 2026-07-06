"use client";

import { shaders } from "@/data/site";
import { MediaCard } from "./MediaCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ShadersSection() {
  return (
    <section id="shaders" className="section-padding relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          index="01"
          title="Shaders"
          subtitle="Unity Shader の録画・プレビュー（今後追加予定）"
        />

        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.12}>
          {shaders.map((shader) => (
            <MediaCard
              key={shader.id}
              title={shader.title}
              description={shader.description}
              tags={shader.tags}
              videoSrc={shader.videoSrc}
              posterSrc={shader.posterSrc}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
