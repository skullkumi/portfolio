"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxBg({ speed = 0.3 }: { speed?: number }) {
  const nearRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const near = nearRef.current;
    const far = farRef.current;
    const trigger = near?.parentElement;
    if (!near || !far || !trigger) return;

    const t1 = gsap.to(far, {
      yPercent: speed * 60,
      ease: "none",
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    });
    const t2 = gsap.to(near, {
      yPercent: speed * 120,
      ease: "none",
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    });

    return () => {
      t1.scrollTrigger?.kill();
      t1.kill();
      t2.scrollTrigger?.kill();
      t2.kill();
    };
  }, [speed]);

  return (
    <>
      <div
        ref={farRef}
        className="pointer-events-none absolute inset-0 grid-bg-deep opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,107,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,107,255,0.06) 1px, transparent 1px)
          `,
        }}
        aria-hidden
      />
      <div
        ref={nearRef}
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,200,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,61,122,0.05) 1px, transparent 1px)
          `,
        }}
        aria-hidden
      />
    </>
  );
}
