"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderCanvas } from "./ShaderCanvas";
import { ScreenOverlay } from "./ScreenOverlay";

gsap.registerPlugin(ScrollTrigger);

type HeroShaderDisplayProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

export function HeroShaderDisplay({ sectionRef }: HeroShaderDisplayProps) {
  const scrollRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    return () => st.kill();
  }, [sectionRef]);

  return (
    <div className="absolute inset-0">
      <ShaderCanvas scrollProgress={scrollRef} dprCap={0.75} fpsCap={24} interactive={false} />
      <ScreenOverlay className="opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex items-center justify-between px-5 md:top-24 md:px-10">
        <span className="font-mono text-[9px] tracking-[0.25em] text-white/30">
          KUMI_DISPLAY
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-accent/80">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          LIVE
        </span>
      </div>
    </div>
  );
}
