"use client";

import { useEffect, useRef } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const RIPPLE_COLORS = [
  "rgba(232, 160, 180, 0.45)",
  "rgba(212, 175, 90, 0.4)",
  "rgba(240, 230, 216, 0.35)",
];

export function TouchRipple() {
  const ripplesRef = useRef<Ripple[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    const spawn = (clientX: number, clientY: number) => {
      const size = 120 + Math.random() * 80;
      const ripple: Ripple = {
        id: idRef.current++,
        x: clientX,
        y: clientY,
        size,
      };
      ripplesRef.current.push(ripple);

      const el = document.createElement("span");
      el.className = "touch-ripple";
      el.style.left = `${ripple.x}px`;
      el.style.top = `${ripple.y}px`;
      el.style.width = `${ripple.size}px`;
      el.style.height = `${ripple.size}px`;
      el.style.background = `radial-gradient(circle, ${
        RIPPLE_COLORS[(ripple.id % RIPPLE_COLORS.length) | 0]
      } 0%, transparent 68%)`;
      layer.appendChild(el);

      const remove = () => {
        el.remove();
        ripplesRef.current = ripplesRef.current.filter((r) => r.id !== ripple.id);
      };

      el.addEventListener("animationend", remove, { once: true });
      window.setTimeout(remove, 900);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    />
  );
}
