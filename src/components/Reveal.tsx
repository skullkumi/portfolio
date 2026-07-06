"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  scale?: number;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 44,
  stagger = 0,
  scale = 1,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets =
      stagger > 0 ? gsap.utils.toArray<HTMLElement>(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        scale: scale < 1 ? scale : undefined,
        duration: 0.75,
        delay,
        stagger: stagger || undefined,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, stagger, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
