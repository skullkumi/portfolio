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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a080c] via-[#0a080c]/35 to-transparent" />
      <div className="hero-light-band pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 md:h-48" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-14 pt-28 md:px-10 md:pb-20">
        <div ref={contentRef} className="mx-auto w-full max-w-3xl text-center">
          <p className="hero-eyebrow mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
            <span className="text-accent-amber/90">signal</span>
            <span> · </span>
            <span className="text-accent/90">pixel</span>
            <span> · </span>
            <span className="text-accent-ice/90">space</span>
          </p>

          <h1 className="hero-title font-display text-depth text-6xl font-medium tracking-tight text-[#f5f0e8] md:text-8xl lg:text-9xl">
            {site.name}
          </h1>

          <p className="hero-tagline font-display mt-5 text-xl font-medium md:text-2xl text-[#f0e6d8]/95">
            {site.tagline}
          </p>

          <p className="hero-sub mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55 md:text-base">
            デジタル空間に吸い込まれるビジュアル。
            音と光が交差する、その先へ。
          </p>

          <div className="hero-cta mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#works"
              className="shadow-depth inline-flex items-center justify-center rounded-full bg-accent/90 px-8 py-3.5 text-sm text-[#0a080c] transition hover:bg-accent"
            >
              作品を見る
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider opacity-70">
                Works
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/25 px-8 py-3.5 text-sm text-[#f5f0e8] backdrop-blur-sm transition hover:border-accent-amber/40"
            >
              相談する
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-white/45">
                Contact
              </span>
            </a>
          </div>

          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
            scroll
          </p>
        </div>
      </div>
    </section>
  );
}
