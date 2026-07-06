"use client";

import { services } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionGrid } from "./SectionGrid";
import { SectionHeading } from "./SectionHeading";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <SectionGrid tone="amber" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          title="Services"
          subtitle="依頼・コラボ可能な領域"
        />

        <Reveal className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {services.map((service) => (
            <article
              key={service.id}
              className="shadow-depth flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent-amber/25 hover:shadow-depth-lg"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-accent-amber/80">
                {service.id}
              </span>
              <h3 className="mt-3 text-lg font-medium">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
