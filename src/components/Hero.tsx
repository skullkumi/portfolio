"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { HeroShaderDisplay } from "./HeroShaderDisplay";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!content || !section) return;

    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .from(".hero-title", { y: 36, opacity: 0, duration: 1, ease: "power3.out" })
      .from(".hero-tagline", { y: 20, opacity: 0, duration: 0.8 }, "-=0.65")
      .from(".hero-sub", { y: 14, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-cta", { y: 10, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.35");

    const scrollOut = gsap.to(content, {
      y: -50,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      intro.kill();
      scrollOut.scrollTrigger?.kill();
      scrollOut.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      <HeroShaderDisplay sectionRef={sectionRef} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#04040a] via-[#04040a]/80 to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-14 pt-28 md:px-10 md:pb-20">
        <div ref={contentRef} className="mx-auto w-full max-w-3xl text-center">
          <p className="hero-eyebrow mb-5 font-mono text-[10px] uppercase tracking-[0.45em] text-white/50">
            <span className="text-accent-amber">signal</span>
            <span> · </span>
            <span className="text-accent">pixel</span>
            <span> · </span>
            <span className="text-accent-ice">space</span>
          </p>

          <h1 className="hero-title text-depth text-6xl font-medium tracking-tighter text-white md:text-8xl lg:text-9xl">
            {site.name}
          </h1>

          <p className="hero-tagline text-spectrum mt-5 text-xl md:text-2xl">
            {site.tagline}
          </p>

          <p className="hero-sub mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
            デジタル空間に吸い込まれるビジュアル。
            音と光が交差する、その先へ。
          </p>

          <div className="hero-cta mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#shaders"
              className="shadow-depth inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-mono text-xs uppercase tracking-wider text-background transition hover:bg-accent-magenta"
            >
              view works
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/30 px-8 py-3.5 font-mono text-xs uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-accent-amber/50"
            >
              collaborate
            </a>
          </div>

          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.4em] text-white/35">
            scroll
          </p>
        </div>
      </div>
    </section>
  );
}
