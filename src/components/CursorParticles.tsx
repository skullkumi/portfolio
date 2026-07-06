"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#00e5c8",
  "#ff3d7a",
  "#7c6bff",
  "#9ec8ff",
  "#f5a623",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -100, y: -100, lastX: -100, lastY: -100, active: false });
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const pickColor = () => COLORS[(Math.random() * COLORS.length) | 0];

    const spawn = (x: number, y: number, dx: number, dy: number, count = 2) => {
      const speed = Math.hypot(dx, dy);
      const nx = speed > 0.01 ? dx / speed : 0;
      const ny = speed > 0.01 ? dy / speed : 0;
      const pool = particlesRef.current;

      for (let i = 0; i < count; i++) {
        if (pool.length >= 140) pool.shift();

        const spread = (Math.random() - 0.5) * 14;
        const life = 0.28 + Math.random() * 0.22;

        pool.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: nx * (18 + Math.random() * 28) + (Math.random() - 0.5) * 40 + spread * 0.15,
          vy: ny * (18 + Math.random() * 28) + (Math.random() - 0.5) * 40 + spread * 0.15,
          life,
          maxLife: life,
          size: 1.5 + Math.random() * 2.5,
          color: pickColor(),
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const p = pointerRef.current;
      const dx = e.clientX - p.lastX;
      const dy = e.clientY - p.lastY;
      const dist = Math.hypot(dx, dy);

      p.x = e.clientX;
      p.y = e.clientY;
      p.active = true;

      if (dist > 3) {
        const bursts = dist > 18 ? 3 : 2;
        spawn(e.clientX, e.clientY, dx, dy, bursts);
        p.lastX = e.clientX;
        p.lastY = e.clientY;
      }
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const pool = particlesRef.current;
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life -= dt;
        if (p.life <= 0) {
          pool.splice(i, 1);
          continue;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.vy += 12 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.life / p.maxLife;
        const alpha = t * t;
        const size = p.size * (0.35 + t * 0.65);

        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);

        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      const ptr = pointerRef.current;
      if (ptr.active) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#00e5c8";
        ctx.fillRect(ptr.x - 1, ptr.y - 1, 2, 2);
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden
    />
  );
}
